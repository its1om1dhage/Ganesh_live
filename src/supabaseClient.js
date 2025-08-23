import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing. Make sure to create a .env.local file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getImageUrl = (path) => {
  return `${supabaseUrl}/storage/v1/object/public/photos/${path}`
}