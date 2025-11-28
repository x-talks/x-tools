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
}
