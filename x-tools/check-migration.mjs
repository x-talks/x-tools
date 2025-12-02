import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.log('\nRequired variables:');
    console.log('  VITE_SUPABASE_URL');
    console.log('  VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_SERVICE_ROLE_KEY for admin access)');
    process.exit(1);
}

console.log('🔌 Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the migration SQL
const migrationSQL = readFileSync('./supabase_migration.sql', 'utf-8');

console.log('📝 Migration SQL loaded');
console.log('⚠️  Note: This requires manual execution in Supabase dashboard');
console.log('\n' + '='.repeat(60));
console.log('COPY THE SQL BELOW AND RUN IT IN SUPABASE SQL EDITOR:');
console.log('='.repeat(60) + '\n');
console.log(migrationSQL);
console.log('\n' + '='.repeat(60));
console.log('\n📍 Go to: ' + supabaseUrl.replace('//', '//supabase.com/dashboard/project/') + '/sql');
console.log('   Click "New Query", paste the SQL above, and click "Run"');
console.log('='.repeat(60) + '\n');

// Try to verify if table exists
console.log('🔍 Checking current database state...');
const { data, error } = await supabase.from('circle').select('count').limit(1);

if (error) {
    if (error.message.includes('relation "public.circle" does not exist')) {
        console.log('✅ Confirmed: circle table does NOT exist yet');
        console.log('   👉 Please run the SQL migration above');
    } else {
        console.log('⚠️  Error checking table:', error.message);
    }
} else {
    console.log('✅ circle table already exists!');
    console.log('   Migration not needed.');
}
