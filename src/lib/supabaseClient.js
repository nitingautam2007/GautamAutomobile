import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lfxhmhacjfqywczqnefk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeGhtaGFjamZxeXdjenFuZWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MjM4OTIsImV4cCI6MjA5OTk5OTg5Mn0.n5hWVexB1UdHD82IrqE61ylJDOfvdOkJfzLZq-WX7CE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
