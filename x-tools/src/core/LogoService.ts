import { createAvatar } from '@dicebear/core';
import * as styleCollection from '@dicebear/collection';
import SHA256 from 'crypto-js/sha256';

export interface SeedData {
    teamName: string;
    purpose?: string;
    vision?: string;
    mission?: string;
    values?: string[];
    principles?: string[];
    salt?: string;
}

export class LogoService {
    /**
     * List all available DiceBear styles
     */
    static listStyles(): string[] {
        return Object.keys(styleCollection);
    }

    /**
     * Generate SVG logo deterministically based on seed data and style
     */
    static generate(seedData: SeedData, styleName: string = 'identicon'): string {
        const seedString = this.buildSeedString(seedData);
        const seedHash = SHA256(seedString).toString();

        const style = styleCollection[styleName as keyof typeof styleCollection];
        if (!style) {
            console.warn(`Style '${styleName}' not found, falling back to identicon`);
            return this.generate(seedData, 'identicon');
        }

        const avatar = createAvatar(style as any, {
            seed: seedHash,
            size: 256,
            backgroundColor: ['transparent'],
        });

        return avatar.toString();
    }

    /**
     * Generate a quick preview based on team name
     */
    static generatePreview(teamName: string): string {
        return this.generate({ teamName }, 'identicon');
    }

    /**
     * Build the seed string for SHA256 hashing
     */
    private static buildSeedString(data: SeedData): string {
        const parts = [
            (data.teamName || '').trim().toLowerCase(),
            data.purpose || '',
            data.vision || '',
            data.mission || '',
            (data.values || []).join(','),
            (data.principles || []).join(','),
        ];

        if (data.salt) {
            parts.push(data.salt);
        }

        return parts.join('|');
    }
}
