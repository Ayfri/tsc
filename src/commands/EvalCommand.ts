import {Message, sendMessage} from '../../deps.ts';
import Command from '../classes/Command.ts';
import {codeBlock, crop, isOwner} from '../utils/utils.ts';

function exec(callback: () => any) {
	try {
		return callback();
	} catch (error) {
		return error;
	}
}

async function wait(callback: () => any) {
	try {
		return await callback();
	} catch (error) {
		return error;
	}
}

export default class EvalCommand extends Command {
	public constructor() {
		super('eval');
	}
	
	public async run(message: Message, args: string[]): Promise<void> {
		function send(content: string, channelID: string = message.channelID): Promise<any> {
			return sendMessage(channelID, crop(content, 2000));
		}
		
		function sendJS(content: string, channelID: string = message.channelID): Promise<any> {
			return sendMarkdown(content, 'js', channelID);
		}
		
		function sendMarkdown(content: string, language: string = 'js', channelID: string = message.channelID): Promise<any> {
			return send(codeBlock(content, language), channelID);
		}
		
		if (!isOwner(message.author.id)) await send('Blah, t\'as pas la permission !');
		else {
			try {
				let code = args.join(' ');
				code = code.replace(/```([a-z0-9]+)?/g, '');
				code = code.includes('await')
				       ? `wait(async function(){\n\t${code}\n})`
				       : `exec(function(){\n\t${code}\n})`;
				
				const retour = await eval(code);
				
				if (retour) await send(retour);
			} catch (e) {
				await sendJS(e.stack);
			}
		}
	}
}
