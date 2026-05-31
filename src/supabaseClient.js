import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rstkjtuwvpdaowbqtspc.supabase.co'

const supabaseKey = 'sb_publishable_l4_aagzpASEqwAH9VZY5nw_pBvT1yXe'

export const supabase = createClient(supabaseUrl, supabaseKey)