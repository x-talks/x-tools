/**
 * AI-Powered Logo Generator
 * 
 * Generates SVG logos based on team attributes
 * Uses AI to suggest styles and colors, with fallback to rule-based generation
 */

import AI from './ai';

export interface LogoStyle {
    type: 'geometric' | 'abstract' | 'letter' | 'icon';
    colors: {
        primary: string;
        secondary: string;
        accent?: string;
    };
    shape: 'circle' | 'square' | 'hexagon' | 'shield' | 'custom';
    symbolType?: string; // e.g., "mountain", "rocket", "network"
}

export interface GeneratedLogo {
    svg: string;
    style: LogoStyle;
    description: string;
}

/**
 * AI Design Parameters (what Groq decides)
 */
interface AILogoDesign {
    concept: string; // e.g., "mountain peak", "interconnected nodes", "rising sun"
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    pattern: 'geometric' | 'organic' | 'minimal' | 'tech' | 'abstract';
    symbolism: string; // brief explanation
}

/**
 * Generate logo using Groq AI to make design decisions
 */
export async function generateLogoWithAI(
    teamName: string,
    purpose?: string,
    values?: string[]
): Promise<GeneratedLogo> {
    if (AI.isConfigured()) {
        try {
            const styleHints = values?.length ? `Team values: ${values.join(', ')}` : '';
            const purposeHint = purpose ? `Team purpose: ${purpose}` : '';

            const prompt = `You are a professional logo designer. Design a logo concept for "${teamName}".

${purposeHint}
${styleHints}

Provide a design concept as JSON (no markdown, just JSON):
{
  "concept": "brief visual concept (e.g., 'mountain peak symbolizing growth', 'interconnected circles for collaboration')",
  "primaryColor": "#hexcolor (main brand color)",
  "secondaryColor": "#hexcolor (complementary color)",
  "accentColor": "#hexcolor (optional highlight)",
  "pattern": "geometric|organic|minimal|tech|abstract",
  "symbolism": "one sentence explaining the design choice"
}

Design concept:`;

            const { default: aiModule } = await import('./ai');
            const response = await aiModule.callGroqAPI?.(prompt, 'You are a professional brand designer. Return only valid JSON.');

            if (response) {
                // Clean response
                let jsonStr = response.trim();
                jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                try {
                    const design: AILogoDesign = JSON.parse(jsonStr);

                    // Generate SVG from AI design parameters
                    const svg = generateSVGFromAIDesign(design, teamName);

                    return {
                        svg,
                        style: {
                            type: design.pattern === 'geometric' ? 'geometric' : 'abstract',
                            colors: {
                                primary: design.primaryColor,
                                secondary: design.secondaryColor,
                                accent: design.accentColor
                            },
                            shape: 'custom'
                        },
                        description: design.symbolism
                    };
                } catch (parseError) {
                    console.error('Failed to parse AI design:', parseError);
                }
            }
        } catch (error) {
            console.error('Groq design generation failed, using fallback:', error);
        }
    }

    // Fallback to rule-based generation
    return generateLogoRuleBased(teamName, values);
}

/**
 * Generate sophisticated SVG from AI design parameters
 */
function generateSVGFromAIDesign(design: AILogoDesign, teamName: string): string {
    const size = 200;
    const center = size / 2;
    const firstLetter = teamName.charAt(0).toUpperCase();

    // Choose template based on pattern
    switch (design.pattern) {
        case 'geometric':
            return generateGeometricFromDesign(size, center, design);
        case 'tech':
            return generateTechFromDesign(size, center, design);
        case 'minimal':
            return generateMinimalFromDesign(size, center, design, firstLetter);
        case 'organic':
            return generateOrganicFromDesign(size, center, design);
        case 'abstract':
        default:
            return generateAbstractFromDesign(size, center, design);
    }
}

/**
 * Rule-based logo generation (fallback)
 */
function generateLogoRuleBased(teamName: string, values?: string[]): GeneratedLogo {
    const firstLetter = teamName.charAt(0).toUpperCase();
    const colors = selectColorsFromValues(values);

    const style: LogoStyle = {
        type: 'letter',
        colors,
        shape: 'circle'
    };

    const svg = generateSVGFromStyle(style, teamName);

    return {
        svg,
        style,
        description: `Letter-based logo using the initial "${firstLetter}" with a professional color scheme`
    };
}

