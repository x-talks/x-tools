# Supabase Integration Setup

## Overview
The application now supports Supabase as a storage backend. It will automatically use Supabase if the environment variables are configured, otherwise it falls back to LocalStorage.

## Setup Instructions

### 1. Create the Database Table

Go to your Supabase Dashboard → SQL Editor and run the following SQL:

```sql
-- Create teams table for Circle Up application
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on updated_at for faster sorting
CREATE INDEX IF NOT EXISTS teams_updated_at_idx ON teams(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Enable all access for all users" ON teams
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE teams IS 'Stores team/circle data for the Circle Up application';
```

### 2. Environment Variables

The `.env` file has been created with your Supabase credentials:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### 3. Restart the Dev Server

After creating the table, restart your dev server to apply the changes:

```bash
npm run dev
```

## How It Works

### Storage Adapter Pattern

The application uses an adapter pattern for storage:

- **LocalStorageAdapter**: Stores data in browser localStorage (default fallback)
- **SupabaseAdapter**: Stores data in Supabase database (used when env vars are set)

### Automatic Selection

The storage adapter is automatically selected based on environment variables:

```typescript
// In src/core/storage.ts
function createAdapter(): StorageAdapter {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
        return new SupabaseAdapter(supabaseUrl, supabaseKey);
    } else {
        return new LocalStorageAdapter();
    }
}
```

### Testing

Tests are configured to always use LocalStorage to avoid dependencies on external services:

```typescript
// In src/test/setup.ts
beforeEach(() => {
    localStorage.clear();
    setAdapter(new LocalStorageAdapter());
});
```

## Database Schema

### teams table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Primary key, UUID of the team |
| `name` | TEXT | Team/Circle name |
| `updated_at` | TIMESTAMP | Last update timestamp |
| `state` | JSONB | Complete wizard state (all team data) |
| `created_at` | TIMESTAMP | Creation timestamp |

## Security

The current RLS policy allows all operations for all users. You should update this based on your authentication requirements:

```sql
-- Example: Restrict to authenticated users only
DROP POLICY "Enable all access for all users" ON teams;

CREATE POLICY "Authenticated users can manage their teams" ON teams
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
```

## Switching Between Storage Backends

### Use Supabase
Ensure `.env` file has the credentials (already done)

### Use LocalStorage
Remove or comment out the environment variables in `.env`:
```
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

## Next Steps

1. Run the SQL migration in Supabase SQL Editor
2. Restart the dev server
3. Test creating and saving a Circle
4. Verify data appears in Supabase Dashboard → Table Editor → teams

The application will automatically sync all Circle data to Supabase!
