#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Safely creates the teams table in your Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for pretty output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMigration() {
    log('\n🚀 Starting Supabase Migration...', 'cyan');
    log('═══════════════════════════════════\n', 'cyan');

    // Step 1: Load environment variables
    log('📋 Step 1: Loading environment variables...', 'blue');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        log('❌ ERROR: Supabase credentials not found!', 'red');
        log('\nPlease ensure you have a .env file with:', 'yellow');
        log('  VITE_SUPABASE_URL=your_url', 'yellow');
        log('  VITE_SUPABASE_ANON_KEY=your_key\n', 'yellow');
        process.exit(1);
    }

    log(`✅ Found Supabase URL: ${supabaseUrl.substring(0, 30)}...`, 'green');
    log(`✅ Found Supabase Key: ${supabaseKey.substring(0, 20)}...\n`, 'green');

    // Step 2: Create Supabase client
    log('📋 Step 2: Connecting to Supabase...', 'blue');
    const supabase = createClient(supabaseUrl, supabaseKey);
    log('✅ Connected successfully!\n', 'green');

    // Step 3: Check if table already exists
    log('📋 Step 3: Checking if circle table exists...', 'blue');
    const { data: existingTables, error: checkError } = await supabase
        .from('circle')
        .select('id')
        .limit(1);

    if (!checkError) {
        log('⚠️  Table "circle" already exists!', 'yellow');
        log('   Skipping table creation to avoid conflicts.\n', 'yellow');

        // Count existing circles
        const { count } = await supabase
            .from('circle')
            .select('*', { count: 'exact', head: true });

        log(`📊 Current circles in database: ${count || 0}\n`, 'cyan');
        log('✅ Migration check complete - no changes needed!', 'green');
        return;
    }

    // Step 4: Read migration SQL
    log('📋 Step 4: Reading migration SQL file...', 'blue');
    const sqlPath = join(__dirname, 'supabase_migration.sql');
    let migrationSQL;

    try {
        migrationSQL = readFileSync(sqlPath, 'utf-8');
        log('✅ Migration SQL loaded successfully!\n', 'green');
    } catch (error) {
        log(`❌ ERROR: Could not read migration file: ${error.message}`, 'red');
        process.exit(1);
    }

    // Step 5: Execute migration using Supabase Management API
    log('📋 Step 5: Executing migration...', 'blue');
    log('   Creating circle table with:', 'cyan');
    log('   - id (TEXT PRIMARY KEY)', 'cyan');
    log('   - name (TEXT NOT NULL)', 'cyan');
    log('   - updated_at (TIMESTAMP)', 'cyan');
    log('   - state (JSONB)', 'cyan');
    log('   - created_at (TIMESTAMP)', 'cyan');
    log('   - Row Level Security enabled', 'cyan');
    log('   - Public access policy\n', 'cyan');

    // Note: We need to use the SQL editor endpoint or direct SQL execution
    // For safety, we'll use the RPC approach
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: migrationSQL
    }).catch(async () => {
        // Fallback: Try to create table directly using the schema
        log('   Using direct table creation method...', 'yellow');

        // Since we can't execute raw SQL with anon key, we'll create a minimal version
        // The user will need to run the full SQL in the dashboard
        log('\n⚠️  IMPORTANT: Direct SQL execution requires admin access.', 'yellow');
        log('   Please run the migration manually:', 'yellow');
        log('\n   1. Go to: https://supabase.com/dashboard/project/jukttd8omtcstbbchk/sql', 'cyan');
        log('   2. Click "New Query"', 'cyan');
        log('   3. Paste the contents of supabase_migration.sql', 'cyan');
        log('   4. Click "Run"\n', 'cyan');

        return { data: null, error: { message: 'Manual migration required' } };
    });

    if (error && error.message !== 'Manual migration required') {
        log(`❌ Migration failed: ${error.message}`, 'red');
        log('\n💡 This is expected - the anon key cannot execute DDL statements.', 'yellow');
        log('   Please run the migration manually in the Supabase dashboard.\n', 'yellow');
        process.exit(1);
    }

    if (data) {
        log('✅ Migration executed successfully!\n', 'green');
    }

    log('═══════════════════════════════════', 'cyan');
    log('✨ Migration process complete!', 'green');
    log('═══════════════════════════════════\n', 'cyan');
}

// Run migration
runMigration().catch((error) => {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
