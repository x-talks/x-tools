# 🤖 AI & Ontology Implementation Guide

## Overview

This implementation adds **state-of-the-art AI and ontology features** using **100% free/open-source** models.

---

## 🏗️ Architecture

### 3-Tier AI System

```
Tier 1: Groq API (Free Tier)
├── ✅ Fastest (sub-second responses)
├── ✅ Most accurate (Llama 3.1 8B)
├── ⚠️ Requires API key (free tier: 14,400 requests/day)
└── Use for: Suggestions, improvements, analysis

Tier 2: Transformers.js (Browser ML)
├── ✅ 100% free, no API needed
├── ✅ Runs in browser via WebGPU
├── ⚠️ Slower (5-10 seconds)
└── Use for: Classification, embeddings

Tier 3: Rule-Based (Fallback)
├── ✅ Always available
├── ✅ Instant
├── ⚠️ Less intelligent
└── Use for: Basic analysis, patterns
```

---

## 🎯 Implemented Features

### 1. **Semantic Relationship Visualization** 🔗

**What**: Interactive graph showing how values cascade into principles and behaviors

**How it works**:
- Builds ontology graph from wizard state
- Shows 4 layers: Identity → Culture → Behavior → Execution
- Color-coded nodes by layer
- Relationship lines showing derivation
- Click node → Highlight connections

**Data Model**:
```typescript
interface OntologyGraph {
  nodes: OntologyNode[];        // Purpose, Values, Principles, etc.
  relationships: SemanticRelationship[];  // Derives from, Implements
  conflicts: ConflictDetection[];         // Detected tensions
}
```

**UI**: Enhanced graph view with:
- Force-directed layout
- Zoom/pan controls
- Node click → Show details
- Filter by layer
- Export as PNG/SVG

---

### 3. **Conflict Detection** ⚠️

**What**: Automatically detects contradictions and tensions in team values/principles

**How it works**:
1. **Semantic Tagging**: Tag each item with concepts (Speed, Quality, Innovation, etc.)
2. **Conflict Pairs**: Check for opposing concepts
3. **Severity Classification**:
   - **Healthy Tension**: Expected, good to discuss
   - **Potential Conflict**: Warrants attention
   - **Critical Conflict**: Serious contradiction

**Example**:
```
Value 1: "Move fast and break things"
  → Tags: [SPEED: 0.8, INNOVATION: 0.6]

Value 2: "Deliver perfect quality every time"
  → Tags: [QUALITY: 0.9, STABILITY: 0.7]

⚠️ POTENTIAL CONFLICT: Speed vs Quality
Explanation: These create tension. Clarify when speed takes priority vs quality.
```

**AI Enhancement**:
- Groq API: Suggests resolution strategies
- Rule-based: Pre-defined conflict pairs

---

### 6. **Drag & Drop Reordering** 🎯

**What**: Reorder values, principles, behaviors by dragging

**How it works**:
- React DnD library (@dnd-kit)
- Visual drop zones
- Smooth animations
- Save order to state

**UI Features**:
- Grab handle icon
- Drop indicator line
- Snap-to-position
- Undo/redo support

---

### 9. **Semantic Tagging** 🏷️

**What**: Auto-tag items with semantic concepts

**How it works**:
1. **Keyword Matching** (Rule-based):
   - 12 concept categories
   - 5-7 keywords per concept
   - Confidence scoring

2. **AI Classification** (Transformers.js):
   - Zero-shot classification
   - 12 predefined labels
   - Runs in browser

3. **Groq Enhancement** (Optional):
   - More nuanced tags
   - Custom concepts
   - Contextual understanding

**Concepts**:
- Speed vs Quality
- Innovation vs Stability
- Autonomy vs Control
- Collaboration vs Individual
- Customer vs Business
- Transparency vs Privacy

**Display**:
- Tag cloud on each item
- Color-coded by concept
- Filter by tag
- Tag-based search

---

## 🧠 Ontology Data Model

### Layers

```
Identity Layer
├── Purpose (Why we exist)
├── Vision (Where we're going)
└── Mission (What we do)

Culture Layer
├── Values (What we believe)
└── Principles (How we operate)

Behavior Layer
└── Behaviors (What we do daily)

Execution Layer
├── Goals (What we achieve)
└── Roles (Who does what)
```

### Relationships

```
Value "Customer Obsession"
  └─derives_from→ Purpose
  ├─implements→ Principle "Always validate with users"
  │  └─implements→ Behavior "Weekly user interviews"
  └─supports→ Goal "90% customer satisfaction"
```

---

## 🤖 AI Capabilities

### Groq API (Free Tier)

**Get free API key**: https://console.groq.com

**Free tier limits**:
- 14,400 requests/day
- ~30 requests/minute
- Llama 3.1 8B Instant model

**What it powers**:
1. **Smart Suggestions**:
   - `suggestPrinciples(values)` → Generate principles from values
   - `suggestBehaviors(principle, values)` → Generate behaviors
   
2. **Text Improvement**:
   - `improveMission(mission, purpose)` → Make mission more specific
   - `analyzeText(text)` → Sentiment, complexity, specificity scores

3. **Conflict Resolution**:
   - Suggest how to resolve detected conflicts

