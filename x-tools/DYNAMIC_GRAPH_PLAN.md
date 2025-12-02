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
- [ ] Add `explanation` field to all `Principle` objects in:
  - `src/core/exampleTeam.ts`
  - `src/test/*.test.ts` files
- [ ] Update `ontology.ts` and `visualizer.ts` to use `derivedFromValues`

## Phase 2: Real-Time Graph Updates
- [ ] Create state management for entity metadata
- [ ] Add useEffect hooks in wizard steps to:
  - Generate unique IDs on text input
  - Show/hide nodes based on text presence
  - Create/remove edges dynamically
- [ ] Debounce text input (300ms) before updating graph

## Phase 3: AI Metadata Generation
- [ ] Create `generateMetadata` function in `src/core/ai.ts`:
  ```typescript
  export async function generateMetadata(
    entityType: string,
    content: string
  ): Promise<{ description: string; tags: string[] }>
  ```
- [ ] Call AI to extract:
  - Description: Concise explanation of the entity
  - Tags: 3-5 semantic keywords
- [ ] Auto-trigger on blur or debounced input

## Phase 4: Integrate Metadata Editor into Wizard Steps
Update each wizard step component:

### Step 1: Purpose (`Step1_Purpose.tsx`)
```typescript
const [metadata, setMetadata] = useState({
  id: state.team?.teamPurpose ? 'purpose-1' : undefined,
  description: '',
  tags: []
});

const handleMetadataUpdate = (meta) => {
  setMetadata(meta);
  dispatch({ type: 'UPDATE_PURPOSE_METADATA', payload: meta });
};

// In JSX:
<MetadataEditor
  {...metadata}
  onUpdate={handleMetadataUpdate}
  onGenerateWithAI={async () => {
    const generated = await AI.generateMetadata('purpose', purposeText);
    handleMetadataUpdate({ ...metadata, ...generated });
  }}
/>
```

### Step 2: Vision (`Step2_Vision.tsx`)
- Same pattern as Purpose
- ID: `vision-1`
- Generate edge: `purpose-1` → `vision-1`

### Steps 3-8: Mission, Strategy, Values, Principles, Behaviors, Goals
- Apply same pattern to all steps

## Phase 5: Persistent Graph Panel
Create `src/components/GraphPanel.tsx`:
```typescript
export function GraphPanel({ isOpen, onClose }: GraphPanelProps) {
  return (
    <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2>Full Organization Graph</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="flex-1">
          <InteractiveGraph />
        </div>
      </div>
    </div>
  );
}
```

## Phase 6: Dynamic Node/Edge Management
Update `src/components/graph/InteractiveGraph.tsx`:

```typescript
// Real-time node creation based on wizard state
useEffect(() => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Purpose node
  if (state.team?.teamPurpose) {
    nodes.push({
      id: 'purpose-1',
      data: {
        label: state.team.teamPurpose.substring(0, 50) + '...',
        description: state.team.purposeMetadata?.description,
        tags: state.team.purposeMetadata?.tags
      },
      position: { x: 250, y: 50 },
      style: { background: '#FFA500' }
    });
  }
  
  // Vision node + edge
  if (state.vision?.text) {
    nodes.push({
      id: 'vision-1',
      data: {
        label: state.vision.text.substring(0, 50) + '...',
        description: state.vision.description,
        tags: state.vision.tags
      },
      position: { x: 250, y: 150 },
      style: { background: '#8A2BE2' }
    });
    
    // Add edge if purpose exists
    if (state.team?.teamPurpose) {
      edges.push({
        id: 'e-purpose-vision',
        source: 'purpose-1',
        target: 'vision-1',
        label: 'leads to',
        animated: true
      });
    }
  }
  
  // Continue for Mission, Strategy, Values, etc.
  
  setNodes(nodes);
  setEdges(edges);
}, [state]);
```

## Phase 7: Store Updates
Add metadata actions to `src/core/store.ts`:

```typescript
type Action =
  | { type: 'UPDATE_PURPOSE_METADATA'; payload: Metadata }
  | { type: 'UPDATE_VISION_METADATA'; payload: Metadata }
  | { type: 'UPDATE_MISSION_METADATA'; payload: Metadata }
  // ... etc

// In reducer:
case 'UPDATE_VISION_METADATA':
  return {
    ...state,
    vision: {
      ...state.vision,
      id: action.payload.id,
      description: action.payload.description,
      tags: action.payload.tags
    }
  };
```

## Testing Checklist
- [ ] Typing in Purpose shows Purpose node
- [ ] Clearing Purpose text removes Purpose node
- [ ] Typing in Vision shows Vision node + edge from Purpose
- [ ] Metadata can be edited and persists
- [ ] AI metadata generation works
- [ ] Graph panel can be toggled
- [ ] Real-time updates work across all steps
- [ ] Saved teams restore metadata correctly

## File Checklist
### To Create:
- [ ] `src/components/GraphPanel.tsx`
- [ ] `src/hooks/useMetadata.ts`

### To Modify:
- [ ] All wizard step components (add MetadataEditor)
- [ ] `src/core/store.ts` (add metadata actions)
- [ ] `src/core/ai.ts` (add generateMetadata function)
- [ ] `src/components/graph/InteractiveGraph.tsx` (dynamic updates)
- [ ] `src/App.tsx` or main layout (add GraphPanel toggle)
