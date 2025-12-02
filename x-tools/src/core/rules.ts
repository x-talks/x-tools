import type { Behavior, Principle, Value } from './types';

export const WIZARD_CONTENT = {
    "Purpose": {
        "Formula": "[What We Do] [For Whom] [Ultimate Impact/Inspiration]",
        "Description": {
            "What": "Articulates core reason for organizational existence beyond profit.",
            "Why": "Inspires stakeholders and guides strategic decisions."
        },
        "Examples": [
            "To democratize secure collaboration for all businesses",
            "Empower teams to build software securely and sustainably"
        ],
        "BestPractice": "Authentic, believable, linked to societal contribution",
        "Statements": [
            "Enable Continuous Adaptive Delivery at Enterprise Scale",
            "Foster Continuous Evolution Through Data-Driven Feedback Loops",
            "Sustain Organizational Resilience in Complex, Adaptive Systems",
            "Build Distributed, Decentralized Decision-Making Capability",
            "Integrate Human-Centric and AI-Enabled Technical Systems",
            "Enable Continuous Organizational Learning and Knowledge Flow",
            "Sustain Technical Excellence Through Automated Quality and CI/CD",
            "Build Organizational Antifragility and Adaptive Capacity",
            "Create Psychological Safety Foundation to Enable Risk-Taking and Innovation",
            "Enable Highly Autonomous, Cross-Functional Teams",
            "Accelerate Time-to-Value Through AI-Enabled Delivery Pipelines",
            "Build Cross-Functional Coherence Across Product and Platform Teams",
            "Sustain Competitive Advantage Through Continuous Market Sensing",
            "Create a Culture of Rapid Experimentation and Learning",
            "Enable Evidence-Based, AI-Supported Decisions",
            "Build Transparent Operations and Data Visibility",
            "Sustain Employee Engagement Through Empowerment and Recognition",
            "Enable Rapid Experimentation, Failure, and Learning",
            "Create Equitable Access to Tools, Knowledge, and Opportunities",
            "Build Systems Thinking and Cross-Domain Awareness Capability",
            "Enable Sustainable, Scalable Growth Through Operational Excellence",
            "Create Meaningful Work Through Purpose-Driven Initiatives",
            "Build Organizational Change Resilience and Adaptivity",
            "Enable Community, Collaboration, and Networked Teams",
            "Sustain Innovation Momentum Through Iterative Experimentation",
            "Build a Future-Ready, AI-Enabled Organization",
            "Build Shared Consciousness Across Teams and Ecosystems",
            "Accelerate Organizational Learning at High Velocity",
            "Eliminate Silos by Radical Transparency and Open Knowledge Sharing",
            "Drive Intrinsic Motivation in Technical Teams via Autonomy and Purpose",
            "Reduce System Entropy and Cognitive Friction Through Automation",
            "Create Emergent Innovation by Ensuring Psychological Safety",
            "Distribute Authority to Empower Decentralized Decision-Making",
            "Strengthen Organizational Immune Function for Resilience",
            "Optimize Flow State Across Technical and Product Systems",
            "Build Trust by Fostering Vulnerability and Accountability",
            "Transform Organizational Complexity into Competitive Advantage",
            "Enable Sustainable Delivery Pace in High-Velocity Environments",
            "Cultivate Organizational Learning and Knowledge Integration",
            "Align Technical Architecture to Team Topology for Scalable Delivery",
            "Establish Blameless Culture to Accelerate Learning from Failure",
            "Empower Teams as High-Impact Self-Organizing Systems",
            "Integrate Human and Technical Systems for Maximum Performance",
            "Establish a Principled Risk-Taking Culture to Foster Innovation",
            "Create Feedback Loops as Strategic Levers for Continuous Improvement",
            "Develop Anti-Fragile Technical and Organizational Capabilities",
            "Leverage AI and Data to Maximize Customer Value Across Products",
            "Foster Enterprise-Level Agile Alignment Across Business and Technology",
            "Enable Platform Thinking and Ecosystem Innovation Beyond Teams",
            "Drive User-Centric Product Innovation Through Continuous Experimentation",
            "Integrate Sustainability and Responsible Tech Into Core Delivery",
            "Accelerate Knowledge Sharing and AI-Augmented Organizational Learning",
            "Optimize Global-Scale Operations for Reliability, Security, and Performance",
            "Embed Predictive Analytics and AI in Decision-Making Processes",
            "Cultivate Cross-Organizational Collaboration to Unlock Collective Intelligence",
            "Establish Continuous Product Lifecycle Optimization with Feedback Loops",
            "Drive Ethical AI and Transparency in All Technology Initiatives",
            "Foster Rapid Experimentation Culture with Measurable Business Outcomes",
            "Enable Adaptive, Data-Driven Risk Management Across Enterprise",
            "Design Future-Ready Technology Platforms With Maximum Scalability",
            "Leverage AI to Optimize Organizational Decisions",
            "Drive Hyper-Personalized User Experiences",
            "Enable Seamless Human-AI Collaboration",
            "Build Modular & Future-Ready Enterprise Software",
            "Establish Global Operational Excellence",
            "Foster Disruptive Innovation & Moonshot Thinking",
            "Embed Continuous Usability & Product Excellence",
            "Create Remote-First Knowledge & Collaboration Ecosystem",
            "Implement Predictive & Adaptive Process Optimization",
            "Drive AI-Powered Business & Growth Strategies",
            "Enable Real-Time Organizational Learning Loops",
            "Accelerate High-Impact Innovation Velocity"
        ]
    },
    "Vision": {
        "Formula": "[A Future State] [For Whom] [Transformation/Impact]",
        "Description": {
            "What": "A Forward-looking desired future state or transformational impact.",
            "Why": "Serves as aspirational 'North Star' for long-term strategic alignment."
        },
        "Examples": [
            "A world where every business process is frictionlessly automated",
            "Connected enterprises operating seamlessly across all systems"
        ],
        "BestPractice": "Inspiring, ambitious, measurable aspiration",
        "Statements": [
            "Fully Distributed Authority & Empowered Execution",
            "Continuous Deployment as Organizational Norm",
            "Zero-Friction Cognitive Context Switching",
            "Radical Operational Transparency",
            "Real-Time Feedback Integration Loop",
            "Team-Based Accountability as Default",
            "Systems Thinking as Leadership Foundation",
            "Cross-Functional Knowledge Osmosis",
            "Production Resilience Through Antifragility",
            "Intelligent Risk as Competitive Advantage",
            "Emergent Strategy Through Shared Purpose",
            "Flow State as Measurable Engineering Outcome",
            "Psychological Safety as Competitive Moat",
            "Blameless Post-Incident Learning Culture",
            "Platform Engineering as Strategic Capability",
            "Cognitive Load Optimization Infrastructure",
            "Distributed Sense-Making & Pattern Recognition",
            "Adaptive Technical Evolution",
            "Shared Mental Models Across Organization",
            "Real-Time Organizational Nervous System",
            "Decentralized Command & Control Structures",
            "Intrinsic Motivation Through Meaningful Work",
            "Technical Excellence as Cultural Bedrock",
            "Organizational Metabolism Optimization",
            "Adaptive Strategy in Complex Environments",
            "Collective Sense-Making at Scale",
            "Human-Centered Technical Architecture",
            "Organizational Resilience Through Diversity",
            "Deploy to Production Daily",
            "Lead Time Less Than 24 Hours",
            "Rapid Incident Recovery Capability",
            "Feature Toggles Enable Safe Release",
            "Small Batch Deployment Culture",
            "Speed Without Sacrificing Safety",
            "Self-Organizing Teams Across Organization",
            "Cross-Functional Fluency",
            "Transparent Decision-Making",
            "Learning Organization Mentality",
            "Zero Technical Debt Accumulation",
            "Well-Being Integrated in Design",
            "Growth Mindset as Cultural Norm",
            "Innovation Through Experimentation",
            "Data-Driven Product Decisions",
            "Market-Responsive Organization",
            "Sustainable Pace & Rhythm",
            "Community-Driven Development",
            "Knowledge Flows Freely Across Org",
            "Inclusive Leadership at All Levels",
            "Agile Response to Change",
            "Metrics Drive Right Behavior",
            "Customer Voice Deeply Integrated",
            "Diverse Perspectives Valued",
            "Sustainable Long-Term Growth",
            "Innovation Culture Over Predictability",
            "Engaged Workforce",
            "Continuous Improvement Embedded",
            "Future-Ready Adaptive Organization",
            "AI-Augmented Decision Intelligence",
            "Hyper-Personalized Customer Experiences",
            "Seamless Human-AI Collaboration",
            "Next-Gen Modular Enterprise Systems",
            "Global Scale Operational Model",
            "Disruptive Innovation Pipeline",
            "Continuous Usability Excellence",
            "Remote-First Knowledge Ecosystem",
            "Predictive Process Optimization",
            "AI-Powered Growth Engine",
            "Cloud Financial Responsibility Embedded in Every Team (FinOps Culture)",
            "Ethical&Bias-Free AI as a Non-Negotiable Principle",
            "Global Talent Sourcing & Integration as Standard Operating Model"
        ]
    },
    "Mission": {
        "Formula": "[What We Do] [What We Deliver/How] [Target/Problem]",
        "Description": {
            "What": "Defines immediate objectives and operational approach to achieving purpose.",
            "Why": "Operationalizes purpose into actionable paths."
        },
        "Examples": [
            "Deliver secure cloud solutions to simplify global enterprise operations",
            "Deliver modular solutions to reduce deployment time"
        ],
        "BestPractice": "Concise, specific, outcome-focused, operational clarity",
        "Statements": [
            "Establish trust-first team dynamics via vulnerability-based coaching and transparent risk-sharing rituals.",
            "Implement DORA metrics-driven improvement cycles using AI-powered value stream mapping and automated bottleneck detection.",
            "Create blameless incident response framework enforcing Cognitive Debriefing and automated incident timeline generation.",
            "Reduce extraneous cognitive load by automating toil and minimizing context switching with specialized tooling.",
            "Establish shared consciousness communication cadence leveraging real-time information radiators and asynchronous communication protocols (AsyncOps).",
            "Build psychological safety through vulnerability through leader modeling and anonymous feedback tools integrated into retrospectives.",
            "Implement systems thinking workshop program utilizing causal loop diagramming and organizational sensing exercises.",
            "Create cross-functional dependency mapping using micro-service interaction analysis and dynamic interface contracts.",
            "Establish continuous delivery infrastructure via GitOps and immutable infrastructure principles.",
            "Develop cognitive diversity hiring practices.",
            "Implement DevOps automation layer utilizing AI-assisted root cause analysis and auto-remediation.",
            "Create production observability platform leveraging four types of telemetry data (metrics, logs, traces, events) and contextual links.",
            "Build team topologies alignment framework enforcing clear interaction modes (Collaboration, X-as-a-Service, Facilitating) based on cognitive load.",
            "Implement feedback loop instrumentation employing telemetry across development and production environments.",
            "Create distributed decision-making protocol using informed consent and delegated authority (Delegation Poker).",
            "Develop role clarity framework through T-shaped skill mapping and dynamic team charters.",
            "Implement intrinsic motivation assessment leveraging SDT (Self-Determination Theory) metrics via pulse surveys.",
            "Build community of practice network driven by self-service platform and rotating stewardship model.",
            "Create real-time alerting infrastructure powered by Machine Learning anomaly detection and probabilistic modeling.",
            "Establish retrospective ceremony framework embedding quantitative data analysis (DORA metrics) and structured debriefing.",
            "Develop skill variety enhancement program using internal hackathons and dedicated innovation sabbaticals.",
            "Create autonomous team operating model using defined boundaries and value stream alignment.",
            "Implement threat recognition training via scenario-based simulations and continuous red/blue team exercises.",
            "Build value stream visibility through end-to-end mapping tools and automated lead time tracking.",
            "Establish peer accountability mechanisms utilizing co-created team contracts and transparent commitment tracking.",
            "Develop personal mastery cultivation program centered on T-Shaped development plans and 20% time allocation for deep work.",
            "Create information flow architecture based on pull-over-push models and synchronous collaboration tools.",
            "Implement change lead time reduction initiative by eliminating handoffs and reducing batch size across the pipeline.",
            "Build failure pattern recognition system leveraging AI clustering of incident data and automated classification.",
            "Establish collective learning infrastructure.",
            "Develop organizational nervous system through real-time sensing capabilities and aggregated system health dashboards.",
            "Create innovation time allocation system guaranteeing dedicated exploratory hours and formal pitch protocols.",
            "Implement risk tolerance calibration by linking business goals to acceptable error budgets and failure rates.",
            "Build cognitive capacity management using Team Topologies constraints and managed dependencies.",
            "Establish team formation best practices guided by Tuckman's stages and continuous social contract review.",
            "Create technical decision record system enforcing ADR (Architecture Decision Record) standards and peer review.",
            "Implement microservice ownership model.",
            "Build deployment automation utilizing serverless functions and blue/green deployment strategies.",
            "Establish version control enforcing Trunk-Based Development and automated release tagging.",
            "Create incident response process using ChatOps integration and predefined runbooks.",
            "Build feature flag system supporting A/B testing and canary rollouts.",
            "Deploy small batches by enforcing low work-in-progress (WIP) limits and daily production releases.",
            "Establish testing standards including shift-left security and AI-powered test generation.",
            "Build cross-functional teams using Skill Gap Analysis for continuous remixing and alignment.",
            "Build tech excellence standards enforcing clean architecture principles and regular code quality reviews.",
            "Implement technical debt management through dedicated reduction sprints and automated debt scoring.",
            "Establish human-centered design via continuous user research and rapid prototyping cycles.",
            "Create well-being program offering flexible schedules and mental health support services.",
            "Build growth opportunity structure formalizing clear career matrices and rotational assignments.",
            "Establish experimentation program using structured hypothesis testing and a standardized sandbox environment.",
            "Create data analytics capability deploying a modern data stack and self-service BI tools.",
            "Implement market research through AI-driven sentiment analysis and continuous competitive scanning.",
            "Build sustainable pace by aligning work capacity to team bandwidth and limiting unplanned work.",
            "Establish community programs fostering internal knowledge sharing forums and external engagement.",
            "Create knowledge management system centralizing all learning assets in a single, searchable repository.",
            "Develop diversity program implementing blind resume review and mentorship for underrepresented groups.",
            "Build long-term strategy based on scenario planning and rolling three-year horizons.",
            "Establish innovation process utilizing Hothouses (idea sprints) and a minimum viable product (MVP) pipeline.",
            "Create engagement programs leveraging Gamification and personalized recognition systems.",
            "Build improvement culture embedding Kaizen events and daily standups focused on process debt.",
            "Develop organizational agility by decoupling services and implementing fast, flexible funding models.",
            "Implement OKR framework ensuring quarterly alignment of strategic goals and transparent reporting.",
            "Build capability development targeting high-demand skills via specialized internal academies.",
            "Establish coaching culture training all leaders in situational leadership and feedback models.",
            "Create performance management using continuous feedback loops and development-focused conversations.",
            "Establish retention programs offering competitive compensation and tailored leadership tracks.",
            "Build leadership development focusing on servant leadership and growth mindset principles.",
            "Create strategic planning running quarterly review cycles and annual long-range forecasting.",
            "Create customer feedback loop integrating real-time product usage data and continuous NPS surveys.",
            "Develop mentorship pairing framework using AI matching based on skill gaps and career trajectory.",
            "Establish AI/ML model governance & ethical audit framework enforcing Model Cards, data lineage tracking, and human-in-the-loop review.",
            "Develop hyper-scalability & fault tolerance architecture by enforcing circuit-breaker patterns and event-driven architecture (EDA).",
            "Implement UX-driven growth loop instrumentation via AI-assisted funnel optimization and A/B testing across all touchpoints.",
            "Create moonshot & exploratory investment budget funding high-risk, high-reward projects with minimal early oversight."
        ]
    },
    "Strategy": {
        "Formula": "[Our Differentiation] [Through What Approach] [Market/Problem]",
        "Description": {
            "What": "Comprehensive approach and key decisions for achieving vision and mission.",
            "Why": "Defines how to win, allocate resources, and compete effectively."
        },
        "Examples": [
            "Compete through AI-powered automation and modular architecture, serving mid-market enterprises",
            "Lead through AI-driven automation in mid-market SaaS"
        ],
        "BestPractice": "Clear competitive advantage, resource allocation decisions, market positioning, aligned with product roadmap",
        "Items": [
            {
                "Name": "Build Distributed Decision-Making Capability",
                "Strategy": "Enable empowered teams – Implement clear decision delegation frameworks – Accelerates responsiveness and reduces bottlenecks across the organization."
            },
            {
                "Name": "Align Organization Design for Value Flow",
                "Strategy": "Structure teams around end-to-end value streams – Reduce handoffs and silos – Ensures faster delivery of customer outcomes."
            },
            {
                "Name": "Establish Clear Span of Control Architecture",
                "Strategy": "Define leadership and reporting boundaries – Optimize managerial load and influence – Improves decision quality and accountability."
            },
            {
                "Name": "Implement Strategic Redundancy in Critical Functions",
                "Strategy": "Duplicate key capabilities intentionally – Cross-train teams and systems – Mitigates risk of single-point failures."
            },
            {
                "Name": "Design Scalable Organizational Layers",
                "Strategy": "Implement modular, hierarchical yet flexible team layers – Maintain clarity and agility – Supports growth without complexity overload."
            },
            {
                "Name": "Define Intentional Role Interdependencies",
                "Strategy": "Map and clarify how roles interact – Establish explicit dependencies – Improves coordination and reduces misunderstandings."
            },
            {
                "Name": "Establish Career Paths & Growth Frameworks",
                "Strategy": "Provide transparent development and promotion paths – Include skill matrices and rotational assignments – Attracts and retains top talent."
            },
            {
                "Name": "Define Roles with Distributed Accountability",
                "Strategy": "Assign outcome ownership clearly – Empower execution with aligned accountability – Encourages initiative and reduces micromanagement."
            },
            {
                "Name": "Develop Internal Capability",
                "Strategy": "Invest in training, mentorship, and coaching programs – Expand internal skill sets – Reduces dependency on external hiring and contractors."
            },
            {
                "Name": "Implement Organizational Learning Feedback Loops",
                "Strategy": "Collect, analyze, and act on lessons learned – Share insights across teams – Drives continuous improvement and innovation."
            },
            {
                "Name": "Implement Phased Transformation Safely",
                "Strategy": "Roll out strategic changes in incremental stages – Monitor impact and adapt – Reduces risk and ensures smoother adoption."
            },
            {
                "Name": "Design Intentional Culture",
                "Strategy": "Codify desired behaviors, rituals, and norms – Reinforce via recognition and incentives – Aligns values with strategy execution."
            },
            {
                "Name": "Develop Team Capability Pre-Collaboration",
                "Strategy": "Equip teams with shared skills and knowledge before cross-team work – Conduct alignment workshops – Ensures efficient collaboration from the start."
            },
            {
                "Name": "Strengthen Team Identity & Shared Purpose",
                "Strategy": "Articulate vision, values, and team mission – Facilitate rituals that reinforce cohesion – Drives engagement and accountability."
            },
            {
                "Name": "Optimize Team Size for Accountability",
                "Strategy": "Adjust team size to maximize autonomy and communication efficiency – Apply proven team sizing heuristics – Balances delivery speed with quality."
            },
            {
                "Name": "Establish Psychological Safety as Team Foundation",
                "Strategy": "Implement norms for open communication and constructive dissent – Conduct surveys and retrospectives – Fosters innovation and learning."
            },
            {
                "Name": "Build Team Resilience Through Rituals",
                "Strategy": "Introduce regular retrospectives, knowledge sharing, and support routines – Reinforce adaptive behaviors – Reduces burnout and improves sustainability."
            },
            {
                "Name": "Define Team Decision-Making Frameworks",
                "Strategy": "Set clear guidelines on how decisions are made – Include escalation and conflict resolution protocols – Ensures timely, aligned actions."
            },
            {
                "Name": "Develop Conflict Resolution as Team Competency",
                "Strategy": "Train teams in structured conflict management – Apply facilitation and mediation tools – Improves collaboration and reduces friction."
            },
            {
                "Name": "Build Shared Mental Models Within Teams",
                "Strategy": "Align understanding of goals, processes, and technology – Conduct workshops and documentation sessions – Ensures synchronized execution and reduces errors."
            },
            {
                "Name": "Implement Team Learning & Retrospectives",
                "Strategy": "Regularly review past actions, successes, and failures – Capture actionable insights – Drives continuous team improvement."
            },
            {
                "Name": "Enhance Team Adaptability & Change Capacity",
                "Strategy": "Train teams on agile methods, scenario planning, and decision flexibility – Prepare for evolving priorities – Reduces disruption from change."
            },
            {
                "Name": "Build Cross-Team Knowledge Networks",
                "Strategy": "Connect teams via forums, communities of practice, and mentorship – Share expertise and lessons – Accelerates organizational learning."
            },
            {
                "Name": "Establish Continuous Feedback Culture",
                "Strategy": "Integrate structured feedback mechanisms – Encourage peer, leader, and cross-team feedback – Enhances performance and alignment."
            },
            {
                "Name": "Rotate Roles for Capability Development",
                "Strategy": "Implement role rotation programs – Expose individuals to diverse responsibilities – Broadens skills and organizational agility."
            },
            {
                "Name": "Implement Peer Accountability Model",
                "Strategy": "Encourage co-created agreements and mutual performance tracking – Promote collective ownership – Reduces dependency on hierarchical enforcement."
            },
            {
                "Name": "Design Technical Architecture for Organizational Agility",
                "Strategy": "Adopt modular, decoupled system architecture – Use microservices, APIs, and event-driven design – Enables rapid response to market changes."
            },
            {
                "Name": "Manage & Reduce Technology Debt",
                "Strategy": "Prioritize refactoring and automated technical debt scoring – Allocate time in planning cycles – Maintains long-term system health."
            },
            {
                "Name": "Build Observability Architecture by Default",
                "Strategy": "Instrument all systems with metrics, logs, traces, and alerts – Monitor continuously – Improves operational insight and incident response."
            },
            {
                "Name": "Design Systems for Failure & Graceful Degradation",
                "Strategy": "Implement resilient patterns such as retries, circuit breakers, and failover – Ensure minimal user impact – Enhances reliability."
            },
            {
                "Name": "Manage Infrastructure as Code",
                "Strategy": "Define infrastructure declaratively, version, and automate deployment – Ensure consistency and reproducibility – Reduces manual errors."
            },
            {
                "Name": "Implement API-First Architecture Pattern",
                "Strategy": "Design APIs before service implementation – Maintain clear contracts – Enables interoperability and platform extensibility."
            },
            {
                "Name": "Integrate Security-by-Design",
                "Strategy": "Embed security checks and compliance in every layer of the development lifecycle – Reduce vulnerabilities – Protects organizational and user assets."
            },
            {
                "Name": "Implement Continuous Integration & Deployment Pipelines",
                "Strategy": "Automate build, test, and deployment – Reduce lead time and risk – Ensures high-quality software delivery."
            },
            {
                "Name": "Design Systems for Testability",
                "Strategy": "Implement modular, decoupled designs and automated test frameworks – Facilitate robust validation – Reduces defects and accelerates feedback."
            },
            {
                "Name": "Align Technology Roadmap with Business Strategy",
                "Strategy": "Map technical initiatives to strategic objectives – Prioritize based on business impact – Ensures technology enables growth goals."
            },
            {
                "Name": "Establish Data Governance & Quality Standards",
                "Strategy": "Define ownership, metrics, and processes for data accuracy and compliance – Reduce errors and regulatory risk – Enables reliable insights."
            },
            {
                "Name": "Design Scalability Architecture from Start",
                "Strategy": "Plan systems to handle anticipated load and growth – Incorporate horizontal scaling and resilience – Minimizes future rework."
            },
            {
                "Name": "Maintain Technical Standards & Pattern Consistency",
                "Strategy": "Define coding, architectural, and operational standards – Enforce through reviews and automation – Reduces technical debt and onboarding friction."
            },
            {
                "Name": "Plan Technology Refresh & Modernization Cycles",
                "Strategy": "Regularly assess and update systems, tools, and frameworks – Align with lifecycle and strategic priorities – Reduces obsolescence risk."
            },
            {
                "Name": "Build Autonomy-Enabling Platform Services",
                "Strategy": "Provide teams with reusable, self-service infrastructure – Reduce dependencies on central operations – Accelerates delivery speed."
            },
            {
                "Name": "Standardize Containerization & Orchestration",
                "Strategy": "Adopt consistent container and orchestration patterns – Simplify deployment and scaling – Enables portable and resilient applications."
            },
            {
                "Name": "Define & Communicate Product Vision",
                "Strategy": "Articulate clear outcomes, goals, and purpose – Align stakeholders – Drives prioritization and motivation."
            },
            {
                "Name": "Implement Structured Product Discovery",
                "Strategy": "Use iterative research, prototyping, and validation – Test assumptions early – Reduces risk of misaligned investment."
            },
            {
                "Name": "Conduct Continuous User Research",
                "Strategy": "Regularly engage users through interviews, surveys, and analytics – Feed insights into design and roadmap – Ensures customer-centric solutions."
            },
            {
                "Name": "Drive Outcome-Oriented Product Roadmaps",
                "Strategy": "Prioritize work based on measurable business impact – Communicate goals clearly – Improves alignment and accountability."
            },
            {
                "Name": "Deliver in Small Batches for Rapid Feedback",
                "Strategy": "Break work into manageable increments – Deploy frequently – Collect learning and adjust quickly."
            },
            {
                "Name": "Use Feature Flags for Safe Progressive Rollout",
                "Strategy": "Enable controlled exposure of features – Test impact with minimal risk – Supports experimentation and quality assurance."
            },
            {
                "Name": "Build Experimentation & A/B Testing Capability",
                "Strategy": "Implement infrastructure and governance for experiments – Validate hypotheses quickly – Accelerates evidence-based decisions."
            },
            {
                "Name": "Implement Product Metrics & Analytics Strategy",
                "Strategy": "Define KPIs and dashboards – Monitor performance and outcomes – Guides data-informed prioritization."
            },
            {
                "Name": "Apply Explicit Product Prioritization Framework",
                "Strategy": "Use structured frameworks (RICE, WSJF, etc.) – Prioritize backlog based on value and effort – Optimizes resource allocation."
            },
            {
                "Name": "Integrate Continuous Market Research",
                "Strategy": "Collect competitive intelligence and trends – Feed insights into roadmap – Ensures market-responsive products."
            },
            {
                "Name": "Proactively Manage Product Risks",
                "Strategy": "Identify, assess, and mitigate risks systematically – Track continuously – Reduces surprises and protects outcomes."
            },
            {
                "Name": "Establish Direct User Feedback Loops",
                "Strategy": "Integrate real-time user input into development – Respond promptly – Improves adoption, satisfaction, and alignment."
            },
            {
                "Name": "Maintain Ongoing Competitive Intelligence Program",
                "Strategy": "Track competitors and trends continuously – Disseminate insights – Informs product and strategy decisions."
            },
            {
                "Name": "Manage Product Technical Health & Debt",
                "Strategy": "Monitor technical debt and system health – Allocate time for remediation – Sustains product quality and agility."
            }
        ]
    },
    "Value": {
        "Formula": "[Core Belief] – [Observable Behavior/Context] [Why it Matters]",
        "Description": {
            "What": "Core principles and fundamental beliefs that define what the organization stands for.",
            "Why": "Shapes culture, decision-making, hiring, and brand reputation; ensures ethical alignment."
        },
        "Examples": [
            "Customer Focus – We prioritize solving real customer pain points because lasting value builds loyalty",
            "Integrity – We act honestly in all dealings because trust is foundational"
        ],
        "BestPractice": "3–5 core values maximum, specific and actionable, embedded in hiring and performance reviews",
        "Statements": [
            "Psychological Safety As Non-Negotiable",
            "Transparency Over Hierarchy",
            "Collective Results Over Individual Achievement",
            "Learning Velocity Over Error Avoidance",
            "Decentralized Authority Over Central Control",
            "Intrinsic Motivation Over Extrinsic Reward",
            "Blameless Culture Over Blame Attribution",
            "Trust-Based Accountability Over Surveillance",
            "Systems Thinking Over Reductionism",
            "Emerging Strategy Over Fixed Planning",
            "Adaptive Response Over Rigid Adherence",
            "Human-Centric Design Over Process-Centric",
            "Continuous Learning Over Expert Gatekeeping",
            "Vulnerability Over Invulnerability",
            "Technical Excellence Over Speed Compromise",
            "Sustainable Pace Over Heroic Effort",
            "Feedback-Driven Iteration Over Big Bang",
            "Diverse Perspective Over Homogeneous Thinking",
            "Emergent Leadership Over Positional Authority",
            "Antifragility Over Robustness",
            "Meaningful Work Over Task Completion",
            "Production Resilience Over Zero-Failure",
            "Autonomy Within Alignment",
            "Principled Risk-Taking Over Risk Aversion",
            "Flow State Optimization",
            "Organizational Learning Capability",
            "Distributed Decision-Making Authority",
            "Real-Time Feedback Integration",
            "Skill Variety & Task Identity",
            "Mental Model Alignment",
            "Healthy Conflict Over Avoidance",
            "Commitment Through Dialogue",
            "Results Focus With Humanity",
            "Technical Debt Visibility",
            "Continuous Capability Evolution",
            "Failure As Information Source",
            "Cognitive Diversity Valuation",
            "Organizational System Health",
            "Shared Purpose Alignment",
            "Experimentation Encouragement",
            "Pattern Recognition Capability",
            "Decentralized Problem-Solving",
            "Authentic Leadership Behavior",
            "Speed Over Perfection",
            "Quality Over Speed",
            "Simplicity Over Complexity",
            "Long-Term Thinking",
            "Community",
            "Equity",
            "Transparency In Metrics",
            "Radical Candor",
            "Respect",
            "Moonshot Mentality Over Incrementalism",
            "Algorithmic Transparency & Fairness",
            "Value Stream Optimization Over Local Efficiency",
            "Digital Sovereignty & Data Stewardship",
            "Psychological Detachment & Recharging",
            "Radical Honesty & Integrity",
            "Humility & Intellectual Curiosity",
            "Conflict Resolution Capability"
        ]
    },
    "Principle": {
        "Formula": "[Operating Rule] [Behavioral Manifestation] [Context]",
        "What": "Guiding beliefs that shape and constrain behavior and decision-making.",
        "Why": "They operationalize values, reduce ambiguity, and create consistency across teams, technology, and leadership decisions.",
        "Examples": [
            "Transparency First – We share progress and setbacks openly because trust improves collaboration.",
            "Autonomy With Accountability – Teams decide how, leadership tracks outcomes."
        ],
        "BestPractices": "Principles must be observable in behavior, enforceable in decision-making, embedded in governance, measurable through metrics, and reinforced in leadership norms and incentives.",
        "Items": [
            {
                "Principle": "Data as a Product",
                "Statement": "Treat data as a managed product – Define ownership, quality, discoverability, and usability standards – Ensures reliable downstream analytics and ML outcomes."
            },
            {
                "Principle": "Shift-Left Data Quality",
                "Statement": "Ensure data quality at the point of creation – Validate, test, and monitor early – Reduces rework and prevents systemic defects from propagating."
            },
            {
                "Principle": "Federated Computational Governance",
                "Statement": "Distribute governance rules across domain teams – Apply policy-as-code and automated guardrails – Enables scalable autonomy without losing compliance."
            },
            {
                "Principle": "Ethical AI by Design",
                "Statement": "Embed fairness, transparency, and safety into ML workflows – Use model cards, bias tests, and human oversight – Protects users and mitigates systemic harm."
            },
            {
                "Principle": "LLMOps Reproducibility",
                "Statement": "Standardize data, prompts, and model configurations – Track lineage and version artifacts – Ensures trustworthy and auditable AI behavior."
            },
            {
                "Principle": "Human-in-the-Loop Supervision",
                "Statement": "Integrate human judgment into AI decision cycles – Validate model outputs in sensitive cases – Reduces risk and ensures ethical alignment."
            },
            {
                "Principle": "Privacy-Preserving Computation",
                "Statement": "Apply encryption-by-default, differential privacy, and data minimization – Protect user data during processing – Ensures compliance and trust."
            },
            {
                "Principle": "Polyglot Persistence",
                "Statement": "Use different data stores for different workloads – Select purpose-fit storage solutions – Improves performance, scalability, and simplicity."
            },
            {
                "Principle": "Real-Time Contextual Intelligence",
                "Statement": "Enable systems to react using live, contextual data – Stream events and enrich signals – Supports adaptive, intelligent automation."
            },
            {
                "Principle": "Infrastructure as Code (IaC)",
                "Statement": "Define infrastructure in declarative code – Version, review, and automate – Ensures consistency, scalability, and rollback capability."
            },
            {
                "Principle": "Immutable Infrastructure",
                "Statement": "Deploy through replacement, not mutation – Avoid manual changes – Eliminates drift and accelerates recovery."
            },
            {
                "Principle": "Golden Paths (Paved Roads)",
                "Statement": "Provide curated, supported engineering paths – Offer well-documented defaults – Reduces cognitive load and accelerates delivery."
            },
            {
                "Principle": "Ephemerality by Default",
                "Statement": "Design systems that can be safely recreated at any time – Use stateless services where possible – Increases resiliency and elasticity."
            },
            {
                "Principle": "FinOps Accountability",
                "Statement": "Make teams responsible for cloud spend – Provide transparent cost metrics – Ensures sustainable resource usage."
            },
            {
                "Principle": "Chaos Engineering",
                "Statement": "Inject controlled failure into systems – Validate resilience under stress – Prepares systems for real-world disruptions."
            },
            {
                "Principle": "Observability over Monitoring",
                "Statement": "Instrument systems to answer unknown questions – Use traces, logs, metrics, and events – Enables rapid incident diagnosis."
            },
            {
                "Principle": "Security as Code (DevSecOps)",
                "Statement": "Automate security scanning and enforcement – Integrate into CI/CD – Prevents vulnerabilities early and continuously."
            },
            {
                "Principle": "Progressive Delivery",
                "Statement": "Release features gradually via canaries and flags – Observe behavior before full rollout – Minimizes blast radius and accelerates innovation."
            },
            {
                "Principle": "Zero Trust Architecture",
                "Statement": "Authenticate and authorize every request – Assume breach – Minimizes lateral movement and increases security posture."
            },
            {
                "Principle": "Outcome over Output",
                "Statement": "Optimize for customer impact – Measure results, not activities – Ensures meaningful value delivery."
            },
            {
                "Principle": "Continuous Product Discovery",
                "Statement": "Validate ideas through frequent experiments – Collect qualitative and quantitative evidence – Reduces risk of building the wrong thing."
            },
            {
                "Principle": "Radical Accessibility",
                "Statement": "Design products accessible to all users – Embed WCAG and inclusive design – Expands reach and ensures equitable experience."
            },
            {
                "Principle": "Value Stream Alignment",
                "Statement": "Organize teams around end-to-end flow – Minimize handoffs and dependencies – Increases delivery speed and learning loops."
            },
            {
                "Principle": "Weighted Shortest Job First",
                "Statement": "Prioritize by economic impact – Deliver highest value fastest – Optimizes flow efficiency across the portfolio."
            },
            {
                "Principle": "Lean Hypothesis Testing",
                "Statement": "Formulate experiments with falsifiable hypotheses – Measure with clear metrics – Accelerates validated learning."
            },
            {
                "Principle": "Customer Empathy Loops",
                "Statement": "Embed real customer insights in decisions – Observe, interview, and shadow users – Prevents misalignment and improves relevance."
            },
            {
                "Principle": "Asynchronous by Default",
                "Statement": "Communicate through written, transparent channels – Allow autonomy across time zones – Reduces interruptions and increases clarity."
            },
            {
                "Principle": "Psychological Safety",
                "Statement": "Encourage open expression without fear – Normalize dissent, questions, and uncertainty – Enables innovation and high-velocity learning."
            },
            {
                "Principle": "Cognitive Diversity",
                "Statement": "Bring varied thinking styles into decisions – Use structured debate and role rotation – Improves creativity and resilience."
            },
            {
                "Principle": "Radical Candor",
                "Statement": "Speak with direct honesty and genuine care – Give feedback early and often – Elevates trust and accelerates correction loops."
            },
            {
                "Principle": "Distributed Authority",
                "Statement": "Push decisions to the closest competent edge – Empower teams with clear boundaries – Increases speed and ownership."
            },
            {
                "Principle": "Servant Leadership",
                "Statement": "Leaders remove obstacles and amplify teams – Prioritize coaching over commanding – Improves engagement and team capability."
            },
            {
                "Principle": "Network over Hierarchy",
                "Statement": "Optimize for fluid collaboration – Enable cross-functional peer networks – Reduces bottlenecks and speeds up coordination."
            },
            {
                "Principle": "Sustainable Pace",
                "Statement": "Maintain a long-term healthy workload – Avoid burnout-inducing heroics – Ensures consistent performance and quality."
            },
            {
                "Principle": "InnerSource",
                "Statement": "Open internal code for contribution – Use transparent reviews and shared standards – Accelerates reuse and cross-team learning."
            },
            {
                "Principle": "Disruptive Innovation (Moonshots)",
                "Statement": "Allocate space for high-risk, high-reward ideas – Encourage frontier experiments – Expands future strategic advantage."
            },
            {
                "Principle": "Product-Led Growth (PLG)",
                "Statement": "Let product usage drive acquisition and expansion – Instrument value discovery moments – Increases organic growth efficiency."
            },
            {
                "Principle": "Pivot Speed (Optionality)",
                "Statement": "Adapt rapidly based on new evidence – Minimize sunk-cost attachments – Increases resilience in dynamic markets."
            },
            {
                "Principle": "Antifragile Strategy",
                "Statement": "Build systems that improve under stress – Learn from variability, not avoid it – Enhances long-term adaptability."
            },
            {
                "Principle": "Ecosystem Thinking",
                "Statement": "Optimize for interoperability and external value – Design APIs, standards, and partnerships – Expands influence beyond the product."
            },
            {
                "Principle": "Boy Scout Rule",
                "Statement": "Leave the code and system cleaner than you found it – Make small, continuous improvements – Reduces long-term degradation."
            },
            {
                "Principle": "Loose Coupling",
                "Statement": "Minimize dependencies between components – Allow independent deployment – Increases scaling flexibility and robustness."
            },
            {
                "Principle": "High Cohesion",
                "Statement": "Group related responsibilities tightly – Keep services focused and purposeful – Improves maintainability and clarity."
            },
            {
                "Principle": "Fail Fast",
                "Statement": "Expose invalid assumptions early – Run small, reversible experiments – Reduces cost of failure and accelerates learning."
            },
            {
                "Principle": "You Build It, You Run It",
                "Statement": "Teams own software end-to-end – Operate what they deliver – Drives quality and accountability."
            },
            {
                "Principle": "Keep It Simple (KISS)",
                "Statement": "Favor the simplest viable solution – Avoid unnecessary abstraction – Reduces bugs, complexity, and cognitive load."
            },
            {
                "Principle": "Automate Everything",
                "Statement": "Eliminate manual toil through automation – Codify repetitive workflows – Improves reliability and speed."
            },
            {
                "Principle": "GreenOps (Sustainability)",
                "Statement": "Optimize systems for energy efficiency – Measure and reduce carbon impact – Ensures ecological and economic sustainability."
            },
            {
                "Principle": "Strangler Fig Pattern",
                "Statement": "Replace legacy systems incrementally – Wrap and evolve components over time – Reduces migration risk and downtime."
            },
            {
                "Principle": "API First",
                "Statement": "Design APIs before implementing services – Ensure clarity, consistency, and usability – Enables scalable system integration."
            },
            {
                "Principle": "Contract-Driven Development",
                "Statement": "Define service contracts upfront – Validate across environments – Reduces integration failures."
            },
            {
                "Principle": "Continuous Refactoring",
                "Statement": "Improve code structure continuously – Avoid large rewrites – Preserves agility and technical health."
            },
            {
                "Principle": "Single Source of Truth",
                "Statement": "Centralize canonical data and decisions – Avoid duplication and drift – Ensures alignment and integrity across systems."
            }
        ]
    },
    "Behavior": {
        "Formula": "[Action] [What/How] [Why/Expected Impact]",
        "What": "Explicit expected actions aligned with principles and purpose.",
        "Why": "They translate abstract principles into observable, repeatable actions that shape culture and execution.",
        "Examples": [
            "Collaborate openly – Share decisions with stakeholders to accelerate learning.",
            "Question value – Challenge ideas while respecting people to ensure meaningful outcomes."
        ],
        "BestPractices": "Behaviors must be specific, measurable, observable in daily work, used in onboarding, feedback, and decision-making filters.",
        "Items": [
            "Provide & Seek Continous Timely & Constructive Feedback",
            "Promote transparent communication",
            "Share Decision-Making Rationale Transparently",
            "Communicate Status With Transparency",
            "Encourage & Build Cross-Team collaboration Intentionally",
            "Document decisions clearly as part of Information Radiance",
            "Default to open and transparent documentation",
            "Communicate Status With Transparency with regard for Asynchronous Context",
            "Mentor & Coach Growth between colleagues",
            "Facilitate & Promote State of Art Knowledge Sharing Sessions",
            "Reflect On Personal Learning Regularly",
            "Engage In Long-Term continuous Learning",
            "Foster curiosity and experimentation",
            "Encourage hypothesis-driven development",
            "Experiment with new technologies",
            "Time-Box High-Risk Exploratory Work",
            "Question & Test Assumptions With Curiosity & Empirically",
            "Challenge Assumptions About Human-AI Teaming Roles",
            "Challenge the status quo respectfully",
            "Use Data To Ground Discussions",
            "Use metrics to guide decisions",
            "Encourage Respect",
            "Promote accountability culture",
            "Distribute Decision Authority",
            "Rotate Leadership Responsibilities",
            "Establish Clear Escalation Paths",
            "Practice Pair Programming",
            "Pair work on complex tasks",
            "Use Retrospectives For Continuous Improvement Workflows",
            "Balance speed with reliability",
            "Identify and mitigate risks proactively",
            "Ensure high code quality standards",
            "Amplify Quieter Voices In Discussions",
            "Foster psychological safety",
            "Practice Inclusion",
            "Promote sustainability in projects",
            "Prioritize user impact",
            "Connect Work To Purpose Regularly",
            "Automate Repetitive Toil",
            "Leverage AI for efficiency",
            "Invest In Systemic Cognitive Load Reduction",
            "Simplify Complexity Through Ownership",
            "Allocate Time For System Thinking"
        ]
    },
    "Goals": {
        "Formula": "[Objective: Qualitative Goal] [Key Results: Quantitatives, Time-Bound Measures]",
        "What": "Specific, measurable objectives aligned with strategy and mission.",
        "Why": "They create focus, accountability, alignment, and measurable progress toward the vision.",
        "Examples": [
            {
                "Objective": "Increase enterprise customer satisfaction",
                "KeyResults": [
                    "Achieve 90% NPS",
                    "Reduce support ticket resolution time from 48h to 24h",
                    "Reach 95% uptime"
                ]
            },
            {
                "Objective": "Dominate market share",
                "KeyResults": [
                    "Grow ARR 40%",
                    "Expand customer base 50%",
                    "Reach 98% retention"
                ]
            }
        ],
        "BestPractices": "Use OKRs with a balance of ambitious and committed objectives; 3–5 measurable key results; quarterly cadence; outcome-driven metrics, not activity-based.",
        "Items": [
            "Deploy To Production Daily",
            "Achieve ≤⟨Time⟩ Change Lead Time",
            "Achieve ≤⟨Target%⟩ Change Failure Rate",
            "Enable Mean Time To Recovery ≤⟨Time⟩",
            "Establish ≥⟨Target%⟩ Ceremony Attendance",
            "Achieve ≥⟨Target%⟩ Psychological Safety Survey Score",
            "Reduce Team Impediments ≥⟨Target%⟩",
            "Enable ≥⟨Target%⟩ Organization Agile Adoption",
            "Reduce Change Resistance ≥⟨Target%⟩",
            "Build ≥⟨Count⟩ Internal Coaches",
            "Grow Community ≥⟨Target%⟩ YoY",
            "Achieve ≥⟨Target%⟩ Active Participation",
            "Demonstrate Knowledge Transfer ≥⟨Target%⟩",
            "Community Self-Sustaining",
            "Run ≥⟨Count⟩ Experiments Monthly",
            "Establish ≥⟨Count⟩ Knowledge Bus Factor Per Domain",
            "Cross-Team Collaboration Index ≥⟨Target Score⟩",
            "Achieve ≥⟨Target%⟩ ADR Adoption Rate",
            "Achieve ≥⟨Target%⟩ Sprint Commitment Accuracy",
            "Achieve ≥⟨Target%⟩ Deployment Success Rate",
            "Achieve ≥⟨Target%⟩ IaC Coverage",
            "Achieve ≥⟨Target%⟩ API-First Development",
            "Complete CI/CD Pipeline Deployment",
            "Achieve ≥⟨Target%⟩ Automated Test Coverage",
            "Achieve ≥⟨Target%⟩ Feature Flag Coverage",
            "Tech Standards Consistency",
            "Achieve ≥⟨Target%⟩ Cross-Functional Fluency",
            "Achieve ≥⟨Target%⟩ Learning Completion",
            "Establish Team Retention Rate ≥⟨Target%⟩",
            "Reduce Extraneous Cognitive Load ≥⟨Target%⟩",
            "Reduce Context Switching ≤⟨Count⟩ Per Day",
            "Reduce Technical Debt Interest ≤⟨Target%⟩",
            "Achieve ≥⟨Target%⟩ Of Development Time On Core Features",
            "Reduce Toil ≤⟨Target%⟩ Of SRE Time",
            "Achieve ≥⟨Target%⟩ Skill Variety Across Team",
            "Achieve Intrinsic Motivation Score ≥⟨Target Score⟩",
            "Reduce Burnout Indicators ≥⟨Target%⟩",
            "Achieve Mentoring Coverage ≥⟨Target%⟩",
            "Reduce Incident Mean Detection Time ≤⟨Time⟩",
            "Establish Flow State Duration Average ≥⟨Time⟩ Hours",
            "Achieve Code Review Turnaround ≤⟨Time⟩ Hours",
            "Reduce Production Incidents ≥⟨Target%⟩",
            "Establish Continuous Delivery Pipeline Uptime ≥⟨Target%⟩",
            "Reduce Technical Onboarding Time ≤⟨Time⟩ Weeks",
            "Establish Community Contribution Participation ≥⟨Target%⟩",
            "Establish ≥⟨Target%⟩ Team Topologies Alignment Score",
            "Reduce System Complexity Metrics ≥⟨Target%⟩",
            "Achieve ≥⟨Target%⟩ Platform Engineering Feature Adoption",
            "Establish Observability Adoption Rate ≥⟨Target%⟩",
            "Reduce Mean Time To Diagnosis ≤⟨Time⟩ Minutes",
            "Establish Experimentation Velocity ≥⟨Count⟩ A/B Tests Monthly",
            "Establish Shared Consciousness Across ≥⟨Target%⟩ Of Staff",
            "Establish Trust Score ≥⟨Target Score⟩",
            "Reduce Organizational Silos ≥⟨Target%⟩",
            "Achieve Tier 1 SLA Compliance ≥⟨Target%⟩",
            "Achieve AI Model Drift Reduction Below ⟨Target%⟩",
            "Reduce Time To Implement New Compliance Rule Below ⟨Time⟩",
            "Establish Measurable Cognitive Diversity Index Above ⟨Target Score⟩",
            "Reduce High-Severity Security Vulnerability Time-To-Fix Below ⟨Time⟩",
            "Achieve Platform Feature Adoption Rate Above ⟨Target%⟩"
        ]
    }
};


