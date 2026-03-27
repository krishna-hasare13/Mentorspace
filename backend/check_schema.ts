
import { supabaseAdmin } from './src/config/supabase';

async function checkSchema() {
    const { data, error } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching sessions sample:', error);
    } else {
        console.log('Columns in sessions table:', Object.keys(data[0] || {}));
    }
}

checkSchema();
