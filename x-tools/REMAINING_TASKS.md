# Remaining Tasks & Enhancements

## 🎯 Status Overview

✅ **Critical Build Errors:** FIXED  
✅ **Supabase UUID Issues:** FIXED  
⏳ **Optional Enhancements:** Listed below

---

## 📋 Incomplete Features

### 1. **Step 7: Goals Metadata Support** (Medium Priority)
**Status:** ✅ Completed
**Complexity:** Medium

**Description:**
Goals are currently stored as `string[]` instead of objects with IDs, preventing metadata editing.

**Required Changes:**
- Refactor `goals` from `string[]` to `Goal[]` objects
- Update `Goal` interface to match other entities:
  ```typescript
  interface Goal {
      id: string;
      text: string;
      description?: string;
      tags?: string[];
      strategyId?: string;
  }
  ```
- Update all goal-related components
- Migrate existing data

**Files to Modify:**
- `src/core/types.ts` - Update WizardState.goals type
- `src/components/wizard/Step7_Goals.tsx` - Add MetadataEditor
- `src/core/exampleTeam.ts` - Convert goal arrays to objects
- Migration script for existing data

**Impact:** Would enable full metadata editing for goals, completing the dynamic graph feature set.

---

### 2. **Persist Graph Edits to Store** (High Priority)
**Status:** ✅ Completed
**Complexity:** High

**Description:**
Graph edits (node label changes, edge creation/deletion) currently only update the visual representation. Changes are lost on page refresh.

**Current State:**
- ✅ Edit mode UI implemented
- ✅ Node editing modal works
- ✅ Edge creation/deletion works visually
- ❌ Changes don't persist to store
- ❌ Changes don't save to database

**Required Changes:**
1. Map graph node changes back to wizard state entities
2. Create store actions for graph-driven updates
3. Update SupabaseAdapter to handle graph state
4. Add conflict resolution for simultaneous edits

**TODOs in Code:**
- `InteractiveGraph.tsx:93` - Implement persistence for custom edges
- `InteractiveGraph.tsx:113` - Implement persistence for edge deletion
- `InteractiveGraph.tsx:139` - Update actual state in store based on entityType

**Files to Modify:**
- `src/components/graph/InteractiveGraph.tsx`
- `src/core/store.ts` - Add graph update actions
- `src/core/storage/SupabaseAdapter.ts` - Persist graph layout

---

### 3. **Saved Teams Metadata Restoration** (High Priority)
**Status:** ✅ Completed
**Complexity:** Low

**Description:**
Verify that metadata (descriptions, tags, IDs) persists correctly when saving and loading teams.

**Testing Checklist:**
- [ ] Create a team with metadata in all steps
- [ ] Save the team to Supabase
- [ ] Reload the page
- [ ] Load the saved team
- [ ] Verify all metadata fields are restored
- [ ] Check graph visualization reflects saved state

**Expected Behavior:**
All metadata should be stored in the `state` JSONB column and restored on load.

**Potential Issues:**
- Metadata might not be included in serialization
- Graph layout might not persist
- Custom edges might be lost

---

## ⚠️ Code TODOs

### 4. **Error Tracking Service Integration** (Low Priority)
**Location:** `src/components/ErrorBoundary.tsx:35`

```typescript
// TODO: Send to error tracking service (Sentry, LogRocket, etc.)
```

**Description:**
Add integration with error tracking service for production monitoring.

**Recommended Services:**
- Sentry (most popular)
- LogRocket (session replay)
- Rollbar
- Bugsnag

**Implementation:**
```typescript
import * as Sentry from "@sentry/react";

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
        contexts: {
            react: {
                componentStack: errorInfo.componentStack,
            },
        },
    });
}
```

---

### 5. **Test Implementation Completion** (Low Priority)
**Location:** `src/components/wizard/Step1_Purpose.test.tsx:53`

```typescript
// TODO: Simulate external state change via dispatch
```

**Description:**
Complete the test for external state synchronization.

**Implementation:**
```typescript
it('should sync local state when global state changes externally', async () => {
    const { container } = renderWithProvider(<Step1_Purpose />);
    const { dispatch } = useWizard(); // Need to expose dispatch
    
    const input = screen.getByPlaceholderText(/purpose/i);
    expect(input).toHaveValue('');
    
    // Simulate external update
    act(() => {
        dispatch({
            type: 'SET_TEAM',
            payload: {
                ...initialTeam,
                teamPurpose: 'External Update'
            }
        });
    });
    
    await waitFor(() => {
        expect(input).toHaveValue('External Update');
    });
});
```