// Deterministic Keyword Extraction (Simple Heuristic)
const STOP_WORDS = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'on', 'at', 'by', 'an', 'be', 'this', 'which', 'or', 'from', 'but', 'not', 'are', 'your', 'we', 'our', 'us']);

export function extractKeywords(text: string): string[] {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const keywords = words.filter(word => word.length > 2 && !STOP_WORDS.has(word));
    // Return unique keywords, top 8
    return Array.from(new Set(keywords)).slice(0, 8);
}

// Deterministic Mission -> Value Mapping
// Expanded map based on new Value Library
const KEYWORD_VALUE_MAP: Record<string, string> = {
    'safe': 'Safety', 'safety': 'Safety',
    'secure': 'Security', 'security': 'Security',
    'fast': 'Speed', 'speed': 'Speed',
    'reliable': 'Reliability', 'reliability': 'Reliability',
    'trust': 'Trust',
    'honest': 'Honesty',
    'transparent': 'Transparency',
    'innovate': 'Innovation', 'innovation': 'Innovation',
    'customer': 'Customer Obsession',
    'user': 'User Centricity',
    'quality': 'Quality',
    'excellence': 'Excellence',
    'team': 'Teamwork', 'collaborate': 'Collaboration',
    'open': 'Openness',
    'inclusive': 'Inclusivity',
    'respect': 'Respect',
    'empathy': 'Empathy',
    'curious': 'Curiosity', 'curiosity': 'Curiosity',
    'learn': 'Learning', 'learning': 'Learning',
    'service': 'Service',
    'own': 'Ownership', 'ownership': 'Ownership',
    'accountable': 'Accountability',
    'action': 'Bias for Action',
    'sustain': 'Sustainability', 'sustainable': 'Sustainability',
    'impact': 'Impact',
    'grow': 'Growth', 'growth': 'Growth',
    'adapt': 'Adaptability',
    'resilient': 'Resilience',
    'courage': 'Courage',
    'experiment': 'Experimentation',
    'engineer': 'Engineering Excellence',
    'share': 'Knowledge Sharing',
    'improve': 'Continuous Improvement',
    'agile': 'Agility', 'agility': 'Agility',
    'lead': 'Leadership',
    'solve': 'Problem Solving',
    'data': 'Data-Driven',
    'digital': 'Digital Fluency',
    'vision': 'Vision',
    'strategy': 'Strategy',
    'mentor': 'Mentorship',
    'coach': 'Coaching',
    'empower': 'Empowerment',
    'culture': 'Culture Building',
    'network': 'Networking',
    'decide': 'Decision-Making',
    'ethic': 'Ethics',
    'diverse': 'Diversity',
    'equity': 'Equity',
    'perform': 'Performance',
    'optimize': 'Optimization',
    'scale': 'Scaling',
    'transform': 'Transformation',
    'commit': 'Commitment',
    'responsible': 'Responsibility'
};

