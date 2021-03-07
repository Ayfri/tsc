import {CommandClient, dotEnvConfig, GatewayIntents, SEP} from './deps.ts';

export const client = new CommandClient({
	prefix: 'tsc',
	owners: ['386893236498857985'],
	allowBots: false,
	token: dotEnvConfig.token,
	intents: [
		GatewayIntents.GUILD_MESSAGES,
		GatewayIntents.GUILDS,
		GatewayIntents.DIRECT_MESSAGES,
	],
});

client.commands.loader.loadDirectory(`src${SEP}commands`);
client.on('ready', () => console.log(`Ready! User: ${client.user?.tag}`));
client.connect();
