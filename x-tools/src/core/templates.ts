

export interface Template {
    id: string;
    name: string;
    description: string;
    icon: string;
    data: {
        teamPurpose: string;
        vision: string;
        mission: string;
        strategy: string;
        values: string[]; // List of value labels
        goals: string[];
    };
}

export const TEMPLATES: Template[] = [
    {
        id: 'startup',
        name: 'The Disruptor',
        description: 'For agile startups focused on rapid innovation and market disruption.',
        icon: 'Rocket',
        data: {
            teamPurpose: "To challenge the status quo and build products that redefine the market.",
            vision: "A world where our technology empowers every individual to be a creator.",
            mission: "Ship experimentation-driven products weekly to learn faster than the competition.",
            strategy: "Leverage product-led growth and rapid iteration to capture early adopters.",
            values: ["Move Fast", "Radical Candor", "Customer Obsession", "First Principles"],
            goals: [
                "Achieve $1M ARR by Q4",
                "Ship 10 major features this year",
                "Maintain < 24h support response time"
            ]
        }
    },
    {
        id: 'enterprise',
        name: 'The Steward',
        description: 'For established organizations prioritizing stability, scale, and reliability.',
        icon: 'Shield',
        data: {
            teamPurpose: "To provide the reliable backbone that powers the global economy.",
            vision: "To be the most trusted partner for critical infrastructure world-wide.",
            mission: "Deliver 99.999% uptime through rigorous engineering and compliance standards.",
            strategy: "Protect the core while methodically expanding into adjacent regulated markets.",
            values: ["Integrity", "Reliability", "Security First", "Long-term Thinking"],
            goals: [
                "Zero critical security incidents",
                "Reduce operational costs by 15%",
                "Achieve ISO 27001 certification"
            ]
        }
    },
    {
        id: 'impact',
        name: 'The Changemaker',
        description: 'For non-profits and social enterprises driven by community impact.',
        icon: 'Heart',
        data: {
            teamPurpose: "To heal communities and foster sustainable growth for the underserved.",
            vision: "A society where every person has equitable access to health and opportunity.",
            mission: "Mobilize local resources to provide direct support to 10,000 families annually.",
            strategy: "Build deep community partnerships and storytelling to drive grassroots movement.",
            values: ["Empathy", "Inclusion", "Transparency", "Service"],
            goals: [
                "Serve 5,000 new families",
                "Raise $500k in community donations",
                "Recruit 100 active volunteers"
            ]
        }
    },
    {
        id: 'creative',
        name: 'The Creator',
        description: 'For design studios and creative agencies valuing expression and craft.',
        icon: 'Palette',
        data: {
            teamPurpose: "To inspire the world through beautiful and meaningful design.",
            vision: "A culture where design is the primary language of human connection.",
            mission: "Craft award-winning digital experiences that evoke emotion and wonder.",
            strategy: "Focus on niche, high-value projects that allow for unrestricted creative freedom.",
            values: ["Craftsmanship", "Originality", "Boldness", "Joy"],
            goals: [
                "Win 3 industry design awards",
                "Launch 5 viral campaigns",
                "Publish a team design manifesto"
            ]
        }
    }
];
