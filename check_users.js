import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
        console.error('Error:', error)
    } else {
        console.log('Profiles:', data)
    }
}

checkUsers()
