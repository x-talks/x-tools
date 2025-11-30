export interface Team {
    teamId: string;
    teamName: string;
    teamPurpose: string;
    goals: string[];
    logo?: string; // Base64 string
    createdAt: string; // ISO8601
    createdBy: string;
}

export type Role = string;

export interface Person {
    id: string;
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
    text: string;
    keywords: string[];
}

export interface Vision {
    text: string;
    archetype: string;
}

export interface Value {
    id: string;
    label: string;
    source: 'user' | 'system';
    explanation: string;
    description?: string;
}

export interface Behavior {
    id: string;
    label: string;
    derivedFromValues: string[]; // valueIds
    explanation: string;
    ruleId: string;
}

export interface Strategy {
    text: string;
}

export interface Principle {
    id: string;
    label: string;
    derivedFrom: string[]; // valueIds or behaviorIds
    explanation?: string;
    ruleId?: string;
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
    sourceType: 'value' | 'principle' | 'behavior' | 'goal';
    targetType: 'value' | 'principle' | 'behavior' | 'goal';
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
    goals: string[]; // Added for v1.1
    values: Value[];
    behaviors: Behavior[];
    principles: Principle[];
    roles: Role[];
    people: Person[];
    auditLog: AuditLogEntry[];
    currentStep: number;
    strategy?: Strategy;
    relationships?: SemanticRelationship[];
}