/**
 * Parametric templates using AI design parameters
 */
function generateGeometricFromDesign(size: number, center: number, design: AILogoDesign): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${design.primaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${design.secondaryColor};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.25"/>
            </filter>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#grad1)" filter="url(#shadow)"/>
        <polygon points="${center},40 ${center + 50},${center} ${center},${size - 40} ${center - 50},${center}" 
                 fill="white" opacity="0.15"/>
        <circle cx="${center}" cy="${center}" r="${center - 35}" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
        ${design.accentColor ? `<circle cx="${center}" cy="${center}" r="${center - 55}" fill="${design.accentColor}" opacity="0.2"/>` : ''}
    </svg>`;
}

function generateTechFromDesign(size: number, center: number, design: AILogoDesign): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${design.primaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${design.secondaryColor};stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect x="0" y="0" width="${size}" height="${size}" rx="45" fill="url(#techGrad)"/>
        <circle cx="60" cy="60" r="20" fill="white" opacity="0.9" filter="url(#glow)"/>
        <circle cx="140" cy="60" r="20" fill="white" opacity="0.9" filter="url(#glow)"/>
        <circle cx="${center}" cy="140" r="20" fill="white" opacity="0.9" filter="url(#glow)"/>
        <line x1="60" y1="60" x2="140" y2="60" stroke="white" stroke-width="5" opacity="0.6"/>
        <line x1="60" y1="60" x2="${center}" y2="140" stroke="white" stroke-width="5" opacity="0.6"/>
        <line x1="140" y1="60" x2="${center}" y2="140" stroke="white" stroke-width="5" opacity="0.6"/>
        ${design.accentColor ? `<circle cx="${center}" cy="${center}" r="15" fill="${design.accentColor}" opacity="0.8"/>` : ''}
    </svg>`;
}

function generateMinimalFromDesign(size: number, center: number, design: AILogoDesign, letter: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="minGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${design.primaryColor};stop-opacity:1" />
                <stop offset="50%" style="stop-color:${design.secondaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${design.primaryColor};stop-opacity:0.8" />
            </linearGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 15}" fill="url(#minGrad)"/>
        <text x="${center}" y="${center}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="100" 
              font-weight="300" 
              fill="white" 
              opacity="0.95">${letter}</text>
        ${design.accentColor ? `<circle cx="${center}" cy="${center}" r="${center - 25}" fill="none" stroke="${design.accentColor}" stroke-width="3" opacity="0.4"/>` : ''}
    </svg>`;
}

function generateOrganicFromDesign(size: number, center: number, design: AILogoDesign): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <radialGradient id="orgGrad">
                <stop offset="0%" style="stop-color:${design.primaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${design.secondaryColor};stop-opacity:1" />
            </radialGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#orgGrad)"/>
        <path d="M 60,${center} Q ${center},40 140,${center} T 140,140 Q ${center},180 60,140 T 60,${center} Z" 
              fill="white" opacity="0.2"/>
        <circle cx="${center - 30}" cy="${center - 30}" r="25" fill="white" opacity="0.15"/>
        <circle cx="${center + 30}" cy="${center + 20}" r="20" fill="white" opacity="0.12"/>
        ${design.accentColor ? `<circle cx="${center}" cy="${center + 35}" r="18" fill="${design.accentColor}" opacity="0.25"/>` : ''}
    </svg>`;
}

