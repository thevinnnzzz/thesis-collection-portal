
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpsfrnlhbjgvrjidewtu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2ZybmxoYmpndnJqaWRld3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3Njc3OTYsImV4cCI6MjA1NDM0Mzc5Nn0.g0vnuDDStAOqLGOraBdmsCQ29a9cSh8LzT6tOf35PpM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
