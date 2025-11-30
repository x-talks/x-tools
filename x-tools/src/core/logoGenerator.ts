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
 * Generate logo suggestions using AI
 */
export async function generateLogoWithAI(
    teamName: string,
    purpose?: string,
    values?: string[]
): Promise<GeneratedLogo> {
    if (AI.isConfigured()) {
        try {
            const prompt = `Based on this team information:
Team Name: "${teamName}"
${purpose ? `Purpose: "${purpose}"` : ''}
${values?.length ? `Values: ${values.join(', ')}` : ''}

Suggest a logo design. Return ONLY a JSON object:
{
  "type": "geometric|abstract|letter|icon",
  "colors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor"
  },
  "shape": "circle|square|hexagon|shield",
  "symbolType": "brief description of symbol/icon (e.g., mountain, rocket, network)",
  "description": "one sentence explaining the design choice"
}`;

            const { default: aiModule } = await import('./ai');
            const response = await aiModule.callGroqAPI?.(prompt, 'You are a professional brand designer.');

            if (response) {
                const suggestion = JSON.parse(response);
                const svg = generateSVGFromStyle({
                    type: suggestion.type,
                    colors: suggestion.colors,
                    shape: suggestion.shape,
                    symbolType: suggestion.symbolType
                }, teamName);

                return {
                    svg,
                    style: suggestion,
                    description: suggestion.description
                };
            }
        } catch (error) {
            console.error('AI logo generation failed, using fallback:', error);
        }
    }

    // Fallback to rule-based generation
    return generateLogoRuleBased(teamName, values);
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
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="${style.colors.primary}"/>
        <polygon points="${center},40 ${center + 50},${center} ${center},${size - 40} ${center - 50},${center}" 
                 fill="${style.colors.secondary}" opacity="0.8"/>
    </svg>`;
}

function generateIconLogo(size: number, style: LogoStyle): string {
    // Simple network/connection icon
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <rect x="0" y="0" width="${size}" height="${size}" rx="30" fill="${style.colors.primary}"/>
        <circle cx="60" cy="60" r="15" fill="white" opacity="0.9"/>
        <circle cx="140" cy="60" r="15" fill="white" opacity="0.9"/>
        <circle cx="100" cy="140" r="15" fill="white" opacity="0.9"/>
        <line x1="60" y1="60" x2="140" y2="60" stroke="white" stroke-width="3" opacity="0.6"/>
        <line x1="60" y1="60" x2="100" y2="140" stroke="white" stroke-width="3" opacity="0.6"/>
        <line x1="140" y1="60" x2="100" y2="140" stroke="white" stroke-width="3" opacity="0.6"/>
    </svg>`;
}

function generateAbstractLogo(size: number, center: number, style: LogoStyle): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${style.colors.primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${style.colors.secondary};stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="${center}" cy="${center}" r="${center - 10}" fill="url(#grad1)"/>
        <path d="M 60,60 Q 100,40 140,60 T 140,140 Q 100,160 60,140 T 60,60 Z" 
              fill="white" opacity="0.3"/>
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

    // Try AI-generated logo
    const aiLogo = await generateLogoWithAI(teamName, purpose, values);
    variations.push(aiLogo);

    // Add rule-based variations with different styles
    const colors = selectColorsFromValues(values);

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
