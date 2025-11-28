import type { WizardState } from './types';

export const EXAMPLE_TEAM: WizardState = {
    team: {
        teamId: 'example-team-001',
        teamName: 'Product Innovation Squad',
        teamPurpose: 'To create breakthrough products that delight customers and drive sustainable business growth through rapid experimentation and user-centered design.',
        goals: [
            'Launch 3 validated new product features this quarter',
            'Achieve 90%+ customer satisfaction score',
            'Reduce feature time-to-market by 30%',
            'Run 50+ user research sessions',
            'Maintain team NPS above 8/10'
        ],
        createdAt: new Date().toISOString(),
        createdBy: 'System',
        logo: undefined
    },
    vision: {
        text: 'To be the most customer-centric innovation team in the industry, known for launching products that users love and competitors admire.',
        archetype: 'The Pioneer'
    },
    mission: {
        text: 'We rapidly prototype and validate innovative product ideas through continuous user feedback, data-driven decisions, and cross-functional collaboration.',
        keywords: ['prototype', 'validate', 'user feedback', 'data-driven', 'collaboration']
    },
    values: [
        {
            id: 'v1',
            label: 'Customer Obsession',
            source: 'system',
            explanation: 'We put the customer at the center of every decision we make'
        },
        {
            id: 'v2',
            label: 'Bold Experimentation',
            source: 'system',
            explanation: 'We embrace calculated risks and learn from failures'
        },
        {
            id: 'v3',
            label: 'Data-Driven Decisions',
            source: 'system',
            explanation: 'We use quantitative and qualitative data to guide our choices'
        },
        {
            id: 'v4',
            label: 'Radical Transparency',
            source: 'system',
            explanation: 'We share information openly to build trust and alignment'
        },
        {
            id: 'v5',
            label: 'Continuous Learning',
            source: 'system',
            explanation: 'We constantly improve through reflection and knowledge sharing'
        },
    ],
    principles: [
        {
            id: 'p1',
            label: 'Always validate assumptions with real users before building',
            derivedFrom: ['v1', 'v3']
        },
        {
            id: 'p2',
            label: 'Fail fast, learn faster - every experiment teaches us something',
            derivedFrom: ['v2', 'v5']
        },
        {
            id: 'p3',
            label: 'Share both successes and failures openly to accelerate team learning',
            derivedFrom: ['v4', 'v5']
        },
        {
            id: 'p4',
            label: 'Let data guide decisions, but use intuition to ask better questions',
            derivedFrom: ['v3', 'v2']
        },
    ],
    behaviors: [
        {
            id: 'b1',
            label: 'Conduct weekly user interviews to gather qualitative insights',
            derivedFromValues: ['v1'],
            explanation: 'Regular user interviews keep us connected to customer needs and pain points',
            ruleId: 'system'
        },
        {
            id: 'b2',
            label: 'Ship minimum viable experiments every sprint',
            derivedFromValues: ['v2'],
            explanation: 'Quick iterations allow us to test hypotheses and learn rapidly',
            ruleId: 'system'
        },
        {
            id: 'b3',
            label: 'Review key metrics in daily standups',
            derivedFromValues: ['v3'],
            explanation: 'Daily metric reviews ensure decisions are informed by current data',
            ruleId: 'system'
        },
        {
            id: 'b4',
            label: 'Host bi-weekly retrospectives with radical honesty',
            derivedFromValues: ['v4', 'v5'],
            explanation: 'Open retrospectives create psychological safety and drive continuous improvement',
            ruleId: 'system'
        },
    ],
    goals: [
        'Launch 3 validated new product features this quarter',
        'Achieve 90%+ customer satisfaction score',
        'Reduce feature time-to-market by 30%',
        'Run 50+ user research sessions',
        'Maintain team NPS above 8/10'
    ],
    roles: [
        'Product Manager',
        'UX Designer',
        'Senior Engineer',
        'Data Analyst',
        'UX Researcher'
    ],
    people: [],
    auditLog: [
        {
            ts: new Date().toISOString(),
            user: 'System',
            action: 'created',
            details: 'Example team created'
        }
    ],
    currentStep: 0
};