function generateAbstractFromDesign(size: number, center: number, design: AILogoDesign): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="absGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${design.primaryColor};stop-opacity:1" />
                <stop offset="50%" style="stop-color:${design.secondaryColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${design.primaryColor};stop-opacity:0.7" />
            </linearGradient>
            <radialGradient id="absGrad2">
                <stop offset="0%" style="stop-color:white;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:white;stop-opacity:0" />
            </radialGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#absGrad1)"/>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#absGrad2)"/>
        <path d="M 70,70 Q ${center},50 130,70 T 130,130 Q ${center},150 70,130 T 70,70 Z" 
              fill="white" opacity="0.2"/>
        <circle cx="${center}" cy="${center - 25}" r="18" fill="white" opacity="0.25"/>
        <circle cx="${center + 30}" cy="${center + 20}" r="15" fill="white" opacity="0.2"/>
        <circle cx="${center - 30}" cy="${center + 20}" r="12" fill="white" opacity="0.15"/>
        ${design.accentColor ? `<circle cx="${center}" cy="${center}" r="8" fill="${design.accentColor}" opacity="0.6"/>` : ''}
    </svg>`;
}

/**
 * Select colors based on team values
 */
function selectColorsFromValues(values?: string[]): { primary: string; secondary: string; accent?: string } {
    if (!values || values.length === 0) {
        return {
            primary: '#3b82f6', // Blue
            secondary: '#1e40af'
        };
    }

    const valueText = values.join(' ').toLowerCase();

    // Innovation/Creative themes
    if (valueText.includes('innovat') || valueText.includes('creativ')) {
        return { primary: '#8b5cf6', secondary: '#6d28d9' }; // Purple
    }

    // Trust/Stability themes
    if (valueText.includes('trust') || valueText.includes('reliab') || valueText.includes('stabl')) {
        return { primary: '#3b82f6', secondary: '#1e40af' }; // Blue
    }

    // Growth/Nature themes
    if (valueText.includes('growth') || valueText.includes('sustain') || valueText.includes('green')) {
        return { primary: '#10b981', secondary: '#059669' }; // Green
    }

    // Energy/Action themes
    if (valueText.includes('speed') || valueText.includes('agil') || valueText.includes('fast')) {
        return { primary: '#f59e0b', secondary: '#d97706' }; // Orange
    }

    // Passion/Excellence themes
    if (valueText.includes('excellen') || valueText.includes('passion')) {
        return { primary: '#ef4444', secondary: '#dc2626' }; // Red
    }

    // Default professional
    return { primary: '#3b82f6', secondary: '#1e40af' };
}

/**
 * Generate SVG from style configuration
 */
function generateSVGFromStyle(style: LogoStyle, teamName: string): string {
    const size = 200;
    const center = size / 2;

    const firstLetter = teamName.charAt(0).toUpperCase();

    switch (style.type) {
        case 'letter':
            return generateLetterLogo(size, center, firstLetter, style);
        case 'geometric':
            return generateGeometricLogo(size, center, style);
        case 'icon':
            return generateIconLogo(size, style);
        case 'abstract':
            return generateAbstractLogo(size, center, style);
        default:
            return generateLetterLogo(size, center, firstLetter, style);
    }
}

function generateLetterLogo(size: number, center: number, letter: string, style: LogoStyle): string {
    const shapeElement = style.shape === 'circle'
        ? `<circle cx="${center}" cy="${center}" r="${center - 10}" fill="${style.colors.primary}"/>`
        : `<rect x="10" y="10" width="${size - 20}" height="${size - 20}" rx="20" fill="${style.colors.primary}"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        ${shapeElement}
        <text x="${center}" y="${center}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="90" 
              font-weight="700" 
              fill="white">${letter}</text>
    </svg>`;
}

function generateGeometricLogo(size: number, center: number, style: LogoStyle): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="geomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${style.colors.primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${style.colors.secondary};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#geomGrad)" filter="url(#shadow)"/>
        <polygon points="${center},40 ${center + 50},${center} ${center},${size - 40} ${center - 50},${center}" 
                 fill="white" opacity="0.2"/>
        <circle cx="${center}" cy="${center}" r="${center - 40}" fill="none" stroke="white" stroke-width="3" opacity="0.4"/>
    </svg>`;
}

function generateIconLogo(size: number, style: LogoStyle): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${style.colors.primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${style.colors.secondary};stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect x="0" y="0" width="${size}" height="${size}" rx="40" fill="url(#iconGrad)"/>
        <circle cx="60" cy="60" r="18" fill="white" opacity="0.95" filter="url(#glow)"/>
        <circle cx="140" cy="60" r="18" fill="white" opacity="0.95" filter="url(#glow)"/>
        <circle cx="100" cy="140" r="18" fill="white" opacity="0.95" filter="url(#glow)"/>
        <line x1="60" y1="60" x2="140" y2="60" stroke="white" stroke-width="4" opacity="0.7"/>
        <line x1="60" y1="60" x2="100" y2="140" stroke="white" stroke-width="4" opacity="0.7"/>
        <line x1="140" y1="60" x2="100" y2="140" stroke="white" stroke-width="4" opacity="0.7"/>
    </svg>`;
}

function generateAbstractLogo(size: number, center: number, style: LogoStyle): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="abstractGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${style.colors.primary};stop-opacity:1" />
                <stop offset="50%" style="stop-color:${style.colors.secondary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${style.colors.primary};stop-opacity:0.8" />
            </linearGradient>
            <radialGradient id="abstractGrad2">
                <stop offset="0%" style="stop-color:white;stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:white;stop-opacity:0" />
            </radialGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#abstractGrad1)"/>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#abstractGrad2)"/>
        <path d="M 60,60 Q 100,40 140,60 T 140,140 Q 100,160 60,140 T 60,60 Z" 
              fill="white" opacity="0.25"/>
        <circle cx="${center}" cy="${center - 20}" r="15" fill="white" opacity="0.3"/>
        <circle cx="${center + 25}" cy="${center + 15}" r="12" fill="white" opacity="0.25"/>
        <circle cx="${center - 25}" cy="${center + 15}" r="10" fill="white" opacity="0.2"/>
    </svg>`;
}

