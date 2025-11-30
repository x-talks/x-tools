# Quick Setup Guide for Supabase Storage

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Create a new project or select an existing one
3. Go to **Project Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 2: Create the Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

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

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Enable all access for all users" ON teams
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

4. Click **Run** to execute the SQL

### Step 3: Configure Your App

1. In this directory (`/Users/D069379/AntiGravity/x-tools/`), create a file named `.env`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Restart Your Dev Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## ✅ Verify It's Working

1. Open your browser console (F12)
2. You should see: `"Using Supabase storage adapter"`
3. Create and save a Circle
4. Check Supabase Dashboard → **Table Editor** → **teams** table
5. Your Circle data should appear there!

## 🌐 Cross-Browser/Device Access

Once Supabase is configured:
- ✅ Save on Chrome, load on Firefox
- ✅ Save on laptop, load on phone
- ✅ Share Circles with team members (with proper auth setup)

## 🔒 Security Note

The current setup allows anyone to read/write. For production, you should:
1. Enable Supabase Authentication
2. Update RLS policies to restrict access
3. See `SUPABASE_SETUP.md` for security examples

## 📝 Important Files

- `.env` - Your credentials (DO NOT commit to git - already in .gitignore)
- `.env.example` - Template for others
- `SUPABASE_SETUP.md` - Detailed technical documentation

## 🆘 Troubleshooting

**Still seeing LocalStorage?**
- Check console for "Using Supabase storage adapter" message
- Verify `.env` file is in `/Users/D069379/AntiGravity/x-tools/`
- Restart dev server after creating `.env`

**Can't save Circles?**
- Check Supabase Dashboard → SQL Editor for errors
- Verify the `teams` table was created
- Check browser console for error messages