export function suggestValues(keywords: string[]): Value[] {
    const suggestions: Value[] = [];
    const seen = new Set<string>();

    keywords.forEach(kw => {
        // Try direct match or partial match
        let valLabel = KEYWORD_VALUE_MAP[kw];
        if (!valLabel) {
            // Simple fuzzy fallback: check if keyword is contained in any map key
            const key = Object.keys(KEYWORD_VALUE_MAP).find(k => kw.includes(k));
            if (key) valLabel = KEYWORD_VALUE_MAP[key];
        }

        if (valLabel && !seen.has(valLabel)) {
            suggestions.push({
                id: `val-${kw}-${Date.now()}`,
                label: valLabel,
                source: 'system',
                explanation: `Derived from keyword "${kw}" in mission statement.`
            });
            seen.add(valLabel);
        }
    });

    return suggestions;
}

// Deterministic Value -> Behavior Mapping
export function deriveBehaviors(values: Value[]): Behavior[] {
    const behaviors: Behavior[] = [];
    const usedBehaviors = new Set<string>();

    values.forEach(val => {
        // Find behaviors that match this value
        const relevantBehaviors = BEHAVIOR_LIBRARY.filter(b => {
            const text = b.toLowerCase();
            const valText = val.label.toLowerCase();
            return text.includes(valText) ||
                (valText === 'safety' && text.includes('unsafe')) ||
                (valText === 'reliability' && text.includes('deploy')) ||
                (valText === 'innovation' && text.includes('experiment')) ||
                (valText === 'customer obsession' && text.includes('customer')) ||
                (valText === 'quality' && text.includes('bug'));
        });

        relevantBehaviors.forEach((behText, idx) => {
            if (!usedBehaviors.has(behText)) {
                behaviors.push({
                    id: `beh-${val.id}-${idx}`,
                    label: behText,
                    derivedFromValues: [val.id],
                    explanation: `Standard behavior for value "${val.label}"`,
                    ruleId: 'RULE-STD-BEH'
                });
                usedBehaviors.add(behText);
            }
        });
    });

    return behaviors;
}

