const {createClient} =  supabase

const supabaseUrl = 'https://bpawjhrpwkhwgdpjgfll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYXdqaHJwd2tod2dkcGpnZmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2Mjg2NjUsImV4cCI6MjA1MzIwNDY2NX0.BUJKECVfoUW3Gb3CUUpkLepzFevVi8eboBK7JOZ6UJE'
const supabaseClient = createClient(supabaseUrl, supabaseKey)

window.supabase = supabaseClient

// console.log(supabaseClient)



