import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rfihbsukhoglbtxyfxna.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaWhic3VraG9nbGJ0eHlmeG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2MDk1NzEsImV4cCI6MjA0NTE4NTU3MX0.xVgCtqDNfuhnH9OuiTyS7Y6Gz9bid4cmgBsLX7jLDs4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)