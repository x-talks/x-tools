# Dynamic Graph Implementation Plan

## Current Status (Partial Implementation)

### ✅ Completed:
1. **Type System Updates** (`src/core/types.ts`):
   - Added `id`, `description`, and `tags` fields to:
     - `Vision`
     - `Mission`
     - `Strategy`
     - `Value`
     - `Principle`
     - `Behavior`
   - Changed `derivedFrom` → `derivedFromValues` for consistency

2. **MetadataEditor Component** (`src/components/MetadataEditor.tsx`):
   - Expandable section within wizard steps
   - Editable description field
   - Tag management (add/remove)
   - AI generation button with loading state
   - Read-only ID display

3. **React Flow Migration**:
   - Switched from vis-network to React Flow MIT
   - Auto-layout by entity type
   - Color-coded nodes
   - Animated edges

### 🚧 Remaining Work:

## Phase 1: Fix Build Errors
- [x] Add `explanation` field to all `Principle` objects in:
  - `src/core/exampleTeam.ts`
  - `src/test/*.test.ts` files
- [x] Update `ontology.ts` and `visualizer.ts` to use `derivedFromValues`

## Phase 2: Real-Time Graph Updates
- [x] Create state management for entity metadata
- [x] Add useEffect hooks in wizard steps to:
  - [x] Generate unique IDs on text input
  - [x] Show/hide nodes based on text presence
  - [x] Create/remove edges dynamically
- [x] Debounce text input (300ms) before updating graph

## Phase 3: AI Metadata Generation
- [x] Create `generateMetadata` function in `src/core/ai.ts`
- [x] Call AI to extract:
  - [x] Description: Concise explanation of the entity
  - [x] Tags: 3-5 semantic keywords
- [x] Integrated into all wizard steps with real AI calls

## Phase 4: Integrate Metadata Editor into Wizard Steps
- [x] Step 1: Purpose (`Step1_Purpose.tsx`)
- [x] Step 2: Vision (`Step2_Vision.tsx`)
- [x] Step 3: Mission (`Step3_Mission.tsx`)
- [x] Step 4: Strategy (`Step4_Strategy.tsx`)
- [x] Step 4: Values (`Step4_Values.tsx`)
- [x] Step 5: Principles (`Step5_Principles.tsx`)
- [x] Step 6: Behaviors (`Step6_Behaviors.tsx`)
- [ ] Step 7: Goals (Skipped for now)

## Phase 5: Persistent Graph Panel
- [x] Created `src/components/GraphPanel.tsx`
- [x] Added toggle button in main app header
- [x] Slide-out panel with full graph visualization
- [x] Legend for node types

## Phase 6: Dynamic Node/Edge Management
- [x] Update `src/components/graph/InteractiveGraph.tsx` to use `ontology.ts` for dynamic updates
- [x] Ensure nodes/edges reflect metadata changes

## Phase 7: Store Updates
- [x] Update existing store actions to include metadata fields (Completed via SET_VISION, etc.)

## Phase 8: Editable Graph (NEW)
- [x] Add edit mode toggle to graph
- [x] Click nodes to edit label, description, and tags
- [x] Click edges to delete connections
- [x] Drag between nodes to create new connections
- [x] Visual indicators for edit mode
- [x] Modal editor for node properties

## Testing Checklist
- [x] Typing in Purpose shows Purpose node
- [x] Clearing Purpose text removes Purpose node
- [x] Typing in Vision shows Vision node + edge from Purpose
- [x] Metadata can be edited and persists
- [x] AI metadata generation works
- [x] Graph panel can be toggled
- [x] Real-time updates work across all steps
- [x] Edit mode allows manual graph editing
- [ ] Saved teams restore metadata correctly (needs testing)

## File Checklist
### To Create:
- [ ] `src/components/GraphPanel.tsx`
- [ ] `src/hooks/useMetadata.ts`

### To Modify:
- [x] All wizard step components (add MetadataEditor)
- [x] `src/core/store.ts` (handled via existing actions)
- [ ] `src/core/ai.ts` (add generateMetadata function)
- [x] `src/components/graph/InteractiveGraph.tsx` (dynamic updates)
- [ ] `src/App.tsx` or main layout (add GraphPanel toggle)
