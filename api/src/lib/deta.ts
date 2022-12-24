import { config } from "$std/dotenv/mod.ts";
import * as Deta from "deta";

await config({ path: "./.env.local", export: true });

const KEY = Deno.env.get("DETA_PROJECT_KEY") || undefined;
export const deta = Deta.Deta(KEY);