// Deterministic Principles Mapping
export function derivePrinciples(values: Value[], _behaviors: Behavior[]): Principle[] {
    const principles: Principle[] = [];

    values.forEach(val => {
        // Find matching principle from library
        const match = PRINCIPLE_LIBRARY.find(p => p.includes(val.label));
        if (match) {
            principles.push({
                id: `prin-${val.id}`,
                label: match,
                derivedFromValues: [val.id],
                explanation: `Derived from ${val.label}`
            });
        } else {
            // Fallback generation
            principles.push({
                id: `prin-${val.id}`,
                label: `We believe in ${val.label} as a core driver of our success.`,
                derivedFromValues: [val.id],
                explanation: `Core principle based on ${val.label}`
            });
        }
    });

    return principles;
}

// Vision Archetypes (v1.1 Refinement)
export const VISION_ARCHETYPES = [
    { "id": "arch-1", "label": "The Pioneer", "description": "Constantly pushes boundaries, explores new technologies, and defines future markets.", "keywords": ["innovation", "exploration", "future", "technology", "growth", "creativity", "risk-taking", "visionary"] },
    { "id": "arch-2", "label": "The Guardian of Quality", "description": "Ensures reliability, safety, and excellence in every delivery.", "keywords": ["quality", "excellence", "reliability", "safety", "trust", "engineering", "standards", "consistency"] },
    { "id": "arch-3", "label": "The AI-Enabler Team", "description": "Leverages AI to amplify value creation and streamline operations.", "keywords": ["AI", "automation", "efficiency", "innovation", "insights", "data-driven", "scaling", "intelligence"] },
    { "id": "arch-4", "label": "The Community Builder", "description": "Fosters collaboration, inclusivity, and engagement across all stakeholders.", "keywords": ["community", "collaboration", "inclusivity", "culture", "trust", "network", "engagement", "belonging"] },
    { "id": "arch-5", "label": "The Change Catalyst", "description": "Drives organizational transformation, embracing new work and agile methods.", "keywords": ["change", "transformation", "agility", "adaptation", "innovation", "learning", "resilience", "leadership"] },
    { "id": "arch-6", "label": "The Customer Champion", "description": "Obsessed with understanding and exceeding customer needs and expectations.", "keywords": ["customer", "user-centric", "service", "experience", "feedback", "empathy", "value", "impact"] },
    { "id": "arch-7", "label": "The Visionary Strategist", "description": "Guides teams with a clear north star and strategic foresight.", "keywords": ["strategy", "vision", "alignment", "planning", "execution", "innovation", "foresight", "guidance"] },
    { "id": "arch-8", "label": "The Resilient Operator", "description": "Maintains performance under stress and ensures operational continuity.", "keywords": ["resilience", "stress-management", "execution", "reliability", "operations", "focus", "consistency", "discipline"] },
    { "id": "arch-9", "label": "The Learning Enthusiast", "description": "Promotes continuous learning and skills development across the team.", "keywords": ["learning", "growth", "curiosity", "skills", "development", "training", "coaching", "knowledge"] },
    { "id": "arch-10", "label": "The Innovation Seeker", "description": "Constantly experiments with new technologies, methods, and approaches.", "keywords": ["innovation", "experimentation", "creativity", "R&D", "agile", "discovery", "risk-taking", "prototype"] },
    { "id": "arch-11", "label": "The Ethical Leader", "description": "Ensures decisions align with ethics, compliance, and social responsibility.", "keywords": ["ethics", "integrity", "social-responsibility", "trust", "transparency", "compliance", "values", "governance"] },
    { "id": "arch-12", "label": "The User Advocate", "description": "Prioritizes user needs and experience in all decisions and processes.", "keywords": ["user-centric", "empathy", "experience", "feedback", "accessibility", "inclusivity", "advocacy", "service"] },
    { "id": "arch-13", "label": "The Data-Driven Analyst", "description": "Leverages data and metrics to guide decisions and optimize outcomes.", "keywords": ["data", "metrics", "analysis", "insights", "decision-making", "optimization", "KPIs", "monitoring"] },
    { "id": "arch-14", "label": "The Agile Facilitator", "description": "Guides teams in agile ceremonies and ensures effective collaboration.", "keywords": ["agile", "scrum", "facilitation", "ceremonies", "collaboration", "communication", "coordination", "efficiency"] },
    { "id": "arch-15", "label": "The Cultural Ambassador", "description": "Maintains and spreads the desired team culture and values.", "keywords": ["culture", "values", "communication", "engagement", "behavior", "norms", "leadership", "alignment"] },
    { "id": "arch-16", "label": "The Problem Solver", "description": "Rapidly identifies, analyzes, and resolves challenges and blockers.", "keywords": ["problem-solving", "analysis", "decision-making", "resilience", "creativity", "collaboration", "action", "ownership"] },
    { "id": "arch-17", "label": "The Sustainability Advocate", "description": "Integrates sustainability and eco-consciousness into projects and decisions.", "keywords": ["sustainability", "environment", "ethics", "impact", "green", "responsibility", "consciousness", "long-term"] },
    { "id": "arch-18", "label": "The Collaboration Engineer", "description": "Builds bridges between teams, departments, and stakeholders to maximize synergy.", "keywords": ["collaboration", "networking", "coordination", "communication", "integration", "teamwork", "facilitation", "engagement"] },
    { "id": "arch-19", "label": "The Technical Master", "description": "Excels in engineering, architecture, and technical excellence.", "keywords": ["technical", "engineering", "quality", "architecture", "standards", "optimization", "innovation", "delivery"] },
    { "id": "arch-20", "label": "The Adaptive Leader", "description": "Adjusts strategy and approach based on evolving context and feedback.", "keywords": ["adaptation", "flexibility", "resilience", "learning", "agility", "decision-making", "leadership", "change"] }
];

