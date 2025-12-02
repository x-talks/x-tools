export interface Team {
    teamId: string;
    teamName: string;
    teamPurpose: string;
    purposeMetadata?: {
        description?: string;
        tags?: string[];
    };
    goals: string[]; // Legacy string array, mapped to Goal objects in DB
    logo?: string; // Base64 string
    createdAt: string; // ISO8601
    createdBy: string;
}

export type Role = string;

export interface Person {
    id: string;
    roleId?: string; // Linked to Role
    name: string;
    role: Role;
    email?: string;
    picture?: string; // URL or base64
    responsibilities?: string;
}

export interface SavedTeam {
    id: string;
    name: string;
    updatedAt: string;
    state: WizardState;
}

export interface Mission {
    id?: string;
    visionId?: string; // Linked to Vision
    text: string;
    keywords: string[];
    description?: string;
    tags?: string[];
}

export interface Vision {
    id?: string;
    purposeId?: string; // Linked to Purpose
    text: string;
    archetype: string;
    description?: string;
    tags?: string[];
}

export interface Value {
    id: string;
    circleId?: string; // Linked to Circle
    label: string;
    source: 'user' | 'system';
    explanation: string;
    description?: string;
    tags?: string[];
}

export interface Behavior {
    id: string;
    principleId?: string; // Linked to Principle
    label: string;
    derivedFromValues: string[]; // Legacy: valueIds
    explanation: string;
    ruleId: string;
    description?: string;
    tags?: string[];
}

export interface Strategy {
    id?: string;
    missionId?: string; // Linked to Mission
    text: string;
    description?: string;
    tags?: string[];
}

export interface Goal {
    id: string;
    strategyId?: string; // Linked to Strategy
    text: string;
    description?: string;
    tags?: string[];
}

export interface Principle {
    id: string;
    valueId?: string; // Linked to Value
    label: string;
    derivedFromValues?: string[]; // Legacy
    explanation: string;
    ruleId?: string;
    description?: string;
    tags?: string[];
}

export enum RelationType {
    DERIVES_FROM = 'derives_from',
    IMPLEMENTS = 'implements',
    SUPPORTS = 'supports',
    CONFLICTS_WITH = 'conflicts_with',
    REINFORCES = 'reinforces',
    REQUIRES = 'requires',
}

export interface SemanticRelationship {
    id: string;
    sourceId: string;
    targetId: string;
    sourceType: 'purpose' | 'vision' | 'mission' | 'strategy' | 'value' | 'principle' | 'behavior' | 'goal' | 'role';
    targetType: 'purpose' | 'vision' | 'mission' | 'strategy' | 'value' | 'principle' | 'behavior' | 'goal' | 'role';
    relationType: RelationType;
    strength: number; // 0-100
    confidence: number; // 0-100 (AI confidence score)
    explanation?: string;
    auto_detected: boolean;
}

export interface AuditLogEntry {
    user: string;
    action: 'created' | 'edited';
    ts: string; // ISO8601
    details: string;
}

export interface WizardState {
    team: Team | null;
    mission: Mission | null;
    vision: Vision | null;
    goals: string[]; // Keeping as string[] for frontend compatibility, synced to Goal table
    values: Value[];
    behaviors: Behavior[];
    principles: Principle[];
    roles: Role[];
    people: Person[];
    auditLog: AuditLogEntry[];
    currentStep: number;
    strategy?: Strategy;
    relationships?: SemanticRelationship[];
    graphLayout?: any; // Stores positions and visual state for the graph
}
