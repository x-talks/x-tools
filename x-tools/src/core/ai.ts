/**
 * Free AI Integration Layer
 * 
 * Supports multiple free inference backends:
 * 1. Groq API (free tier, very fast)
 * 2. Transformers.js (browser-based, WebGPU)
 * 3. Fallback to rule-based
 */

import { SemanticAnalysis, SemanticTag, extractSemanticTags } from './ontology';
import { WIZARD_CONTENT } from './rules';

// ============================================================================
// GROQ API INTEGRATION (Free Tier)
// ============================================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Fast, free tier available

interface GroqConfig {
    apiKey?: string;
    model?: string;
}

// Default configuration
let groqConfig: GroqConfig = {
    apiKey: '', // User must enter key in settings
    model: GROQ_MODEL
};

export function configureGroq(apiKey: string, model: string = GROQ_MODEL) {
    groqConfig = { apiKey, model };
    localStorage.setItem('groq_api_key', apiKey);
}

export function getGroqApiKey(): string | null {
    return groqConfig.apiKey || localStorage.getItem('groq_api_key');
}

export function isGroqConfigured(): boolean {
    const hasKey = !!getGroqApiKey();
    console.log(`[AI Debug] Checking Groq Configuration: ${hasKey ? 'API Key Present' : 'No API Key Found'}`);
    return hasKey;
}