// Team Up - Core Rules & Templates

// 1. PURPOSE (Why we exist)
export const PURPOSE_TEMPLATES = [
    "Enable Continuous Adaptive Delivery at Enterprise Scale",
    "Foster Continuous Evolution Through Data-Driven Feedback Loops",
    "Sustain Organizational Resilience in Complex, Adaptive Systems",
    "Build Distributed, Decentralized Decision-Making Capability",
    "Integrate Human-Centric and AI-Enabled Technical Systems",
    "Enable Continuous Organizational Learning and Knowledge Flow",
    "Sustain Technical Excellence Through Automated Quality and CI/CD",
    "Build Organizational Antifragility and Adaptive Capacity",
    "Create Psychological Safety Foundation to Enable Risk-Taking and Innovation",
    "Enable Highly Autonomous, Cross-Functional Teams",
    "Accelerate Time-to-Value Through AI-Enabled Delivery Pipelines",
    "Build Cross-Functional Coherence Across Product and Platform Teams",
    "Sustain Competitive Advantage Through Continuous Market Sensing",
    "Create a Culture of Rapid Experimentation and Learning",
    "Enable Evidence-Based, AI-Supported Decisions",
    "Build Transparent Operations and Data Visibility",
    "Sustain Employee Engagement Through Empowerment and Recognition",
    "Enable Rapid Experimentation, Failure, and Learning",
    "Create Equitable Access to Tools, Knowledge, and Opportunities",
    "Build Systems Thinking and Cross-Domain Awareness Capability",
    "Enable Sustainable, Scalable Growth Through Operational Excellence",
    "Create Meaningful Work Through Purpose-Driven Initiatives",
    "Build Organizational Change Resilience and Adaptivity",
    "Enable Community, Collaboration, and Networked Teams",
    "Sustain Innovation Momentum Through Iterative Experimentation",
    "Build a Future-Ready, AI-Enabled Organization",
    "Build Shared Consciousness Across Teams and Ecosystems",
    "Accelerate Organizational Learning at High Velocity",
    "Eliminate Silos by Radical Transparency and Open Knowledge Sharing",
    "Drive Intrinsic Motivation in Technical Teams via Autonomy and Purpose",
    "Reduce System Entropy and Cognitive Friction Through Automation",
    "Create Emergent Innovation by Ensuring Psychological Safety",
    "Distribute Authority to Empower Decentralized Decision-Making",
    "Strengthen Organizational Immune Function for Resilience",
    "Optimize Flow State Across Technical and Product Systems",
    "Build Trust by Fostering Vulnerability and Accountability",
    "Transform Organizational Complexity into Competitive Advantage",
    "Enable Sustainable Delivery Pace in High-Velocity Environments",
    "Cultivate Organizational Learning and Knowledge Integration",
    "Align Technical Architecture to Team Topology for Scalable Delivery",
    "Establish Blameless Culture to Accelerate Learning from Failure",
    "Empower Teams as High-Impact Self-Organizing Systems",
    "Integrate Human and Technical Systems for Maximum Performance",
    "Establish a Principled Risk-Taking Culture to Foster Innovation",
    "Create Feedback Loops as Strategic Levers for Continuous Improvement",
    "Develop Anti-Fragile Technical and Organizational Capabilities",
    "Leverage AI and Data to Maximize Customer Value Across Products",
    "Foster Enterprise-Level Agile Alignment Across Business and Technology",
    "Enable Platform Thinking and Ecosystem Innovation Beyond Teams",
    "Drive User-Centric Product Innovation Through Continuous Experimentation",
    "Integrate Sustainability and Responsible Tech Into Core Delivery",
    "Accelerate Knowledge Sharing and AI-Augmented Organizational Learning",
    "Optimize Global-Scale Operations for Reliability, Security, and Performance",
    "Embed Predictive Analytics and AI in Decision-Making Processes",
    "Cultivate Cross-Organizational Collaboration to Unlock Collective Intelligence",
    "Establish Continuous Product Lifecycle Optimization with Feedback Loops",
    "Drive Ethical AI and Transparency in All Technology Initiatives",
    "Foster Rapid Experimentation Culture with Measurable Business Outcomes",
    "Enable Adaptive, Data-Driven Risk Management Across Enterprise",
    "Design Future-Ready Technology Platforms With Maximum Scalability",
    "Leverage AI to Optimize Organizational Decisions",
    "Drive Hyper-Personalized User Experiences",
    "Enable Seamless Human-AI Collaboration",
    "Build Modular & Future-Ready Enterprise Software",
    "Establish Global Operational Excellence",
    "Foster Disruptive Innovation & Moonshot Thinking",
    "Embed Continuous Usability & Product Excellence",
    "Create Remote-First Knowledge & Collaboration Ecosystem",
    "Implement Predictive & Adaptive Process Optimization",
    "Drive AI-Powered Business & Growth Strategies",
    "Enable Real-Time Organizational Learning Loops",
    "Accelerate High-Impact Innovation Velocity"
];

