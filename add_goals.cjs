const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'SideNotes.json');
const goalsData = {
    "Goals": {
        "Formula": "[Objective: qualitative goal] [Key Results: 3–5 quantitative, time-bound measures]",
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

try {
    const rawData = fs.readFileSync(JSON_FILE, 'utf8');
    const data = JSON.parse(rawData);

    // Check if Goals already exists, if so update it, else push it
    const existingIndex = data.findIndex(item => item.Goals);
    if (existingIndex !== -1) {
        data[existingIndex] = goalsData;
    } else {
        data.push(goalsData);
    }

    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
    console.log('Successfully updated SideNotes.json with Goals.');
} catch (e) {
    console.error('Error updating JSON:', e.message);
    process.exit(1);
}
