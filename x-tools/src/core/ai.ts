/**
 * Free AI Integration Layer
 * 
 * Supports multiple free inference backends:
 * 1. Groq API (free tier, very fast)
 * 2. Transformers.js (browser-based, WebGPU)
 * 3. Fallback to rule-based
 */

import { SemanticAnalysis, SemanticTag, extractSemanticTags } from './ontology';

// ============================================================================
// GROQ API INTEGRATION (Free Tier)
// ============================================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Fast, free tier available

interface GroqConfig {
    apiKey?: string;
    model?: string;
}

let groqConfig: GroqConfig = {};

export function configureGroq(apiKey: string, model: string = GROQ_MODEL) {
    groqConfig = { apiKey, model };
    localStorage.setItem('groq_api_key', apiKey);
}

export function getGroqApiKey(): string | null {
    return groqConfig.apiKey || localStorage.getItem('groq_api_key');
}

export function isGroqConfigured(): boolean {
    return !!getGroqApiKey();
}

async function callGroqAPI(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = getGroqApiKey();
    if (!apiKey) {
        throw new Error('Groq API key not configured');
    }

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: groqConfig.model || GROQ_MODEL,
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

// ============================================================================
// AI-POWERED SUGGESTIONS
// ============================================================================

export async function suggestPrinciples(values: string[]): Promise<string[]> {
    if (!isGroqConfigured()) {
        return ruleBased_suggestPrinciples(values);
    }

    try {
        const prompt = `Based on these core values: ${values.join(', ')}
        
Generate 3 specific, actionable principles that teams should follow.
Format: Return ONLY a JSON array of strings, no explanation.
Example: ["Principle 1", "Principle 2", "Principle 3"]`;

        const result = await callGroqAPI(prompt, 'You are a team alignment expert.');
        const principles = JSON.parse(result);
        return Array.isArray(principles) ? principles : [];
    } catch (error) {
        console.error('AI suggestion failed, falling back to rules:', error);
        return ruleBased_suggestPrinciples(values);
    }
}

export async function suggestBehaviors(principle: string, values: string[]): Promise<string[]> {
    if (!isGroqConfigured()) {
        return ruleBased_suggestBehaviors(principle);
    }

    try {
        const prompt = `Given this principle: "${principle}"
And these values: ${values.join(', ')}

Generate 2 concrete, observable behaviors that demonstrate this principle.
Format: Return ONLY a JSON array of strings.
Example: ["Specific behavior 1", "Specific behavior 2"]`;

        const result = await callGroqAPI(prompt, 'You are a team culture expert.');
        const behaviors = JSON.parse(result);
        return Array.isArray(behaviors) ? behaviors : [];
    } catch (error) {
        console.error('AI suggestion failed, falling back to rules:', error);
        return ruleBased_suggestBehaviors(principle);
    }
}

export async function improveMission(currentMission: string, purpose: string): Promise<string> {
    if (!isGroqConfigured()) {
        return currentMission; // No fallback, just return original
    }

    try {
        const prompt = `Improve this mission statement to be more specific and actionable:
"${currentMission}"

Purpose: "${purpose}"

Return ONLY the improved mission, no explanation.`;

        return await callGroqAPI(prompt, 'You are a strategic communication expert.');
    } catch (error) {
        console.error('AI improvement failed:', error);
        return currentMission;
    }
}

export async function analyzeText(text: string): Promise<Partial<SemanticAnalysis>> {
    if (!isGroqConfigured()) {
        return ruleBased_analyzeText(text);
    }

    try {
        const prompt = `Analyze this text: "${text}"

Return a JSON object with:
{
  "sentiment": <number from -1 to 1>,
  "complexity": <readability score 0-100, where 100 is simplest>,
  "specificity": <score 0-100, where 100 is most specific>,
  "feedback": "<one sentence of constructive feedback>"
}`;

        const result = await callGroqAPI(prompt, 'You are a text analysis expert.');
        const analysis = JSON.parse(result);

        return {
            sentiment: analysis.sentiment || 0,
            complexity: analysis.complexity || 50,
            specificity: analysis.specificity || 50,
        };
    } catch (error) {
        console.error('AI analysis failed, falling back to rules:', error);
        return ruleBased_analyzeText(text);
    }
}

// ============================================================================
// RULE-BASED FALLBACKS (No AI needed)
// ============================================================================

function ruleBased_suggestPrinciples(values: string[]): string[] {
    const templates = [
        `Always prioritize {value} in decision-making`,
        `Make {value} visible in all team interactions`,
        `Measure success by how well we demonstrate {value}`,
        `Challenge decisions that don't align with {value}`,
    ];

    const suggestions: string[] = [];
    values.slice(0, 3).forEach((value, i) => {
        const template = templates[i % templates.length];
        suggestions.push(template.replace('{value}', value.toLowerCase()));
    });

    return suggestions;
}

function ruleBased_suggestBehaviors(principle: string): string[] {
    // Extract keywords and suggest behaviors
    const keywords = principle.toLowerCase().split(' ').filter(w => w.length > 4);

    return [
        `Practice ${keywords[0] || 'this'} in daily standup meetings`,
        `Review ${keywords[1] || 'progress'} in weekly retrospectives`,
    ];
}

function ruleBased_analyzeText(text: string): Partial<SemanticAnalysis> {
    // Simple heuristics
    const wordCount = text.split(' ').length;
    const avgWordLength = text.length / wordCount;

    // Complexity: longer words and sentences = more complex
    const complexity = Math.min(100, Math.max(0, 100 - (avgWordLength * 5)));

    // Specificity: numbers, specific terms = more specific
    const hasNumbers = /\d/.test(text);
    const hasSpecificTerms = /\b(we|I|our|team|always|never|must|will)\b/i.test(text);
    const specificity = (hasNumbers ? 30 : 0) + (hasSpecificTerms ? 30 : 0) + (wordCount > 10 ? 20 : 0);

    // Sentiment: positive words vs negative words
    const positiveWords = ['good', 'great', 'excellent', 'success', 'improve', 'better', 'strong'];
    const negativeWords = ['bad', 'poor', 'fail', 'worse', 'weak', 'problem'];
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
    const sentiment = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);

    return { sentiment, complexity, specificity };
}

