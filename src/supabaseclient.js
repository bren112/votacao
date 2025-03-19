import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
const SUPABASE_URL = 'https://buxqxvfxhmvzwqybtlwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eHF4dmZ4aG12endxeWJ0bHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTU3NDQsImV4cCI6MjA1Nzg5MTc0NH0.I2leSPGjeqC6Cpzq5vSJtv-Fv-V3UqWUFrEP-XMy2Kk'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
