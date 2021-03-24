import {Command, CommandContext, dotEnvConfig, SEP} from '../../deps.ts';
import {client} from '../../mod.ts';
import {ERROR_EMOJI, WAIT_EMOJI} from '../constants.ts';
import {commandToFile} from '../utils/utils.ts';

export default class ReloadCommand extends Command {
	public name = 'reload';
	public aliases = ['rl'];
	public category = 'dev';
	public ownerOnly = true;
	private reloadCounter: number = 0;

	public async execute(ctx: CommandContext): Promise<void> {
		const commandName: string = ctx.args[0];
		const oldCommand: Command | undefined = ctx.client.commands.find(commandName);
		if (oldCommand) {
			ctx.message.addReaction(WAIT_EMOJI);
			console.log(`Reloading command '${oldCommand.name}'.`);

			try {
				client.commands.delete(oldCommand);
				const fullPath: string = `file:///${Deno.realPathSync(dotEnvConfig.commandsFolder) + SEP + commandToFile(oldCommand.name)}#${this.reloadCounter}`;
				const newCommand: any = new ((await import(fullPath)).default)();
				client.commands.list.set(`${newCommand.name}-0`, newCommand);

				ctx.message.reply(`Reloaded command \`${newCommand.name}\` !`);
				this.reloadCounter++;
				ctx.message.removeReaction(ERROR_EMOJI, client.user);

			} catch (e) {
				console.warn(e);
			}
		} else {
			ctx.message.addReaction(ERROR_EMOJI);
			ctx.message.reply(`Command \`${commandName}\` not found.`);
		}
	}
}
