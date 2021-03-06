import {Command, CommandContext, dotEnvConfig, SEP} from '../../deps.ts';
import {client} from '../../mod.ts';
import {commandToFile} from '../utils/utils.ts';

export default class ReloadCommand extends Command {
	private reloadCounter: number = 0;
	name = 'reload';
	aliases = ['rl'];
	whitelistedUsers = client.owners;

	public async execute(ctx: CommandContext): Promise<void> {
		const commandName: string = ctx.args[0];
		const oldCommand: Command | undefined = ctx.client.commands.find(commandName);

		if (oldCommand) {
			ctx.client.commands.delete(oldCommand.name);
			const path: string = Deno.realPathSync(dotEnvConfig.commandsFolder);
			const cmdFileName: string = commandToFile(oldCommand.name);
			const fullPath: string = path + SEP + cmdFileName;
			const newCommand: any = (await import(`file:///${fullPath}#${this.reloadCounter}`)).default;
			ctx.client.commands.add(newCommand);
			ctx.message.reply(`Reloaded command \`${newCommand.name}\` !`);
			
			this.reloadCounter++;
		}
	}
}
