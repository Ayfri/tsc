import {Message} from '../../deps.ts';
import Command from '../classes/Command.ts';
import {codeBlock, compileTSToJS, crop, isOwner} from '../utils/utils.ts';

export default class EvalCommand extends Command {
	public constructor() {
		super('eval');
	}
	
	public async run(message: Message, args: string[]): Promise<void> {
		function send(
			content: string,
			channelID: string = message.channelID,
		): Promise<any> {
			return message.send(crop(content, 2000));
		}
		
		function sendJS(
			content: string,
			channelID: string = message.channelID,
		): Promise<any> {
			return sendMarkdown(content, 'ts', channelID);
		}
		
		function sendMarkdown(
			content: string,
			language: string = 'ts',
			channelID: string = message.channelID,
		): Promise<any> {
			return send(codeBlock(content, language), channelID);
		}
		
		if (!isOwner(message.author.id)) {
			await send("Blah, you don't have permission");
		} else {
			try {
				async function wait(callback: () => any): Promise<void> {
					try {
						await callback();
					} catch (e) {
						await sendJS(decodeURI(Deno.inspect(e, {
							sorted: true,
						})));
					}
				}
				
				const code = args.join(' ')
					.replace(/```(?:[a-z0-9]{1,12})?([\S\s]*)```/g, '$1');
				
				await eval(await compileTSToJS(`wait(async function(){${code}})`));
			} catch (e) {
				await sendJS(decodeURI(Deno.inspect(e, {
					sorted: true,
				})));
			}
		}
	}
}
