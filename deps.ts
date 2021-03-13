import {config} from 'https://deno.land/x/dotenv/mod.ts';

export {SEP} from 'https://deno.land/std@0.89.0/path/mod.ts';

export {
	CommandClient,
	Message,
	GatewayIntents,
	Command,
	Embed
} from 'https://deno.land/x/harmony/mod.ts';

export type {
	CommandContext,
} from 'https://deno.land/x/harmony/mod.ts';

export const dotEnvConfig = config();
