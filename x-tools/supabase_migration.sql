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
