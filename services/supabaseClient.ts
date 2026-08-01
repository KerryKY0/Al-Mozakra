import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta as any).env.VITE_SUPABASE_URL ||
  "https://gdohxnigrrkoirlbamom.supabase.co";
const supabaseAnonKey =
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkb2h4bmlncnJrb2lybGJhbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQxMTksImV4cCI6MjA4ODgzMDExOX0.oEPVPczLSxfXwZHhL1MQCfiwdRFR5x7L1jpbGYVdGqk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