// ============================================================================
// TRANSFORMERS.JS INTEGRATION (Browser-based ML)
// ============================================================================

// Note: We'll lazy-load transformers.js only when needed
let transformersLoaded = false;
let pipeline: any = null;

export async function loadTransformersJS(): Promise<boolean> {
    if (transformersLoaded) return true;

    try {
        // Dynamically import transformers.js
        const { pipeline: pipelineImport } = await import('@xenova/transformers');
        pipeline = pipelineImport;
        transformersLoaded = true;
        return true;
    } catch (error) {
        console.error('Failed to load Transformers.js:', error);
        return false;
    }
}

export async function classifyTextLocal(text: string): Promise<SemanticTag[]> {
    try {
        if (!transformersLoaded) {
            await loadTransformersJS();
        }

        if (!pipeline) {
            return extractSemanticTags(text); // Fallback
        }

        // Use zero-shot classification
        const classifier = await pipeline('zero-shot-classification');
        const result = await classifier(text, [
            'speed and agility',
            'quality and excellence',
            'innovation and creativity',
            'stability and reliability',
            'autonomy and freedom',
            'control and governance',
            'collaboration and teamwork',
            'individual achievement',
            'customer focus',
            'business results',
            'transparency and openness',
            'privacy and security'
        ]);

        // Convert to semantic tags
        const tags: SemanticTag[] = [];
        result.labels.forEach((label: string, i: number) => {
            if (result.scores[i] > 0.3) {
                // Map to our concept categories
                const concept = labelToConcept(label);
                if (concept) {
                    tags.push({
                        concept,
                        confidence: result.scores[i],
                        keywords: [label]
                    });
                }
            }
        });

        return tags.length > 0 ? tags : extractSemanticTags(text);
    } catch (error) {
        console.error('Local classification failed:', error);
        return extractSemanticTags(text);
    }
}

function labelToConcept(label: string): any {
    const mapping: Record<string, string> = {
        'speed and agility': 'SPEED',
        'quality and excellence': 'QUALITY',
        'innovation and creativity': 'INNOVATION',
        'stability and reliability': 'STABILITY',
        'autonomy and freedom': 'AUTONOMY',
        'control and governance': 'CONTROL',
        'collaboration and teamwork': 'COLLABORATION',
        'individual achievement': 'INDIVIDUAL',
        'customer focus': 'CUSTOMER',
        'business results': 'BUSINESS',
        'transparency and openness': 'TRANSPARENCY',
        'privacy and security': 'PRIVACY',
    };
    return mapping[label] || null;
}

// ============================================================================
// UNIFIED AI INTERFACE
// ============================================================================

export const AI = {
    // Configuration
    configure: configureGroq,
    isConfigured: isGroqConfigured,

    // Suggestions
    suggestPrinciples,
    suggestBehaviors,
    improveMission,

    // Analysis
    analyzeText,
    classifyTextLocal,

    // Loading
    loadTransformersJS,
};

export default AI;
