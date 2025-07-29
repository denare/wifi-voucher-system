
// lib/supabase.ts (Client-side Supabase client)
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
