// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "DB features will be disabled, but the app will still run."
    );
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error("Error creating Supabase client:", err);
  // leave supabase = null so the rest of the app can still work
}

export { supabase };