// 2. VISION (What future we want to create)
export const VISION_TEMPLATES = [
    "Fully Distributed Authority & Empowered Execution",
    "Continuous Deployment as Organizational Norm",
    "Zero-Friction Cognitive Context Switching",
    "Radical Operational Transparency",
    "Real-Time Feedback Integration Loop",
    "Team-Based Accountability as Default",
    "Systems Thinking as Leadership Foundation",
    "Cross-Functional Knowledge Osmosis",
    "Production Resilience Through Antifragility",
    "Intelligent Risk as Competitive Advantage",
    "Emergent Strategy Through Shared Purpose",
    "Flow State as Measurable Engineering Outcome",
    "Psychological Safety as Competitive Moat",
    "Blameless Post-Incident Learning Culture",
    "Platform Engineering as Strategic Capability",
    "Cognitive Load Optimization Infrastructure",
    "Distributed Sense-Making & Pattern Recognition",
    "Adaptive Technical Evolution",
    "Shared Mental Models Across Organization",
    "Real-Time Organizational Nervous System",
    "Decentralized Command & Control Structures",
    "Intrinsic Motivation Through Meaningful Work",
    "Technical Excellence as Cultural Bedrock",
    "Organizational Metabolism Optimization",
    "Adaptive Strategy in Complex Environments",
    "Collective Sense-Making at Scale",
    "Human-Centered Technical Architecture",
    "Organizational Resilience Through Diversity",
    "Deploy to Production Daily",
    "Lead Time Less Than 24 Hours",
    "Rapid Incident Recovery Capability",
    "Feature Toggles Enable Safe Release",
    "Small Batch Deployment Culture",
    "Speed Without Sacrificing Safety",
    "Self-Organizing Teams Across Organization",
    "Cross-Functional Fluency",
    "Transparent Decision-Making",
    "Learning Organization Mentality",
    "Zero Technical Debt Accumulation",
    "Well-Being Integrated in Design",
    "Growth Mindset as Cultural Norm",
    "Innovation Through Experimentation",
    "Data-Driven Product Decisions",
    "Market-Responsive Organization",
    "Sustainable Pace & Rhythm",
    "Community-Driven Development",
    "Knowledge Flows Freely Across Org",
    "Inclusive Leadership at All Levels",
    "Agile Response to Change",
    "Metrics Drive Right Behavior",
    "Customer Voice Deeply Integrated",
    "Diverse Perspectives Valued",
    "Sustainable Long-Term Growth",
    "Innovation Culture Over Predictability",
    "Engaged Workforce",
    "Continuous Improvement Embedded",
    "Future-Ready Adaptive Organization",
    "AI-Augmented Decision Intelligence",
    "Hyper-Personalized Customer Experiences",
    "Seamless Human-AI Collaboration",
    "Next-Gen Modular Enterprise Systems",
    "Global Scale Operational Model",
    "Disruptive Innovation Pipeline",
    "Continuous Usability Excellence",
    "Remote-First Knowledge Ecosystem",
    "Predictive Process Optimization",
    "AI-Powered Growth Engine",
    "Cloud Financial Responsibility Embedded in Every Team (FinOps Culture)",
    "Ethical&Bias-Free AI as a Non-Negotiable Principle",
    "Global Talent Sourcing & Integration as Standard Operating Model"
];

