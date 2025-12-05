/**
 * Data Validation Schemas using Zod
 * Ensures data integrity before saving to database
 */

import { z } from 'zod';

// Team/Circle validation
export const TeamSchema = z.object({
    teamId: z.string().uuid(),
    teamName: z.string().min(3, 'Team name must be at least 3 characters').max(100, 'Team name too long'),
    teamPurpose: z.string().optional(),
    logo: z.string().url().optional().or(z.string().startsWith('data:image/')).optional(),
    goals: z.array(z.lazy(() => GoalSchema)).optional(),
    createdAt: z.string().datetime(),
    createdBy: z.string().min(1, 'Created by is required'),
    purposeMetadata: z.object({
        description: z.string().optional(),
        tags: z.array(z.string()).optional()
    }).optional()
});

// Vision validation
export const VisionSchema = z.object({
    id: z.string().uuid(),
    text: z.string().min(10, 'Vision must be at least 10 characters'),
    archetype: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Mission validation
export const MissionSchema = z.object({
    id: z.string().uuid(),
    text: z.string().min(10, 'Mission must be at least 10 characters'),
    keywords: z.array(z.string()).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Strategy validation
export const StrategySchema = z.object({
    id: z.string().uuid(),
    text: z.string().min(10, 'Strategy must be at least 10 characters'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Value validation
export const ValueSchema = z.object({
    id: z.string().uuid(),
    label: z.string().min(2, 'Value must be at least 2 characters').max(50, 'Value too long'),
    source: z.enum(['user', 'ai', 'system']),
    explanation: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Principle validation
export const PrincipleSchema = z.object({
    id: z.string().uuid(),
    label: z.string().min(5, 'Principle must be at least 5 characters'),
    source: z.enum(['user', 'ai', 'system']),
    explanation: z.string().optional(),
    valueId: z.string().uuid().optional(),
    derivedFromValues: z.array(z.string()).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Behavior validation
export const BehaviorSchema = z.object({
    id: z.string().uuid(),
    label: z.string().min(5, 'Behavior must be at least 5 characters'),
    source: z.enum(['user', 'ai', 'system']),
    explanation: z.string().optional(),
    principleId: z.string().uuid().optional(),
    derivedFromPrinciples: z.array(z.string()).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Goal validation
export const GoalSchema = z.object({
    id: z.string().uuid().or(z.string()), // Allow non-UUID IDs for temporary/example goals
    text: z.string().min(3, 'Goal must be at least 3 characters'),
    strategyId: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Role validation
export const RoleSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, 'Role name must be at least 2 characters').max(100, 'Role name too long'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Person validation
export const PersonSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, 'Person name must be at least 2 characters').max(100, 'Person name too long'),
    roleId: z.string().uuid(),
    email: z.string().email('Invalid email').optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Complete WizardState validation
export const WizardStateSchema = z.object({
    currentStep: z.number().min(0).max(10),
    team: TeamSchema.optional(),
    vision: VisionSchema.optional(),
    mission: MissionSchema.optional(),
    strategy: StrategySchema.optional(),
    values: z.array(ValueSchema),
    principles: z.array(PrincipleSchema),
    behaviors: z.array(BehaviorSchema),
    goals: z.array(GoalSchema),
    roles: z.array(RoleSchema),
    people: z.array(PersonSchema),
    graphLayout: z.object({
        positions: z.record(z.string(), z.object({
            x: z.number(),
            y: z.number()
        }))
    }).optional()
});

// Validation helper functions
export const validateTeam = (data: unknown) => {
    return TeamSchema.safeParse(data);
};

export const validateWizardState = (data: unknown) => {
    return WizardStateSchema.safeParse(data);
};

export const validateValue = (data: unknown) => {
    return ValueSchema.safeParse(data);
};

export const validatePrinciple = (data: unknown) => {
    return PrincipleSchema.safeParse(data);
};

export const validateBehavior = (data: unknown) => {
    return BehaviorSchema.safeParse(data);
};

// Type exports
export type ValidatedTeam = z.infer<typeof TeamSchema>;
export type ValidatedWizardState = z.infer<typeof WizardStateSchema>;
export type ValidatedValue = z.infer<typeof ValueSchema>;
export type ValidatedPrinciple = z.infer<typeof PrincipleSchema>;
export type ValidatedBehavior = z.infer<typeof BehaviorSchema>;
