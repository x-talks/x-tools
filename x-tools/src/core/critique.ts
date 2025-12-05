import { callGroqAPI, isGroqConfigured } from './ai';

export interface CritiqueResult {
    score: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    suggestion: string;
    persona: 'Analyst' | 'Skeptic' | 'Fan';
}

export type PersonaType = 'Analyst' | 'Skeptic' | 'Fan'; // Default, Critical, Supportive

const FIELD_CRITERIA: Record<string, string> = {
    Purpose: "Must be timeless, aspirational, and answer 'Why we exist'. Avoid specific products or timelines.",
    Vision: "Must be concrete, visualizable future state. Answer 'Where are we going?'.",
    Mission: "Must be actionable, concrete, and answer 'What do we do everyday?'.",
    Values: "Must be distinct, guiding principles, not generic platitudes.",
    Strategy: "Must describe the unique approach/advantage, not just 'do good work'."
};

export async function critiqueContent(
    fieldType: string,
    content: string,
    persona: PersonaType = 'Analyst'
): Promise<CritiqueResult> {
    if (!content || content.length < 10) return getEmptyCritique();

    if (!isGroqConfigured()) {
        return getRuleBasedCritique(content);
    }

    try {
        const criteria = FIELD_CRITERIA[fieldType] || "Be clear, concise, and inspiring.";

        const systemPrompt = `You are an expert organizational consultant acting as a ${persona}.
        
        ROLE DEFINITIONS:
        - Analyst: Balanced, professional, focuses on clarity and logic.
        - Skeptic: Critical, looks for flaws, vague language, and bullshit.
        - Fan: Enthusiastic, looks for potential and what resonates emotionally.
        
        Your task is to critique a ${fieldType} statement based on these criteria: "${criteria}"
        
        Return ONLY a JSON object:
        {
            "score": <0-100 integer>,
            "strengths": ["point 1", "point 2"],
            "weaknesses": ["point 1", "point 2"],
            "suggestion": "One specific actionable sentence to improve it."
        }`;

        const userPrompt = `Critique this ${fieldType}: "${content}"`;

        const result = await callGroqAPI(userPrompt, systemPrompt);
        const parsed = JSON.parse(result);

        return {
            score: parsed.score || 50,
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            suggestion: parsed.suggestion || "Consider refining based on standard best practices.",
            persona
        };
    } catch (error) {
        console.error("Critique failed:", error);
        return getRuleBasedCritique(content);
    }
}

function getEmptyCritique(): CritiqueResult {
    return {
        score: 0,
        strengths: [],
        weaknesses: [],
        suggestion: "",
        persona: 'Analyst'
    };
}

function getRuleBasedCritique(content: string): CritiqueResult {
    // Simple heuristics fallbacks
    const length = content.length;
    const score = Math.min(100, Math.max(20, length / 2));

    return {
        score,
        strengths: ["Content provided"],
        weaknesses: length < 50 ? ["Too short to analyze deeply"] : [],
        suggestion: "Add more specific detail to get better feedback.",
        persona: 'Analyst'
    };
}
