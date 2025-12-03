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
 * Generate logo using Groq AI to create SVG code directly
 */
export async function generateLogoWithAI(
    teamName: string,
    purpose?: string,
    values?: string[]
): Promise<GeneratedLogo> {
    if (AI.isConfigured()) {
        try {
            const styleHints = values?.length ? `reflecting values: ${values.join(', ')}` : '';
            const purposeHint = purpose ? `aligned with purpose: ${purpose}` : '';

            const prompt = `Create a professional, modern SVG logo for a team called "${teamName}" ${purposeHint} ${styleHints}.

Requirements:
- Output ONLY valid SVG code (no explanations, no markdown)
- Size: viewBox="0 0 200 200"
- Use modern design with gradients, shadows, or glows
- Professional color scheme (2-3 colors)
- Clean, scalable design
- Include creative shapes, patterns, or symbols relevant to the team name

Generate the complete SVG code now:`;

            const { default: aiModule } = await import('./ai');
            const response = await aiModule.callGroqAPI?.(prompt, 'You are an expert SVG designer. Output only valid SVG code.');

            if (response) {
                // Extract SVG from response (remove markdown code blocks if present)
                let svgCode = response.trim();
                svgCode = svgCode.replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

                // Validate it's actually SVG
                if (svgCode.includes('<svg') && svgCode.includes('</svg>')) {
                    // Extract colors for metadata
                    const colors = extractColorsFromSVG(svgCode);

                    return {
                        svg: svgCode,
                        style: {
                            type: 'abstract',
                            colors: colors,
                            shape: 'custom'
                        },
                        description: `AI-generated logo for ${teamName}`
                    };
                }
            }
        } catch (error) {
            console.error('Groq SVG generation failed, using fallback:', error);
        }
    }

    // Fallback to rule-based generation
    return generateLogoRuleBased(teamName, values);
}

/**
 * Extract color information from SVG code
 */
function extractColorsFromSVG(svg: string): { primary: string; secondary: string; accent?: string } {
    const colorRegex = /#[0-9A-Fa-f]{6}/g;
    const matches = svg.match(colorRegex);

    if (matches && matches.length >= 2) {
        return {
            primary: matches[0],
            secondary: matches[1],
            accent: matches[2]
        };
    }

    return {
        primary: '#3b82f6',
        secondary: '#1e40af'
    };
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

    // If AI is configured, generate multiple AI variations with different styles
    if (AI.isConfigured()) {
        const styles = [
            { type: 'modern minimalist', description: 'Clean and minimal design' },
            { type: 'geometric abstract', description: 'Geometric patterns and shapes' },
            { type: 'gradient modern', description: 'Vibrant gradients and modern aesthetics' },
            { type: 'tech-inspired', description: 'Technology and innovation themed' }
        ];

        for (const style of styles) {
            try {
                const styleHints = values?.length ? `reflecting values: ${values.join(', ')}` : '';
                const purposeHint = purpose ? `aligned with purpose: ${purpose}` : '';

                const prompt = `Create a ${style.type} SVG logo for "${teamName}" ${purposeHint} ${styleHints}.

Requirements:
- Output ONLY valid SVG code (no explanations)
- Size: viewBox="0 0 200 200"
- Style: ${style.type}
- Professional color scheme
- Clean, scalable design

SVG code:`;

                const { default: aiModule } = await import('./ai');
                const response = await aiModule.callGroqAPI?.(prompt, 'You are an expert SVG designer. Output only valid SVG code.');

                if (response) {
                    let svgCode = response.trim();
                    svgCode = svgCode.replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

                    if (svgCode.includes('<svg') && svgCode.includes('</svg>')) {
                        const colors = extractColorsFromSVG(svgCode);
                        variations.push({
                            svg: svgCode,
                            style: {
                                type: 'abstract',
                                colors: colors,
                                shape: 'custom'
                            },
                            description: style.description
                        });
                    }
                }
            } catch (error) {
                console.error(`Failed to generate ${style.type} variation:`, error);
            }
        }
    }

    // If we got AI variations, return them
    if (variations.length > 0) {
        return variations;
    }

    // Fallback: Add rule-based variations with different styles
    const colors = selectColorsFromValues(values);

    // Letter-based
    variations.push(generateLogoRuleBased(teamName, values));

    // Geometric variation
    variations.push({
        svg: generateGeometricLogo(200, 100, { type: 'geometric', colors, shape: 'circle' }),
        style: { type: 'geometric', colors, shape: 'circle' },
        description: 'Geometric pattern with modern aesthetics'
    });

    // Icon variation
    variations.push({
        svg: generateIconLogo(200, { type: 'icon', colors, shape: 'square' }),
        style: { type: 'icon', colors, shape: 'square' },
        description: 'Network icon representing connectivity and collaboration'
    });

    // Abstract variation
    variations.push({
        svg: generateAbstractLogo(200, 100, { type: 'abstract', colors, shape: 'circle' }),
        style: { type: 'abstract', colors, shape: 'circle' },
        description: 'Abstract flowing design with gradient'
    });

    return variations;
}
