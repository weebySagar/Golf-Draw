import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role key (full access, only use server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Public bucket name for proof uploads
export const PROOF_BUCKET = "winner-proofs";