/**
 * Convert SVG string to data URL for use in img tags
 */
export function svgToDataURL(svg: string): string {
    const encoded = encodeURIComponent(svg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate multiple logo variations
 */
export async function generateLogoVariations(
    teamName: string,
    purpose?: string,
    values?: string[]
): Promise<GeneratedLogo[]> {
    const variations: GeneratedLogo[] = [];

    // If AI is configured, generate AI-guided variations
    if (AI.isConfigured()) {
        // Try to generate one AI-guided logo
        const aiLogo = await generateLogoWithAI(teamName, purpose, values);
        variations.push(aiLogo);

        // If successful, generate 3 more with different pattern hints
        if (aiLogo.description !== 'Letter-based logo using the initial') {
            const patterns: Array<'geometric' | 'tech' | 'minimal' | 'organic'> = ['geometric', 'tech', 'minimal'];

            for (const pattern of patterns) {
                try {
                    const styleHints = values?.length ? `Team values: ${values.join(', ')}` : '';
                    const purposeHint = purpose ? `Team purpose: ${purpose}` : '';

                    const prompt = `You are a professional logo designer. Design a ${pattern} style logo concept for "${teamName}".

${purposeHint}
${styleHints}

Provide a design concept as JSON (no markdown, just JSON):
{
  "concept": "brief visual concept",
  "primaryColor": "#hexcolor",
  "secondaryColor": "#hexcolor",
  "accentColor": "#hexcolor",
  "pattern": "${pattern}",
  "symbolism": "one sentence explaining the design"
}

Design concept:`;

                    const { default: aiModule } = await import('./ai');
                    const response = await aiModule.callGroqAPI?.(prompt, 'You are a professional brand designer. Return only valid JSON.');

                    if (response) {
                        let jsonStr = response.trim();
                        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                        const design: AILogoDesign = JSON.parse(jsonStr);
                        const svg = generateSVGFromAIDesign(design, teamName);

                        variations.push({
                            svg,
                            style: {
                                type: design.pattern === 'geometric' ? 'geometric' : 'abstract',
                                colors: {
                                    primary: design.primaryColor,
                                    secondary: design.secondaryColor,
                                    accent: design.accentColor
                                },
                                shape: 'custom'
                            },
                            description: design.symbolism
                        });
                    }
                } catch (error) {
                    console.error(`Failed to generate ${pattern} variation:`, error);
                }
            }
        }
    }

    // If we got AI variations, return them
    if (variations.length >= 4) {
        return variations;
    }

    // Fallback: Add rule-based variations
    const colors = selectColorsFromValues(values);

    // Ensure we have at least 4 variations
    if (variations.length === 0) {
        variations.push(generateLogoRuleBased(teamName, values));
    }

    variations.push({
        svg: generateGeometricLogo(200, 100, { type: 'geometric', colors, shape: 'circle' }),
        style: { type: 'geometric', colors, shape: 'circle' },
        description: 'Geometric pattern with modern aesthetics'
    });

    variations.push({
        svg: generateIconLogo(200, { type: 'icon', colors, shape: 'square' }),
        style: { type: 'icon', colors, shape: 'square' },
        description: 'Network icon representing connectivity and collaboration'
    });

    variations.push({
        svg: generateAbstractLogo(200, 100, { type: 'abstract', colors, shape: 'circle' }),
        style: { type: 'abstract', colors, shape: 'circle' },
        description: 'Abstract flowing design with gradient'
    });

    return variations.slice(0, 4); // Return exactly 4 variations
}
