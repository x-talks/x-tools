export interface Team {
    teamId: string;
    teamName: string;
    teamPurpose: string;
    purposeMetadata?: EntityMetadata;
    goals: Goal[];
    logo?: string;
    createdAt: string;
    createdBy: string;
    // Feature 10: Multi-Team Hierarchy
    parentId?: string;
    subTeams?: string[]; // IDs of child teams
    strategyCascade?: {
        inheritanceMode: 'strict' | 'flexible' | 'autonomous';
        inheritedGoals: string[];
    };
}

// Feature 1: Smart Validation & Guidance
export interface ValidationResult {
    score: number; // 0-100
    status: 'critical' | 'warning' | 'valid' | 'excellent';
    issues: {
        severity: 'critical' | 'warning' | 'suggestion';
        message: string;
        field?: string;
    }[];
    lastValidated: string;
}

export interface EntityMetadata {
    id?: string;
    description?: string;
    tags?: string[];
    // Feature 1: Validation per entity
    validation?: ValidationResult;
    // Feature 4: Collaboration
    comments?: CommentThread[];
    // Feature 5: Approvals
    approvalStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
    approvedBy?: string[];
}

// Feature 4 & 5: Collab & Review
export interface CommentThread {
    id: string;
    entityId: string;
    status: 'open' | 'resolved';
    comments: Comment[];
    assignee?: string;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
    type: 'general' | 'suggestion' | 'blocker';
}

export interface ApprovalFlow {
    id: string;
    status: 'active' | 'completed';
    targetStep: number;
    approvers: {
        userId: string;
        status: 'pending' | 'approved' | 'rejected';
        feedback?: string;
    }[];
}

export type Role = string;

export interface Person {
    id: string;
    roleId?: string; // Linked to Role
    name: string;
    role: Role;
    email?: string;
    picture?: string;
    responsibilities?: string;
    // Feature 11: RBAC
    accessLevel: 'admin' | 'editor' | 'viewer';
}

export interface SavedTeam {
    id: string;
    name: string;
    updatedAt: string;
    state: WizardState;
}

export interface SaveResult {
    success: boolean;
    savedTeam?: SavedTeam;
    error?: string;
}

export interface Mission {
    id?: string;
    visionId?: string; // Linked to Vision
    text: string;
    keywords: string[];
    metadata?: EntityMetadata; // Replaces previous fields
    // Keeping deprecated fields for compatibility during migration if needed, but optimally they are in metadata
    description?: string;
    tags?: string[];
}

export interface Vision {
    id?: string;
    purposeId?: string; // Linked to Purpose
    text: string;
    archetype: string;
    metadata?: EntityMetadata;
    description?: string;
    tags?: string[];
}

export interface Value {
    id: string;
    circleId?: string; // Linked to Circle
    label: string;
    source: 'user' | 'system' | 'template'; // Feature 2: Templates
    explanation: string;
    metadata?: EntityMetadata;
    description?: string;
    tags?: string[];
}

// Feature 8: Behavior Reinforcement
export interface Behavior {
    id: string;
    principleId?: string; // Linked to Principle
    label: string;
    derivedFromValues: string[]; // Legacy: valueIds
    explanation: string;
    ruleId: string;
    metadata?: EntityMetadata;
    description?: string;
    tags?: string[];
    // Feature 8 specifics
    frequency?: 'daily' | 'weekly' | 'ad-hoc';
    reinforcementLog?: {
        date: string;
        count: number;
        source: 'self-report' | 'peer-kudos';
    }[];
}

export interface Strategy {
    id?: string;
    missionId?: string; // Linked to Mission
    text: string;
    metadata?: EntityMetadata;
    description?: string;
    tags?: string[];
}

// Feature 7: OKR Conversion
export interface Goal {
    id: string;
    strategyId?: string; // Linked to Strategy
    text: string;
    type: 'objective' | 'key_result' | 'outcome';
    metric?: {
        current: number;
        target: number;
        unit: string;
    };
    progress: number; // 0-100
    ownerId?: string;
    metadata?: EntityMetadata;
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
    metadata?: EntityMetadata;
    description?: string;
    tags?: string[];
}

export enum RelationType {
    DERIVES_FROM = 'derives_from',
    IMPLEMENTS = 'implements',
    SUPPORTS = 'supports',
    CONFLICTS_WITH = 'conflicts_with', // Feature 3
    REINFORCES = 'reinforces',
    REQUIRES = 'requires',
    BLOCKS = 'blocks', // Feature 3
}

// Feature 3: Relationship Intelligence
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
    action: 'created' | 'edited' | 'approved' | 'rejected' | 'commented';
    ts: string; // ISO8601
    details: string;
}

// Feature 6: Workshop Mode
export interface WorkshopSession {
    isActive: boolean;
    code: string;
    facilitatorId: string;
    participants: { id: string; name: string; active: boolean }[];
    timer?: {
        secondsRemaining: number;
        status: 'running' | 'paused';
    };
    stage: 'brainstorming' | 'voting' | 'review';
}

// Feature 9 & 12: Impact & AI Coach
export interface TeamInsight {
    id: string;
    type: 'drift_alert' | 'alignment_score' | 'suggestion';
    severity: 'low' | 'medium' | 'high';
    message: string;
    metric?: string;
    trend?: 'up' | 'down' | 'stable';
    generatedAt: string;
}

export interface WizardState {
    // Core Entities
    team: Team | null;
    mission: Mission | null;
    vision: Vision | null;
    strategy?: Strategy;
    goals: Goal[]; // Mapped to Goal objects
    values: Value[];
    behaviors: Behavior[];
    principles: Principle[];
    roles: Role[];
    people: Person[];

    // Graph
    relationships: SemanticRelationship[];
    graphLayout?: any; // Stores positions and visual state for the graph

    // Meta State
    currentStep: number;
    auditLog: AuditLogEntry[];

    // Feature 6: Workshop
    workshop?: WorkshopSession;

    // Feature 5: Reviews
    activeReview?: ApprovalFlow;

    // Feature 12: AI Coach
    insights: TeamInsight[];

    // Feature 9: Impact
    sentimentScore?: number; // 0-100
}