---

## 📚 Documentation

### 6. **Update README.md** (Medium Priority)
**Status:** Still contains default Vite template  
**Complexity:** Low

**Current State:**
README.md has generic Vite + React template content.

**Should Include:**
1. **Project Overview**
   - What is x-tools?
   - Key features
   - Use cases

2. **Setup Instructions**
   - Prerequisites (Node.js version)
   - Installation steps
   - Environment variables setup
   - Supabase configuration

3. **Development**
   - Running locally
   - Running tests
   - Building for production

4. **Architecture**
   - Tech stack
   - Folder structure
   - Key components

5. **Features**
   - Wizard workflow
   - AI metadata generation
   - Dynamic graph visualization
   - Supabase persistence

6. **Deployment**
   - GitHub Actions workflow
   - Environment secrets
   - Production considerations

---

## 🚀 Deployment Considerations

### 7. **Verify GitHub Secrets** (High Priority)
**Status:** Needs Verification  
**Complexity:** Low

**Required Secrets:**
Verify these are set in GitHub repository settings:

```bash
VITE_GROQ_API_KEY=<your-groq-api-key>
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

**How to Verify:**
1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Check all three secrets exist
4. Trigger a deployment to test

**Related File:**
- `.github/workflows/deploy.yml`

---

## 🎨 Future Enhancements

### 8. **Performance Optimizations** (Low Priority)

**Bundle Size:**
Current: 3MB (955KB gzipped)

**Recommendations:**
1. **Code Splitting:**
   ```typescript
   const GraphPanel = lazy(() => import('./components/GraphPanel'));
   const MetadataEditor = lazy(() => import('./components/MetadataEditor'));
   ```

2. **Manual Chunks:**
   ```javascript
   // vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom'],
           'graph-vendor': ['reactflow'],
           'ai-vendor': ['@xenova/transformers']
         }
       }
     }
   }
   ```

3. **Tree Shaking:**
   - Review unused dependencies
   - Use named imports instead of default imports

---

### 9. **Additional Features** (Optional)

From `IMPLEMENTATION_SUMMARY.md`:

1. **Batch AI Generation**
   - Generate metadata for all entities at once
   - Progress indicator
   - Parallel processing

2. **Graph Export**
   - Export as PNG/SVG
   - Export as JSON
   - Share via URL

3. **Graph Templates**
   - Pre-defined layouts for different team types
   - Industry-specific templates
   - Best practice patterns

4. **Collaborative Editing**
   - Real-time multi-user editing
   - Conflict resolution
   - Change notifications
   - Presence indicators

5. **Version History**
   - Track changes over time
   - Diff visualization
   - Rollback capability
   - Audit trail

---

## 📊 Priority Matrix

| Task | Priority | Complexity | Impact | Status |
|------|----------|------------|--------|--------|
| Graph Edit Persistence | High | High | High | ✅ Completed |
| Metadata Restoration Testing | High | Low | High | ✅ Completed |
| GitHub Secrets Verification | High | Low | High | ⏳ Pending |
| Goals Metadata Support | Medium | Medium | Medium | ✅ Completed |
| README Update | Medium | Low | Medium | ✅ Completed |
| Error Tracking | Low | Low | Low | ❌ Not Started |
| Test Completion | Low | Low | Low | ❌ Not Started |
| Performance Optimization | Low | Medium | Low | ❌ Not Started |

---

## 🎯 Recommended Next Steps

1. **Immediate (This Week):**
   - ✅ Fix build errors (DONE)
   - ✅ Fix UUID issues (DONE)
   - ✅ Test metadata restoration (DONE)
   - ⏳ Verify GitHub secrets

2. **Short Term (Next Sprint):**
   - Add error tracking

3. **Medium Term (Next Month):**
   - Performance optimizations
   - Performance optimizations
   - Complete test coverage

4. **Long Term (Future):**
   - Collaborative editing
   - Version history
   - Graph templates

---

**Last Updated:** 2025-12-05  
**Next Review:** After metadata testing
