import {colors, CommandClient, dotEnvConfig, format, GatewayIntents, GuildTextChannel, log} from './deps.ts';

export const client = new CommandClient({
	prefix: dotEnvConfig.prefix,
	owners: dotEnvConfig.owners.split(','),
	allowBots: false,
	token: dotEnvConfig.token,
	intents: [
		GatewayIntents.GUILD_MESSAGES,
		GatewayIntents.GUILDS,
		GatewayIntents.DIRECT_MESSAGES,
		GatewayIntents.GUILD_EMOJIS,
	],
});

log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler('DEBUG', {
			formatter: (logRecord) => {
				return `[${format(logRecord.datetime, 'yy/MM/dd HH:mm:ss.SSS')}][${logRecord.levelName}] ${logRecord.msg}`;
			},
		}),
	},
	loggers: {
		default: {
			level: 'DEBUG',
			handlers: ['console'],
		},
	},
});

client.commands.loader.loadDirectory(dotEnvConfig.commandsFolder);
client.on('ready', () => log.info(`Ready! User: ${colors.magenta(client.user?.tag!)}`));
client.on('commandUsed', (ctx) => {
	log.debug(
		`Command '${colors.green(ctx.name)}' executed by '${colors.magenta(ctx.author.tag)}' ${
			ctx.guild
			? `on the guild '${colors.green(ctx.guild.name!)}' into the channel '${colors.green((ctx.channel as GuildTextChannel).name)}'`
			: 'in dms'
		}.`,
	);
});
client.connect();
