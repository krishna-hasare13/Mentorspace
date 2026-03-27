
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function addColumn() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        
        // Add the column if it doesn't exist
        const sql = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                               WHERE table_name='sessions' AND column_name='waiting_room_enabled') THEN
                    ALTER TABLE sessions ADD COLUMN waiting_room_enabled BOOLEAN DEFAULT FALSE;
                END IF;
            END $$;
        `;
        
        await client.query(sql);
        console.log('Successfully added or verified existence of waiting_room_enabled column.');
        
        // Also check if status 'pending' is needed in session_participants
        // But status is a string, so it's already flexible.
    } catch (err) {
        console.error('Error adding column:', err);
    } finally {
        await client.end();
    }
}

addColumn();
