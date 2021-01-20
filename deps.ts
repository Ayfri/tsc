import { config } from "https://deno.land/x/dotenv/mod.ts";

export { SEP } from "https://deno.land/std/path/mod.ts";
export { exec } from "https://cdn.depjs.com/exec/mod.ts";
export * as Discord from "https://deno.land/x/discordeno@10.0.2/mod.ts";
export { Collection } from "https://deno.land/x/discordeno@10.0.2/mod.ts";
export type { Message } from "https://deno.land/x/discordeno@10.0.2/mod.ts";

export const dotEnvConfig = config();
