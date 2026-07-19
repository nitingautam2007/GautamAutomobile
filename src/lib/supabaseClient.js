import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jxkzauvvmhjaaaxxevta.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4a3phdXZ2bWhqYWFheHhldnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODU2NDEsImV4cCI6MjA5OTk2MTY0MX0.jKElUgWcZw0b4hITk5IahcQI2oG8mSv5d_dLHQxJisY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
