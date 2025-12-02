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
    strategy: {
        text: 'Compete through AI-powered automation and modular architecture, serving mid-market enterprises'
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
            derivedFromValues: ['v1', 'v3'],
            explanation: 'User validation principle'
        },
        {
            id: 'p2',
            label: 'Fail fast, learn faster - every experiment teaches us something',
            derivedFromValues: ['v2', 'v5'],
            explanation: 'Rapid learning principle'
        },
        {
            id: 'p3',
            label: 'Share both successes and failures openly to accelerate team learning',
            derivedFromValues: ['v4', 'v5'],
            explanation: 'Open sharing principle'
        },
        {
            id: 'p4',
            label: 'Let data guide decisions, but use intuition to ask better questions',
            derivedFromValues: ['v3', 'v2'],
            explanation: 'Data-informed decision making'
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

export const EXAMPLE_TEAM_2: WizardState = {
    team: {
        teamId: 'example-team-002',
        teamName: 'Platform Engineering Crew',
        teamPurpose: 'To enable product teams to ship software faster and more safely by providing a robust, self-service internal developer platform.',
        goals: [
            'Reduce deployment lead time to < 15 minutes',
            'Achieve 99.99% platform uptime',
            'Migrate 100% of services to Kubernetes',
            'Automate security scanning in CI/CD',
            'Reduce cloud costs by 20%'
        ],
        createdAt: new Date().toISOString(),
        createdBy: 'System',
        logo: undefined
    },
    vision: {
        text: 'A frictionless development experience where engineers can focus entirely on business logic without worrying about infrastructure.',
        archetype: 'The Enabler'
    },
    mission: {
        text: 'We build and maintain the paved road for software delivery, abstracting complexity and enforcing best practices through code.',
        keywords: ['paved road', 'abstract complexity', 'best practices', 'self-service']
    },
    strategy: {
        text: 'Build Autonomy-Enabling Platform Services – Provide teams with reusable, self-service infrastructure – Reduce dependencies on central operations – Accelerates delivery speed.'
    },
    values: [
        {
            id: 'v1',
            label: 'Reliability First',
            source: 'system',
            explanation: 'We prioritize stability and uptime above all else'
        },
        {
            id: 'v2',
            label: 'Automation Over Toil',
            source: 'system',
            explanation: 'We automate repetitive tasks to reduce error and save time'
        },
        {
            id: 'v3',
            label: 'Developer Experience',
            source: 'system',
            explanation: 'We treat internal developers as our primary customers'
        },
        {
            id: 'v4',
            label: 'Security by Design',
            source: 'system',
            explanation: 'We embed security into the platform foundation'
        },
    ],
    principles: [
        {
            id: 'p1',
            label: 'Treat the platform as a product',
            derivedFromValues: ['v3'],
            explanation: 'Product mindset principle'
        },
        {
            id: 'p2',
            label: 'Automate everything that can be automated',
            derivedFromValues: ['v2'],
            explanation: 'Automation principle'
        },
        {
            id: 'p3',
            label: 'Secure defaults, not secure hurdles',
            derivedFromValues: ['v4'],
            explanation: 'Security principle'
        },
    ],
    behaviors: [
        {
            id: 'b1',
            label: 'Write post-mortems for every incident',
            derivedFromValues: ['v1'],
            explanation: 'Learning from failure is key to reliability',
            ruleId: 'system'
        },
        {
            id: 'b2',
            label: 'Survey developers quarterly on platform satisfaction',
            derivedFromValues: ['v3'],
            explanation: 'Feedback loops ensure we build what developers need',
            ruleId: 'system'
        },
    ],
    goals: [
        'Reduce deployment lead time to < 15 minutes',
        'Achieve 99.99% platform uptime',
        'Migrate 100% of services to Kubernetes',
        'Automate security scanning in CI/CD',
        'Reduce cloud costs by 20%'
    ],
    roles: [
        'Platform Engineer',
        'SRE',
        'Cloud Architect',
        'Security Engineer'
    ],
    people: [],
    auditLog: [
        {
            ts: new Date().toISOString(),
            user: 'System',
            action: 'created',
            details: 'Example team 2 created'
        }
    ],
    currentStep: 0
};
