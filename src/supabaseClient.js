import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gjeuiksktfhggzlywhtq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXVpa3NrdGZoZ2d6bHl3aHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzY3NTksImV4cCI6MjEwNjMxMjc1OX0.19PJ0gpTlbynphREPDioqYFFuFV7-Gzpq9hMvjmx0yQ' // Está en Project Settings -> API

export const supabase = createClient(supabaseUrl, supabaseKey)