import {commands} from '../../commandsManager.ts';
import {configs} from '../../configs.ts';
import {Message, sendMessage} from '../../deps.ts';
import {commandToFile} from '../../utils/utils.ts';
import Command from '../classes/Command.ts';

export default class ReloadCommand extends Command {
	public constructor() {
		super('reload');
	}
	
	public async run(message: Message, args: string[]): Promise<void> {
		const commandName: string = args[0];
		const command: Command | undefined = commands.find(c => c.name.toLowerCase().includes(commandName.toLowerCase()));
		if (command) {
			commands.delete(command.name);
			const path: string = Deno.realPathSync(configs.commandsFolder);
			const cmdFileName: string = commandToFile(command.name);
			const response = Deno.run({
				cmd:    ['cmd', 'c/', `Deno cache --reload ${path}/${cmdFileName}`],
				cwd:    path,
				stdout: 'piped',
				stderr: 'piped',
				stdin:  'piped',
			});
			console.log(new TextDecoder('utf-8').decode(await response.output()));
			console.log(new TextDecoder('utf-8').decode(await response.stderrOutput()));
			
			const cmd = new ((await import(`file://${path}/${cmdFileName}`)).default)();
			
			commands.set(cmd.name, cmd);
			
			sendMessage(message.channelID, `Reloaded command \`${cmd.name}\` aaaa !`);
		}
	}
}
