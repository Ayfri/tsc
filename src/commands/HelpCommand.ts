import {Command, CommandContext, Embed} from '../../deps.ts';

export default class HelpCommand extends Command {
	public name = 'help';
	public aliases = ['h', '?'];
	public category = 'utils';

	public async execute(ctx: CommandContext) {
		if (ctx.args.length && ctx.client.commands.exists(ctx.args[0])) {
			const command = ctx.client.commands.find(ctx.args[0])!;
			const embed = new Embed().setTitle(`Command ${command.name}`);
			embed.description = '';

			if (command.description) embed.description = command.description;
			embed.description += `Category: **${command.category}**\n`;
			let permissionsField = '';
			if (command.ownerOnly) embed.description += 'Only available by the owner of the bot.';
			if (command.guildOnly) embed.description += 'Only available on a guild.';
			if (command.dmOnly) embed.description += 'Only available in DMs.';
			if (command.nsfw) embed.description += 'Only available in nsfw channels.';

			function valueOrArrayIntoArray<T>(arg: T | T[]): T[] {
				return arg instanceof Array ? arg : [arg];
			}

			if (command.botPermissions) permissionsField += valueOrArrayIntoArray(command.botPermissions).sort().join('\n');
			if (command.userPermissions) permissionsField += valueOrArrayIntoArray(command.userPermissions).sort().join('\n');
			if (permissionsField) embed.addField('Permissions', permissionsField);

			if (command.usage) embed.addField('Usage', valueOrArrayIntoArray(command.usage).sort().join('\n'));
			if (command.examples) embed.addField('Examples', valueOrArrayIntoArray(command.examples).sort().join('\n'));
			if (command.aliases) embed.addField('Aliases', `\`${valueOrArrayIntoArray(command.aliases).sort().join('`, `')}\``);

			ctx.message.reply(embed);
		} else {
			const embed = new Embed()
				.setTitle('Command list:')
				.setFooter('Do \'tsc help [command]\' to get help on a command.');

			ctx.client.commands.list.filter(c => c.category !== undefined).map(c => c.category!).sort().forEach(c => {
				if (embed.fields?.some(f => f.name === c)) return;
				embed.addField(c, `\`${ctx.client.commands.category(c).map(c => c.name).sort().join(', ')}\``);
			});

			ctx.message.reply(embed);
		}
	}
}
