import {Command, CommandContext, dotEnvConfig, SEP} from '../../deps.ts';
import {client} from '../../mod.ts';
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
			console.log(`Reloading command '${oldCommand.name}'.`);

			try {
				client.commands.delete(oldCommand);
				const fullPath: string = `file:///${Deno.realPathSync(dotEnvConfig.commandsFolder) + SEP + commandToFile(oldCommand.name)}#${this.reloadCounter}`;
				const newCommand: any = new ((await import(fullPath)).default)();
				client.commands.list.set(`${newCommand.name}-0`, newCommand);

				ctx.message.reply(`Reloaded command \`${newCommand.name}\` !`);
				this.reloadCounter++;
			} catch(e) {
				console.warn(e);
			}
		}
	}
}
