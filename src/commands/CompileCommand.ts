import {Message, sendMessage} from '../../deps.ts';
import {codeBlock, crop} from '../../utils/utils.ts';
import Command from '../classes/Command.ts';

export default class CompileCommand extends Command {
	private static readonly tempPath: string = '.\\assets\\temp.ts';
	
	public constructor() {
		super('compile');
	}
	
	public async run(message: Message, args: string[]): Promise<void> {
		const code: string = args.join(' ').replace(/```(ts|typescript)?/gi, '');
		Deno.writeTextFileSync(CompileCommand.tempPath, code, {
			create: false,
		});
		
		const process = Deno.run({
			cmd:    ['cmd', '/c', `tsc ${CompileCommand.tempPath} --strict --target ESNEXT --module commonJS`],
			cwd:    Deno.cwd(),
			stdout: 'piped',
		});
		
		const result: string = Deno.readTextFileSync(CompileCommand.tempPath.replace(/.ts$/, '.js'));
		const errors: string = new TextDecoder('utf8').decode(await process.output());
		
		sendMessage(message.channelID, codeBlock(crop(result, 1990), 'js'));
		if (errors) sendMessage(message.channelID, `> **Errors :**\n${codeBlock(crop(errors, 1990), 'ts')}`);
	}
}
