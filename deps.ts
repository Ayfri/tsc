export {sendMessage} from 'https://x.nest.land/Discordeno@9.0.1/src/handlers/channel.ts';
export type {Message} from 'https://x.nest.land/Discordeno@9.0.1/src/structures/message.ts';
export {Intents} from 'https://x.nest.land/Discordeno@9.0.1/src/types/options.ts';
export {Collection} from 'https://x.nest.land/Discordeno@9.0.1/src/utils/collection.ts';
export {SEP} from 'https://deno.land/std/path/mod.ts';
import {config} from 'https://deno.land/x/dotenv/mod.ts';
import Client, {botID} from 'https://x.nest.land/Discordeno@9.0.1/src/module/client.ts';

export {exec} from 'https://cdn.depjs.com/exec/mod.ts';

export const dotEnvConfig = config();

export {botID};
export default Client;

