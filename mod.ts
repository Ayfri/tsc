import {createRequire} from 'https://deno.land/std@0.74.0/node/module.ts';
import {configs} from './configs.ts';
import Client, {botID, Collection, Intents, Message, sendMessage, SEP} from './deps.ts';
import type Command from './src/classes/Command.ts';


export const commands = new Collection<string, Command>();
/*commands.set(compileCommand.name, compileCommand);
console.log(`Command '${compileCommand.name}' loaded.`);
commands.set(reloadCommand.name, reloadCommand);
console.log(`Command '${reloadCommand.name}' loaded.`);*/

/*const require = createRequire(import.meta.url);
for(let command of [...cmdDir]) {
	if (command.isFile && command.name.endsWith('.ts')) {
		const path: string = Deno.realPathSync(configs.commandsFolder + SEP + command.name);
		console.log(path);
		const cmdClass = require(path).default;
		console.log(cmdClass);
	}
}*/
const cmdDir: Iterable<Deno.DirEntry> = Deno.readDirSync(Deno.realPathSync(configs.commandsFolder));
for (let command of [...cmdDir]) {
	if (command.isFile && command.name.endsWith('.ts')) {
		const path: string = Deno.realPathSync(configs.commandsFolder + SEP + command.name);
		const commandClass: any = await import(`file://${path}`);
		const cmd: any = commandClass.default;
		if (!cmd) {
			console.warn(`Could not load '${command.name}' command !`);
			continue;
		}
		commands.set(cmd.name, new cmd());
		console.log(`Successfully loaded '${cmd.name}' command !`);
	}
}

console.log(commands);


Client({
	token:         configs.token,
	intents:       [Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES],
	eventHandlers: {
		ready:         () => console.info('Ready ! '),
		messageCreate: async (message: Message) => {
			if (message.author.bot) return;
			if (new RegExp(`<@!?${botID}>`).test(message.content)) {
				return sendMessage(message.channelID, 'Use the bot with the `tsc ` prefix !');
			}
			
			const args: string[] = message.content.slice(configs.prefix.length).trim().split(/\s+?/);
			const cmd: Command | undefined = commands.find(c => c.name.toLowerCase().includes(args[0].toLowerCase()));
			
			if (message.content.startsWith(configs.prefix) && cmd) {
				args.shift();
				await cmd.run(message, args);
			}
		},
	},
});