export async function callGroqAPI(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = getGroqApiKey();
    if (!apiKey) {
        console.error('[AI Debug] Attempted to call Groq API without API Key');
        throw new Error('Groq API key not configured');
    }

    console.log('[AI Debug] Starting Groq API Call...');
    console.log('[AI Debug] System Prompt:', systemPrompt);
    console.log('[AI Debug] User Prompt (first 100 chars):', prompt.substring(0, 100) + '...');

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
            max_tokens: 1500 // Increased token limit for larger JSON responses
        })
    });

    if (!response.ok) {
        console.error(`[AI Debug] Groq API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[AI Debug] Groq API Call Successful');
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

export async function detectSemanticRelationships(
    sourceText: string,
    targetText: string,
    sourceType: string,
    targetType: string
): Promise<{ hasRelationship: boolean; relationshipType?: string; strength?: number; explanation?: string }> {
    if (!isGroqConfigured()) {
        return ruleBased_detectRelationship(sourceText, targetText);
    }

    try {
        const prompt = `Analyze the semantic relationship between these two items:

Source (${sourceType}): "${sourceText}"
Target (${targetType}): "${targetText}"

Determine if there's a meaningful relationship. Return ONLY a JSON object:
{
  "hasRelationship": true/false,
  "relationshipType": "derives_from" | "implements" | "supports" | "reinforces" | null,
  "strength": 0-100,
  "explanation": "brief explanation"
}`;

        const result = await callGroqAPI(prompt, 'You are an ontology analysis expert.');
        const relationship = JSON.parse(result);
        return relationship;
    } catch (error) {
        console.error('AI relationship detection failed:', error);
        return ruleBased_detectRelationship(sourceText, targetText);
    }
}

export interface SuggestionOption {
    text: string;
    breakdown: Record<string, string>; // Formula part -> Content
    label?: string; // e.g. "Simple", "Creative", "Best-of"
}

export interface AIResponse {
    suggestions: SuggestionOption[];
}

export async function suggestWizardContent(
    cardName: string,
    config: {
        formula: string;
        description?: { What: string; Why: string };
        bestPractice?: string;
        examples?: string[];
    },
    userInput: string,
    context?: string
): Promise<AIResponse> {
    if (!isGroqConfigured()) {
        console.log('[AI Debug] Groq not configured. Using Rule-Based Fallback for:', cardName);
        // Fallback to rule-based if no API key
        switch (cardName) {
            case 'Purpose': return ruleBased_suggestPurpose();
            case 'Vision': return ruleBased_suggestVision();
            case 'Mission': return ruleBased_suggestMission();
            case 'Strategy': return ruleBased_suggestStrategy();
            default: return { suggestions: [] };
        }
    }

    try {
        const prompt = `You are an AI suggestion engine for Antigravity wizard cards. Your task is to take the exact text from the input window and generate structured, high-quality outputs according to the following rules.

### **Context & Guidelines (Reference Only)**
- **Definition**: ${config.description?.What || ''}
- **Why it matters**: ${config.description?.Why || ''}
- **Best Practices**: ${config.bestPractice || ''}
- **Formula**: "${config.formula}"

### **Step 1: Extract Core Purpose**
Parse the input text into the following structure based on the formula.

### **Step 2: Generate 4 Examples**
Produce 4 output examples based on the Core Purpose and parsed exactly into formula:

1. **Simple** – concise, clear, close to original wording.
2. **Sophisticated** – extend with business or practical context; show added value or impact.
3. **Generalized** – broad phrasing, relatable to multiple scenarios.
4. **Creative / Extended** – push boundaries while still linked to original purpose, use advanced reasoning.

### **Step 3: Synthesize Best-of Output**
Combine all examples into a single coherent, polished suggestion. Output should be professional, clear, and directly usable in the wizard card.

### **Step 4: Constraints & Rules**
- **CRITICAL**: Use the provided context ONLY for understanding the structure and rules. **NEVER** output one of the examples from the dataset directly.
- Always use **real AI reasoning**, no hardcoded or prefilled statements.
- Minimize hallucination; stay as close to the input text as possible.
- Include 3-4 examples, always show the final “best-of” combined version.
- Output should be structured in **readable, copy-pastable format**.

### **Step 5: Output Format (Template)**
Return ONLY a JSON object with this structure:
{
  "coreAnalysis": {
    "breakdown": { "part1": "...", "part2": "..." }
  },
  "suggestions": [
    {
      "type": "Simple",
      "text": "...",
      "breakdown": { "part1": "...", "part2": "..." }
    },
    {
      "type": "Sophisticated",
      "text": "...",
      "breakdown": { "part1": "...", "part2": "..." }
    },
    {
      "type": "Generalized",
      "text": "...",
      "breakdown": { "part1": "...", "part2": "..." }
    },
    {
      "type": "Creative",
      "text": "...",
      "breakdown": { "part1": "...", "part2": "..." }
    },
    {
      "type": "Best-of Combined",
      "text": "...",
      "breakdown": { "part1": "...", "part2": "..." }
    }
  ]
}

Input Text: "${userInput}"
${context ? `Context: ${context}` : ''}`;

        const result = await callGroqAPI(prompt, 'You are an expert in organizational design. Return strictly valid JSON.');
        const parsed = JSON.parse(result);

        // Map to AIResponse structure
        return {
            suggestions: parsed.suggestions.map((s: any) => ({
                text: s.text,
                breakdown: s.breakdown,
                label: s.type // We might need to add this field to SuggestionOption if we want to show it
            }))
        };
    } catch (error) {
        console.error('[AI Debug] AI suggestion failed. Error details:', error);
        console.log('[AI Debug] Switching to Rule-Based Fallback for:', cardName);
        // Fallback
        switch (cardName) {
            case 'Purpose': return ruleBased_suggestPurpose();
            case 'Vision': return ruleBased_suggestVision();
            case 'Mission': return ruleBased_suggestMission();
            case 'Strategy': return ruleBased_suggestStrategy();
            default: return { suggestions: [] };
        }
    }
}

export async function suggestPurpose(teamName?: string, industry?: string, userInput?: string): Promise<AIResponse> {
    if (userInput && userInput.trim().length > 2) {
        return suggestWizardContent('Purpose', {
            formula: WIZARD_CONTENT.Purpose.Formula,
            description: WIZARD_CONTENT.Purpose.Description,
            bestPractice: WIZARD_CONTENT.Purpose.BestPractice,
            examples: WIZARD_CONTENT.Purpose.Examples
        }, userInput);
    }
    // Fallback to generating from scratch if no input
    if (!isGroqConfigured()) return ruleBased_suggestPurpose(teamName, industry);

    // Generate from scratch logic (kept from before but simplified)
    const prompt = `Generate 3 Purpose statements for a team named "${teamName || 'Team'}" in the "${industry || 'Technology'}" industry. Formula: "${WIZARD_CONTENT.Purpose.Formula}". Return JSON with suggestions array.`;
    try {
        const result = await callGroqAPI(prompt, 'You are an expert in organizational design. Return strictly valid JSON.');
        return JSON.parse(result);
    } catch (e) { return ruleBased_suggestPurpose(teamName, industry); }
}

export async function suggestVision(purpose: string, userInput?: string): Promise<AIResponse> {
    if (userInput && userInput.trim().length > 2) {
        return suggestWizardContent('Vision', {
            formula: WIZARD_CONTENT.Vision.Formula,
            description: WIZARD_CONTENT.Vision.Description,
            bestPractice: WIZARD_CONTENT.Vision.BestPractice,
            examples: WIZARD_CONTENT.Vision.Examples
        }, userInput, `Purpose: ${purpose}`);
    }
    // Fallback
    if (!isGroqConfigured()) return ruleBased_suggestVision(purpose);
    const prompt = `Generate 3 Vision statements based on Purpose: "${purpose}". Formula: "${WIZARD_CONTENT.Vision.Formula}". Return JSON with suggestions array.`;
    try {
        const result = await callGroqAPI(prompt, 'You are a strategic visionary. Return strictly valid JSON.');
        return JSON.parse(result);
    } catch (e) { return ruleBased_suggestVision(purpose); }
}

export async function suggestMission(vision: string, userInput?: string): Promise<AIResponse> {
    if (userInput && userInput.trim().length > 2) {
        return suggestWizardContent('Mission', {
            formula: WIZARD_CONTENT.Mission.Formula,
            description: WIZARD_CONTENT.Mission.Description,
            bestPractice: WIZARD_CONTENT.Mission.BestPractice,
            examples: WIZARD_CONTENT.Mission.Examples
        }, userInput, `Vision: ${vision}`);
    }
    if (!isGroqConfigured()) return ruleBased_suggestMission(vision);
    const prompt = `Generate 3 Mission statements based on Vision: "${vision}". Formula: "${WIZARD_CONTENT.Mission.Formula}". Return JSON with suggestions array.`;
    try {
        const result = await callGroqAPI(prompt, 'You are an operations strategist. Return strictly valid JSON.');
        return JSON.parse(result);
    } catch (e) { return ruleBased_suggestMission(vision); }
}

export async function suggestStrategy(mission: string, userInput?: string): Promise<AIResponse> {
    if (userInput && userInput.trim().length > 2) {
        return suggestWizardContent('Strategy', {
            formula: WIZARD_CONTENT.Strategy.Formula,
            description: WIZARD_CONTENT.Strategy.Description,
            bestPractice: WIZARD_CONTENT.Strategy.BestPractice,
            examples: WIZARD_CONTENT.Strategy.Examples
        }, userInput, `Mission: ${mission}`);
    }
    if (!isGroqConfigured()) return ruleBased_suggestStrategy(mission);
    const prompt = `Generate 3 Strategy statements based on Mission: "${mission}". Formula: "${WIZARD_CONTENT.Strategy.Formula}". Return JSON with suggestions array.`;
    try {
        const result = await callGroqAPI(prompt, 'You are a business strategist. Return strictly valid JSON.');
        return JSON.parse(result);
    } catch (e) { return ruleBased_suggestStrategy(mission); }
}

export async function suggestValues(purpose?: string, industry?: string): Promise<string[]> {
    if (!isGroqConfigured()) {
        return ruleBased_suggestValues();
    }

    try {
        const purposeContext = purpose ? `Purpose: ${purpose}` : '';
        const industryContext = industry ? `Industry: ${industry}` : '';

        const prompt = `Based on this context:
${purposeContext}
${industryContext}

Generate 3-5 core values that should guide the team.
Format: Return ONLY a JSON array of value names (1-3 words each).
Example: ["Innovation", "Customer Focus", "Integrity", "Excellence"]`;

        const result = await callGroqAPI(prompt, 'You are a team culture expert.');
        const values = JSON.parse(result);
        return Array.isArray(values) ? values : [];
    } catch (error) {
        console.error('AI suggestion failed:', error);
        return ruleBased_suggestValues();
    }
}

export async function suggestGoals(mission?: string, strategy?: string): Promise<string[]> {
    if (!isGroqConfigured()) {
        return ruleBased_suggestGoals();
    }

    try {
        const missionContext = mission ? `Mission: ${mission}` : '';
        const strategyContext = strategy ? `Strategy: ${strategy}` : '';

        const prompt = `Based on this context:
${missionContext}
${strategyContext}

Generate 3 specific, measurable goals that prove progress.
Format: Return ONLY a JSON array of goal statements.
Example: ["Achieve 99% uptime", "Reduce deployment time to < 1 hour", "Increase team satisfaction to 8/10"]`;

        const result = await callGroqAPI(prompt, 'You are a goal-setting expert.');
        const goals = JSON.parse(result);
        return Array.isArray(goals) ? goals : [];
    } catch (error) {
        console.error('AI suggestion failed:', error);
        return ruleBased_suggestGoals();
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

function ruleBased_suggestPurpose(_teamName?: string, _industry?: string): AIResponse {
    const suggestions = [
        {
            text: "To empower teams to deliver exceptional value through collaboration and innovation",
            breakdown: {
                "[What We Do]": "empower teams",
                "[For Whom]": "teams",
                "[Ultimate Impact]": "deliver exceptional value"
            }
        },
        {
            text: "To build sustainable solutions that transform how people work together",
            breakdown: {
                "[What We Do]": "build sustainable solutions",
                "[For Whom]": "people",
                "[Ultimate Impact]": "transform how people work together"
            }
        },
        {
            text: "To create an environment where every team member can thrive and contribute meaningfully",
            breakdown: {
                "[What We Do]": "create an environment",
                "[For Whom]": "every team member",
                "[Ultimate Impact]": "thrive and contribute meaningfully"
            }
        }
    ];

    return { suggestions };
}

function ruleBased_suggestVision(_purpose?: string): AIResponse {
    const suggestions = [
        {
            text: "A future where teams operate with complete autonomy and alignment",
            breakdown: {
                "[A Future State]": "A future where teams operate",
                "[For Whom]": "teams",
                "[Transformation/Impact]": "complete autonomy and alignment"
            }
        },
        {
            text: "An organization recognized for innovation, quality, and sustainable practices",
            breakdown: {
                "[A Future State]": "An organization recognized",
                "[For Whom]": "stakeholders/market",
                "[Transformation/Impact]": "innovation, quality, and sustainable practices"
            }
        },
        {
            text: "A workplace where excellence and continuous improvement are the norm",
            breakdown: {
                "[A Future State]": "A workplace",
                "[For Whom]": "employees",
                "[Transformation/Impact]": "excellence and continuous improvement are the norm"
            }
        }
    ];
    return { suggestions };
}

function ruleBased_suggestMission(_vision?: string): AIResponse {
    const suggestions = [
        {
            text: "Deliver high-quality solutions through agile practices and continuous learning",
            breakdown: {
                "[What We Do]": "Deliver high-quality solutions",
                "[What We Deliver/How]": "agile practices",
                "[Target/Problem]": "continuous learning"
            }
        },
        {
            text: "Build products that solve real customer problems with speed and reliability",
            breakdown: {
                "[What We Do]": "Build products",
                "[What We Deliver/How]": "speed and reliability",
                "[Target/Problem]": "solve real customer problems"
            }
        },
        {
            text: "Create value by combining technical excellence with user-centric design",
            breakdown: {
                "[What We Do]": "Create value",
                "[What We Deliver/How]": "combining technical excellence",
                "[Target/Problem]": "user-centric design"
            }
        }
    ];
    return { suggestions };
}

function ruleBased_suggestStrategy(_mission?: string): AIResponse {
    const suggestions = [
        {
            text: "Compete through rapid iteration, customer feedback loops, and technical excellence",
            breakdown: {
                "[Our Differentiation]": "rapid iteration",
                "[Through What Approach]": "customer feedback loops",
                "[Market/Problem]": "technical excellence"
            }
        },
        {
            text: "Win by combining AI-powered automation with human-centered design principles",
            breakdown: {
                "[Our Differentiation]": "AI-powered automation",
                "[Through What Approach]": "human-centered design principles",
                "[Market/Problem]": "Win"
            }
        },
        {
            text: "Lead the market by delivering exceptional quality at sustainable velocity",
            breakdown: {
                "[Our Differentiation]": "delivering exceptional quality",
                "[Through What Approach]": "sustainable velocity",
                "[Market/Problem]": "Lead the market"
            }
        }
    ];
    return { suggestions };
}

function ruleBased_suggestValues(): string[] {
    const allValues = [
        "Innovation", "Customer Focus", "Integrity", "Excellence", "Collaboration",
        "Transparency", "Accountability", "Continuous Learning", "Quality", "Speed"
    ];
    // Shuffle and take 3-5
    const shuffled = allValues.sort(() => 0.5 - Math.random());
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 values
    return shuffled.slice(0, count);
}

function ruleBased_suggestGoals(): string[] {
    return [
        "Achieve ≥95% customer satisfaction score",
        "Reduce deployment lead time to <1 day",
        "Maintain system uptime ≥99.9%"
    ];
}

function ruleBased_detectRelationship(sourceText: string, targetText: string): { hasRelationship: boolean; relationshipType?: string; strength?: number; explanation?: string } {
    // Simple keyword overlap detection
    const sourceWords = sourceText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const targetWords = targetText.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const commonWords = sourceWords.filter(w => targetWords.includes(w));
    const overlapRatio = commonWords.length / Math.min(sourceWords.length, targetWords.length);

    if (overlapRatio > 0.3) {
        return {
            hasRelationship: true,
            relationshipType: 'reinforces',
            strength: Math.min(100, Math.round(overlapRatio * 100)),
            explanation: `Shares ${commonWords.length} key concepts: ${commonWords.slice(0, 3).join(', ')}`
        };
    }

    return { hasRelationship: false };
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
    getGroqApiKey,
    isConfigured: isGroqConfigured,
    callGroqAPI,

    // Suggestions
    suggestPurpose,
    suggestVision,
    suggestMission,
    suggestStrategy,
    suggestValues,
    suggestPrinciples,
    suggestBehaviors,
    suggestGoals,
    improveMission,

    // Analysis
    analyzeText,
    classifyTextLocal,
    detectSemanticRelationships,

    // Loading
    loadTransformersJS,
};

export default AI;
