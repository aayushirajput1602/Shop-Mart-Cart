
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xwhlsouzhumntgluqvsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aGxzb3V6aHVtbnRnbHVxdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzM5NzUsImV4cCI6MjA1OTQ0OTk3NX0.m3GRd59_QQGdeBC6pc-w5HbygbJ3kfFOzwSmKFCGMc8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