**Example**:
```typescript
import AI from './core/ai';

// Configure once
AI.configure('your-groq-api-key');

// Use anywhere
const principles = await AI.suggestPrinciples([
  'Customer Obsession',
  'Bold Experimentation',
  'Data-Driven Decisions'
]);

// Returns: [
//   "Always validate assumptions with real users before building",
//   "Fail fast, learn faster - every experiment teaches",
//   "Let data guide decisions, but use intuition to ask questions"
// ]
```

---

### Transformers.js (Browser ML)

**Installation**:
```bash
npm install @xenova/transformers
```

**What it powers**:
- Zero-shot text classification
- Semantic similarity
- Named entity recognition (future)

**Example**:
```typescript
import AI from './core/ai';

// Classify text into our concepts
const tags = await AI.classifyTextLocal("We move fast and iterate quickly");

// Returns: [
//   { concept: 'SPEED', confidence: 0.85, keywords: ['speed and agility'] },
//   { concept: 'INNOVATION', confidence: 0.62, keywords: ['innovation'] }
// ]
```

**Performance**:
- First load: ~2-3 seconds (model download)
- Subsequent: ~1-2 seconds per classification
- Runs on GPU if available (WebGPU)

---

### Rule-Based (Always Available)

**What it powers**:
- Keyword-based semantic tagging
- Basic conflict detection
- Template-based suggestions

**Example**:
```typescript
import { extractSemanticTags } from './core/ontology';

const tags = extractSemanticTags("We prioritize speed and agility");

// Returns: [
//   { concept: 'SPEED', confidence: 0.66, keywords: ['speed', 'agile'] }
// ]
```

---

## 📊 Team Health Dashboard

**Metrics**:

1. **Alignment Score** (0-100):
   - Weighted: 40% completeness + 30% connections + 30% conflict resolution

2. **Completeness** (0-100):
   - % of required fields filled

3. **Connection Density** (0-100):
   - How well values cascade into behaviors

4. **Conflict Score** (0-100):
   - Lower is better (conflicts detected)

**Insights**:
- "Add 2 more behaviors to improve connection density"
- "Resolve 1 critical conflict"
- "Great! Your team is 92% aligned"

---

## 🚀 Usage Guide

### 1. Configure Groq (Optional, Recommended)

```typescript
// In app initialization or settings page
import AI from './core/ai';

AI.configure('gsk_...'); // Your free Groq API key
```

### 2. Use AI Suggestions

```typescript
// In wizard steps
const suggestions = await AI.suggestPrinciples(state.values.map(v => v.label));

// Show suggestions to user
suggestions.forEach(s => {
  // Add as clickable suggestion
});
```

### 3. Show Conflict Warnings

```typescript
import { buildOntologyGraph } from './core/ontology';

const graph = buildOntologyGraph(state);

if (graph.conflicts.length > 0) {
  // Show warning banner
  graph.conflicts.forEach(conflict => {
    console.log(conflict.explanation);
  });
}
```

### 4. Display Health Score

```typescript
import { calculateTeamHealth, buildOntologyGraph } from './core/ontology';

const graph = buildOntologyGraph(state);
const health = calculateTeamHealth(state, graph);

// health.alignmentScore → 0-100
// health.insights → ["Add more behaviors", ...]
```

---

## 🎨 UI Components to Create

### 1. AI Settings Modal
- Input for Groq API key
- Test connection button
- Usage stats (requests remaining)

### 2. Conflict Warning Banner
- Shows on any wizard step
- Lists conflicts with severity
- "Resolve" button → Jump to items

### 3. Health Dashboard Widget
- Circular progress indicators
- Insight cards
- Trends over time (future)

### 4. Semantic Tag Pills
- Display under each value/principle
- Color-coded by concept
- Clickable to filter

### 5. Enhanced Graph View
- Layer toggle buttons
- Conflict highlighting (red edges)
- Orphan node detection (gray)
- Export buttons

---

## 📦 Dependencies to Install

```bash
cd x-tools
npm install @xenova/transformers @dnd-kit/core @dnd-kit/sortable
```

---

## 🔮 Future Enhancements

Once base is working:

1. **Custom Ontology**:
   - Let users define their own concepts
   - Industry-specific templates

2. **Historical Analysis**:
   - Track changes over time
   - "Your team shifted from Speed to Quality"

3. **Benchmark Comparison**:
   - Compare to industry standards
   - "80% similar to high-performing tech teams"

4. **Multi-Team Analysis**:
   - Organization-wide insights
   - Cross-team alignment

5. **Fine-Tuned Models**:
   - Train on user data (privacy-preserving)
   - Better suggestions over time

---

## ✅ Quality Checklist

Before deployment:

- [ ] Ontology graph builds correctly
- [ ] Conflicts detected accurately
- [ ] Groq API integration works
- [ ] Transformers.js loads in browser
- [ ] Fallbacks work without AI
- [ ] Drag & drop smooth on mobile
- [ ] Semantic tags displayed
- [ ] Health score calculated
- [ ] Performance acceptable (<3s)
- [ ] No memory leaks

---

## 🎯 Success Metrics

**User Impact**:
- 30% faster team creation (AI suggestions)
- 50% fewer contradictory values (conflict detection)
- 80% feel more confident in output (health score)

**Technical**:
- <2s AI response time (Groq)
- <5% fallback usage (Groq reliability)
- 100% offline capability (browser ML backup)

---

**This is your competitive moat!** 🚀

No other team alignment tool has:
- Free AI-powered suggestions
- Automatic conflict detection
- Semantic ontology graph
- Real-time health scoring

All powered by state-of-the-art open-source models.
