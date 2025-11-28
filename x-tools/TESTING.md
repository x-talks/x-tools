# Team Up - Test Suite

## Overview
This project includes comprehensive automated tests to ensure code quality and prevent regressions.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Unit Tests

#### Storage Tests (`src/test/storage.test.ts`)
- ✅ Validation of team completeness
- ✅ Saving complete and incomplete teams
- ✅ Loading teams from storage
- ✅ Deleting teams
- ✅ Goals validation

#### Reducer Tests (`src/test/reducer.test.ts`)
- ✅ SET_GOALS action
- ✅ LOAD_STATE action
- ✅ GO_TO_STEP navigation
- ✅ NEXT_STEP/PREV_STEP navigation
- ✅ RESET action

### Integration Tests (`src/test/integration.test.tsx`)
- ✅ Goals persistence across save/load
- ✅ Save validation prevents incomplete teams
- ✅ Multiple teams can be created and saved

## Critical Functionality Tested

1. **Goals Management**
   - Goals are saved correctly
   - Goals persist when loading teams
   - Goals validation works

2. **Team Validation**
   - Incomplete teams cannot be saved
   - Complete teams save successfully
   - All required fields are validated

3. **Multi-Team Support**
   - Multiple teams can be created
   - Each team maintains separate data
   - Teams can be loaded independently

4. **State Management**
   - Reducer handles all actions correctly
   - Navigation works properly
   - State resets cleanly

## Test Philosophy

- **Prevent Regressions**: Every bug fix gets a test
- **Fast Feedback**: Tests run in < 1 second
- **Comprehensive**: Cover critical user flows
- **Maintainable**: Clear, focused tests

## Adding New Tests

When adding features or fixing bugs:

1. Write a failing test first
2. Implement the fix
3. Verify the test passes
4. Run full test suite: `npm test`

## Continuous Integration

All tests must pass before merging code. Run `npm test` before committing changes.
