import {CommandClient, dotEnvConfig, GatewayIntents, SEP} from './deps.ts';

export const client = new CommandClient({
	prefix: 'tsc',
	owners: dotEnvConfig.owners.split(','),
	allowBots: false,
	token: dotEnvConfig.token,
	intents: [
		GatewayIntents.GUILD_MESSAGES,
		GatewayIntents.GUILDS,
		GatewayIntents.DIRECT_MESSAGES,
		GatewayIntents.GUILD_EMOJIS
	],
});

client.commands.loader.loadDirectory(`src${SEP}commands`);
client.on('ready', () => console.log(`Ready! User: ${client.user?.tag}`));
client.connect();
