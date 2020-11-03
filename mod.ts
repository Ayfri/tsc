import {commands, commandsManager} from './src/commandsManager.ts';
import Client, {botID, dotEnvConfig, Intents, Message, sendMessage} from './deps.ts';
import type Command from './src/classes/Command.ts';

const cmdDir: Iterable<Deno.DirEntry> = Deno.readDirSync(Deno.realPathSync(dotEnvConfig.commandsFolder));
await commandsManager(cmdDir);

Client({
	token:         dotEnvConfig.token,
	intents:       [Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES],
	eventHandlers: {
		ready:         () => console.info('Ready ! '),
		messageCreate: async (message: Message) => {
			if (message.author.bot) return;
			if (new RegExp(`<@!?${botID}>`).test(message.content)) {
				return sendMessage(message.channelID, 'Use the bot with the `tsc ` prefix !');
			}
			
			const args: string[] = message.content.slice(dotEnvConfig.prefix.length).trim().split(/\s+?/);
			const cmd: Command | undefined = commands.find(c => c.name.toLowerCase().includes(args[0].toLowerCase()));
			
			if (message.content.startsWith(dotEnvConfig.prefix) && cmd) {
				args.shift();
				await cmd.run(message, args);
			}
		},
	},
});
