import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://lafkugajngwkszrkirrm.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZmt1Z2Fqbmd3a3N6cmtpcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxNDQ3NzcsImV4cCI6MTk5NTcyMDc3N30.W0HGwMgVR2IOAg2RYE8JmUh_KhydZuYsIG9XOsFxv4I';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;