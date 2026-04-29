import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Try fetching one row from guests to see columns via PostgREST
  const { data, error } = await supabase.from("guests").select("*").limit(0);
  if (error) {
    console.error("guests query error:", JSON.stringify(error, null, 2));
  } else {
    console.log("guests select (limit 0):", JSON.stringify(data, null, 2));
  }

  // Also try to get all rows from guests table to see structure
  const { data: oneRow, error: e2 } = await supabase
    .from("guests")
    .select("*")
    .limit(1);
  if (e2) {
    console.error("guests single row error:", JSON.stringify(e2, null, 2));
  } else {
    console.log("guests one row keys:", oneRow && oneRow[0] ? Object.keys(oneRow[0]) : "empty table");
  }
}

main().catch(console.error);
