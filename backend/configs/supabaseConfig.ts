import { env } from "./env";
import {createClient} from "@supabase/supabase-js"

const supabase = createClient(env.supabaseUrl, env.supabaseSRK);
export default supabase