-- Create circle table for Circle Up application
CREATE TABLE IF NOT EXISTS circle (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on updated_at for faster sorting
CREATE INDEX IF NOT EXISTS circle_updated_at_idx ON circle(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE circle ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Enable all access for all users" ON circle
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE circle IS 'Stores circle data for the Circle Up application';
