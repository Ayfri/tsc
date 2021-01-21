import {dotEnvConfig, Message, SEP} from '../../deps.ts';
import Command from '../classes/Command.ts';
import {commands} from '../commandsManager.ts';
import {commandToFile} from '../utils/utils.ts';

export default class ReloadCommand extends Command {
	private reloadCounter: number = 0;
	
	public constructor() {
		super('reload');
	}
	
	public async run(message: Message, args: string[]): Promise<void> {
		const commandName: string = args[0];
		const oldCommand: Command | undefined = commands.find((c: Command) =>
			c.name.toLowerCase().includes(commandName.toLowerCase()),
		);
		if (oldCommand) {
			commands.delete(oldCommand.name);
			const path: string = Deno.realPathSync(dotEnvConfig.commandsFolder);
			const cmdFileName: string = commandToFile(oldCommand.name);
			const fullPath: string = path + SEP + cmdFileName;
			const newCommand: any = new ((await import(`file:///${fullPath}#${this.reloadCounter}`)).default)();
			commands.set(newCommand.name, newCommand);
			message.send(`Reloaded command \`${newCommand.name}\` !`);
			
			this.reloadCounter++;
		}
	}
}
