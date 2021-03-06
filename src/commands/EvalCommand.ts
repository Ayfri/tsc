import {Command, CommandContext, Message} from '../../deps.ts';
import {client} from '../../mod.ts';
import {codeBlock, compileTSToJS, crop} from '../utils/utils.ts';

export default class EvalCommand extends Command {
	name = 'eval';
	aliases = ['e', 'run', 'js', 'ts'];
	whitelistedUsers = client.owners;

	public async execute(ctx: CommandContext): Promise<void> {
		function send(
			content: string,
		): Promise<Message> {
			return ctx.message.reply(crop(content, 2000));
		}

		function sendJS(
			content: string,
			channelID: string = ctx.channel.id,
		): Promise<Message> {
			return sendMarkdown(content, 'ts');
		}

		function sendMarkdown(
			content: string,
			language: string = 'ts',
		): Promise<Message> {
			return send(codeBlock(content, language));
		}

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

			const code = ctx.args.join(' ').replace(/```(?:[a-z0-9]{1,12})?([\S\s]*)```/g, '$1');

			await eval(await compileTSToJS(`wait(async function(){${code}})`));
		} catch (e) {
			await sendJS(decodeURI(Deno.inspect(e, {
				sorted: true,
			})));
		}
	}
}
