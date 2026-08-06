import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = "https://xxryhuaxorelxfnsdsee.supabase.co";
const supabaseAnonKey =
  "sb_publishable_qQ-Z7d1z5i3DsUNx8kan3A__feTBqOO";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "implicit",
    detectSessionInUrl: true,
  },
});