// 2.5 STRATEGY (How we win)
export const STRATEGY_TEMPLATES = WIZARD_CONTENT.Strategy.Items;

// 3. MISSION (What we commit to doing)
export const MISSION_TEMPLATES = [
    "Establish trust-first team dynamics via vulnerability-based coaching and transparent risk-sharing rituals.",
    "Implement DORA metrics-driven improvement cycles using AI-powered value stream mapping and automated bottleneck detection.",
    "Create blameless incident response framework enforcing Cognitive Debriefing and automated incident timeline generation.",
    "Reduce extraneous cognitive load by automating toil and minimizing context switching with specialized tooling.",
    "Establish shared consciousness communication cadence leveraging real-time information radiators and asynchronous communication protocols (AsyncOps).",
    "Build psychological safety through vulnerability through leader modeling and anonymous feedback tools integrated into retrospectives.",
    "Implement systems thinking workshop program utilizing causal loop diagramming and organizational sensing exercises.",
    "Create cross-functional dependency mapping using micro-service interaction analysis and dynamic interface contracts.",
    "Establish continuous delivery infrastructure via GitOps and immutable infrastructure principles.",
    "Develop cognitive diversity hiring practices.",
    "Implement DevOps automation layer utilizing AI-assisted root cause analysis and auto-remediation.",
    "Create production observability platform leveraging four types of telemetry data (metrics, logs, traces, events) and contextual links.",
    "Build team topologies alignment framework enforcing clear interaction modes (Collaboration, X-as-a-Service, Facilitating) based on cognitive load.",
    "Implement feedback loop instrumentation employing telemetry across development and production environments.",
    "Create distributed decision-making protocol using informed consent and delegated authority (Delegation Poker).",
    "Develop role clarity framework through T-shaped skill mapping and dynamic team charters.",
    "Implement intrinsic motivation assessment leveraging SDT (Self-Determination Theory) metrics via pulse surveys.",
    "Build community of practice network driven by self-service platform and rotating stewardship model.",
    "Create real-time alerting infrastructure powered by Machine Learning anomaly detection and probabilistic modeling.",
    "Establish retrospective ceremony framework embedding quantitative data analysis (DORA metrics) and structured debriefing.",
    "Develop skill variety enhancement program using internal hackathons and dedicated innovation sabbaticals.",
    "Create autonomous team operating model using defined boundaries and value stream alignment.",
    "Implement threat recognition training via scenario-based simulations and continuous red/blue team exercises.",
    "Build value stream visibility through end-to-end mapping tools and automated lead time tracking.",
    "Establish peer accountability mechanisms utilizing co-created team contracts and transparent commitment tracking.",
    "Develop personal mastery cultivation program centered on T-Shaped development plans and 20% time allocation for deep work.",
    "Create information flow architecture based on pull-over-push models and synchronous collaboration tools.",
    "Implement change lead time reduction initiative by eliminating handoffs and reducing batch size across the pipeline.",
    "Build failure pattern recognition system leveraging AI clustering of incident data and automated classification.",
    "Establish collective learning infrastructure.",
    "Develop organizational nervous system through real-time sensing capabilities and aggregated system health dashboards.",
    "Create innovation time allocation system guaranteeing dedicated exploratory hours and formal pitch protocols.",
    "Implement risk tolerance calibration by linking business goals to acceptable error budgets and failure rates.",
    "Build cognitive capacity management using Team Topologies constraints and managed dependencies.",
    "Establish team formation best practices guided by Tuckman's stages and continuous social contract review.",
    "Create technical decision record system enforcing ADR (Architecture Decision Record) standards and peer review.",
    "Implement microservice ownership model.",
    "Build deployment automation utilizing serverless functions and blue/green deployment strategies.",
    "Establish version control enforcing Trunk-Based Development and automated release tagging.",
    "Create incident response process using ChatOps integration and predefined runbooks.",
    "Build feature flag system supporting A/B testing and canary rollouts.",
    "Deploy small batches by enforcing low work-in-progress (WIP) limits and daily production releases.",
    "Establish testing standards including shift-left security and AI-powered test generation.",
    "Build cross-functional teams using Skill Gap Analysis for continuous remixing and alignment.",
    "Build tech excellence standards enforcing clean architecture principles and regular code quality reviews.",
    "Implement technical debt management through dedicated reduction sprints and automated debt scoring.",
    "Establish human-centered design via continuous user research and rapid prototyping cycles.",
    "Create well-being program offering flexible schedules and mental health support services.",
    "Build growth opportunity structure formalizing clear career matrices and rotational assignments.",
    "Establish experimentation program using structured hypothesis testing and a standardized sandbox environment.",
    "Create data analytics capability deploying a modern data stack and self-service BI tools.",
    "Implement market research through AI-driven sentiment analysis and continuous competitive scanning.",
    "Build sustainable pace by aligning work capacity to team bandwidth and limiting unplanned work.",
    "Establish community programs fostering internal knowledge sharing forums and external engagement.",
    "Create knowledge management system centralizing all learning assets in a single, searchable repository.",
    "Develop diversity program implementing blind resume review and mentorship for underrepresented groups.",
    "Build long-term strategy based on scenario planning and rolling three-year horizons.",
    "Establish innovation process utilizing Hothouses (idea sprints) and a minimum viable product (MVP) pipeline.",
    "Create engagement programs leveraging Gamification and personalized recognition systems.",
    "Build improvement culture embedding Kaizen events and daily standups focused on process debt.",
    "Develop organizational agility by decoupling services and implementing fast, flexible funding models.",
    "Implement OKR framework ensuring quarterly alignment of strategic goals and transparent reporting.",
    "Build capability development targeting high-demand skills via specialized internal academies.",
    "Establish coaching culture training all leaders in situational leadership and feedback models.",
    "Create performance management using continuous feedback loops and development-focused conversations.",
    "Establish retention programs offering competitive compensation and tailored leadership tracks.",
    "Build leadership development focusing on servant leadership and growth mindset principles.",
    "Create strategic planning running quarterly review cycles and annual long-range forecasting.",
    "Create customer feedback loop integrating real-time product usage data and continuous NPS surveys.",
    "Develop mentorship pairing framework using AI matching based on skill gaps and career trajectory.",
    "Establish AI/ML model governance & ethical audit framework enforcing Model Cards, data lineage tracking, and human-in-the-loop review.",
    "Develop hyper-scalability & fault tolerance architecture by enforcing circuit-breaker patterns and event-driven architecture (EDA).",
    "Implement UX-driven growth loop instrumentation via AI-assisted funnel optimization and A/B testing across all touchpoints.",
    "Create moonshot & exploratory investment budget funding high-risk, high-reward projects with minimal early oversight."
];

// 4. VALUES (What we care about most)
export const VALUES_LIST = [
    { id: `val-0`, label: "Psychological Safety As Non-Negotiable", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-1`, label: "Transparency Over Hierarchy", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-2`, label: "Collective Results Over Individual Achievement", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-3`, label: "Learning Velocity Over Error Avoidance", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-4`, label: "Decentralized Authority Over Central Control", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-5`, label: "Intrinsic Motivation Over Extrinsic Reward", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-6`, label: "Blameless Culture Over Blame Attribution", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-7`, label: "Trust-Based Accountability Over Surveillance", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-8`, label: "Systems Thinking Over Reductionism", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-9`, label: "Emerging Strategy Over Fixed Planning", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-10`, label: "Adaptive Response Over Rigid Adherence", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-11`, label: "Human-Centric Design Over Process-Centric", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-12`, label: "Continuous Learning Over Expert Gatekeeping", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-13`, label: "Vulnerability Over Invulnerability", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-14`, label: "Technical Excellence Over Speed Compromise", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-15`, label: "Sustainable Pace Over Heroic Effort", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-16`, label: "Feedback-Driven Iteration Over Big Bang", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-17`, label: "Diverse Perspective Over Homogeneous Thinking", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-18`, label: "Emergent Leadership Over Positional Authority", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-19`, label: "Antifragility Over Robustness", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-20`, label: "Meaningful Work Over Task Completion", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-21`, label: "Production Resilience Over Zero-Failure", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-22`, label: "Autonomy Within Alignment", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-23`, label: "Principled Risk-Taking Over Risk Aversion", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-24`, label: "Flow State Optimization", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-25`, label: "Organizational Learning Capability", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-26`, label: "Distributed Decision-Making Authority", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-27`, label: "Real-Time Feedback Integration", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-28`, label: "Skill Variety & Task Identity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-29`, label: "Mental Model Alignment", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-30`, label: "Healthy Conflict Over Avoidance", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-31`, label: "Commitment Through Dialogue", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-32`, label: "Results Focus With Humanity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-33`, label: "Technical Debt Visibility", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-34`, label: "Continuous Capability Evolution", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-35`, label: "Failure As Information Source", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-36`, label: "Cognitive Diversity Valuation", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-37`, label: "Organizational System Health", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-38`, label: "Shared Purpose Alignment", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-39`, label: "Experimentation Encouragement", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-40`, label: "Pattern Recognition Capability", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-41`, label: "Decentralized Problem-Solving", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-42`, label: "Authentic Leadership Behavior", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-43`, label: "Speed Over Perfection", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-44`, label: "Quality Over Speed", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-45`, label: "Simplicity Over Complexity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-46`, label: "Long-Term Thinking", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-47`, label: "Community", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-48`, label: "Equity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-49`, label: "Transparency In Metrics", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-50`, label: "Radical Candor", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-51`, label: "Respect", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-52`, label: "Moonshot Mentality Over Incrementalism", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-53`, label: "Algorithmic Transparency & Fairness", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-54`, label: "Value Stream Optimization Over Local Efficiency", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-55`, label: "Digital Sovereignty & Data Stewardship", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-56`, label: "Psychological Detachment & Recharging", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-57`, label: "Radical Honesty & Integrity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-58`, label: "Humility & Intellectual Curiosity", description: 'Core value statement', source: 'system', explanation: 'Suggested value' },
    { id: `val-59`, label: "Conflict Resolution Capability", description: 'Core value statement', source: 'system', explanation: 'Suggested value' }
];

// 5. PRINCIPLES (How we think and decide)
// See PRINCIPLE_LIBRARY at the end of file (derived from WIZARD_CONTENT)

// 6. BEHAVIORS (How we act visibly)
// See BEHAVIOR_LIBRARY at the end of file (derived from WIZARD_CONTENT)

// 7. GOALS (Milestones that prove progress)
export const GOAL_TEMPLATES = [
    "Deploy To Production Daily",
    "Achieve ≤⟨Time⟩ Change Lead Time",
    "Achieve ≤⟨Target%⟩ Change Failure Rate",
    "Enable Mean Time To Recovery ≤⟨Time⟩",
    "Establish ≥⟨Target%⟩ Ceremony Attendance",
    "Achieve ≥⟨Target%⟩ Psychological Safety Survey Score",
    "Reduce Team Impediments ≥⟨Target%⟩",
    "Enable ≥⟨Target%⟩ Organization Agile Adoption",
    "Reduce Change Resistance ≥⟨Target%⟩",
    "Build ≥⟨Count⟩ Internal Coaches",
    "Grow Community ≥⟨Target%⟩ YoY",
    "Achieve ≥⟨Target%⟩ Active Participation",
    "Demonstrate Knowledge Transfer ≥⟨Target%⟩",
    "Community Self-Sustaining",
    "Run ≥⟨Count⟩ Experiments Monthly",
    "Establish ≥⟨Count⟩ Knowledge Bus Factor Per Domain",
    "Cross-Team Collaboration Index ≥⟨Target Score⟩",
    "Achieve ≥⟨Target%⟩ ADR Adoption Rate",
    "Achieve ≥⟨Target%⟩ Sprint Commitment Accuracy",
    "Achieve ≥⟨Target%⟩ Deployment Success Rate",
    "Achieve ≥⟨Target%⟩ IaC Coverage",
    "Achieve ≥⟨Target%⟩ API-First Development",
    "Complete CI/CD Pipeline Deployment",
    "Achieve ≥⟨Target%⟩ Automated Test Coverage",
    "Achieve ≥⟨Target%⟩ Feature Flag Coverage",
    "Tech Standards Consistency",
    "Achieve ≥⟨Target%⟩ Cross-Functional Fluency",
    "Achieve ≥⟨Target%⟩ Learning Completion",
    "Establish Team Retention Rate ≥⟨Target%⟩",
    "Reduce Extraneous Cognitive Load ≥⟨Target%⟩",
    "Reduce Context Switching ≤⟨Count⟩ Per Day",
    "Reduce Technical Debt Interest ≤⟨Target%⟩",
    "Achieve ≥⟨Target%⟩ Of Development Time On Core Features",
    "Reduce Toil ≤⟨Target%⟩ Of SRE Time",
    "Achieve ≥⟨Target%⟩ Skill Variety Across Team",
    "Achieve Intrinsic Motivation Score ≥⟨Target Score⟩",
    "Reduce Burnout Indicators ≥⟨Target%⟩",
    "Achieve Mentoring Coverage ≥⟨Target%⟩",
    "Reduce Incident Mean Detection Time ≤⟨Time⟩",
    "Establish Flow State Duration Average ≥⟨Time⟩ Hours",
    "Achieve Code Review Turnaround ≤⟨Time⟩ Hours",
    "Reduce Production Incidents ≥⟨Target%⟩",
    "Establish Continuous Delivery Pipeline Uptime ≥⟨Target%⟩",
    "Reduce Technical Onboarding Time ≤⟨Time⟩ Weeks",
    "Establish Community Contribution Participation ≥⟨Target%⟩",
    "Establish ≥⟨Target%⟩ Team Topologies Alignment Score",
    "Reduce System Complexity Metrics ≥⟨Target%⟩",
    "Achieve ≥⟨Target%⟩ Platform Engineering Feature Adoption",
    "Establish Observability Adoption Rate ≥⟨Target%⟩",
    "Reduce Mean Time To Diagnosis ≤⟨Time⟩ Minutes",
    "Establish Experimentation Velocity ≥⟨Count⟩ A/B Tests Monthly",
    "Establish Shared Consciousness Across ≥⟨Target%⟩ Of Staff",
    "Establish Trust Score ≥⟨Target Score⟩",
    "Reduce Organizational Silos ≥⟨Target%⟩",
    "Achieve Tier 1 SLA Compliance ≥⟨Target%⟩",
    "Achieve AI Model Drift Reduction Below ⟨Target%⟩",
    "Reduce Time To Implement New Compliance Rule Below ⟨Time⟩",
    "Establish Measurable Cognitive Diversity Index Above ⟨Target Score⟩",
    "Reduce High-Severity Security Vulnerability Time-To-Fix Below ⟨Time⟩",
    "Achieve Platform Feature Adoption Rate Above ⟨Target%⟩"
];

export const getVisionArchetypes = (_keywords: string[]) => {
    // Simplified for now, just returning templates.
    // In a real app, this would filter based on keywords.
    return VISION_TEMPLATES.map((text, index) => ({
        id: `vision-${index}`,
        label: `Vision ${index + 1}`,
        description: text,
        text: text
    }));
};

// Value Library (v1.1)
// Unified Value Library (derived from VALUES_LIST)
export const VALUE_LIBRARY = VALUES_LIST.map(v => v.label);

// Unified Behavior Library (derived from WIZARD_CONTENT)
export const BEHAVIOR_LIBRARY = WIZARD_CONTENT.Behavior.Items;

// Unified Principle Library (derived from WIZARD_CONTENT)
export const PRINCIPLE_LIBRARY = WIZARD_CONTENT.Principle.Items.map(item => item.Principle);

// Legacy Templates (Mapped to new libraries for backward compatibility)
export const PRINCIPLE_TEMPLATES = PRINCIPLE_LIBRARY;
export const BEHAVIOR_TEMPLATES = BEHAVIOR_LIBRARY;

// Roles Library (v1.1)
export const ROLES_LIBRARY = [
    "Product Owner", "Scrum Master", "Engineer", "Lead Engineer", "Architect", "UX Designer", "AI Specialist", "Data Scientist",
    "QA Engineer", "Tech Lead", "Team Lead", "Manager", "Director", "VP Engineering", "CTO", "Agile Coach", "Business Analyst",
    "Product Manager", "Release Manager", "Operations Manager", "Innovation Lead", "Community Manager", "Service Designer",
    "Change Manager", "Portfolio Manager", "R&D Lead", "Solution Architect", "DevOps Engineer", "Security Engineer", "System Analyst",
    "Project Manager", "UX Researcher", "Customer Success Manager", "Learning & Development Specialist", "Stakeholder", "Mentor", "Coach",
    "Advisor", "Lead Developer", "Senior Developer", "Junior Developer", "Intern", "Designer", "Strategist", "Facilitator", "Trainer",
    "Program Manager", "Innovation Catalyst", "Chief Product Owner", "Data Engineer", "Research Scientist", "Leadership Team"
];

// Consistency Check
export function checkConsistency(values: Value[], behaviors: Behavior[]) {
    const missingBehaviors = values.filter(v =>
        !behaviors.some(b => b.derivedFromValues.includes(v.id))
    );

    const coveragePct = values.length > 0
        ? Math.round(((values.length - missingBehaviors.length) / values.length) * 100)
        : 0;

    // Mock conflict detection
    const conflicts: string[] = [];
    if (values.some(v => v.label === 'Speed') && values.some(v => v.label === 'Safety')) {
        conflicts.push("Potential tension between 'Speed' and 'Safety'. Ensure behaviors clarify trade-offs.");
    }
    if (values.some(v => v.label === 'Innovation') && values.some(v => v.label === 'Reliability')) {
        conflicts.push("Potential tension between 'Innovation' and 'Reliability'. Define failure boundaries.");
    }

    return {
        coveragePct,
        missingBehaviors,
        conflicts,
        ok: coveragePct === 100 && conflicts.length === 0
    };
}
