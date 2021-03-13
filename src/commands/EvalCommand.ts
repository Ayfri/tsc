import {Command, CommandContext, Message} from '../../deps.ts';
import {codeBlock, crop} from '../utils/utils.ts';

export default class EvalCommand extends Command {
	public name = 'eval';
	public aliases = ['e', 'run', 'js', 'ts'];
	public category = 'dev';
	public ownerOnly = true;

	public static async compileTSToJS(code: string) {
		const {files} = await Deno.emit('/temp', {
			sources: {
				'/temp': code,
			},
			compilerOptions: {
				noImplicitAny: false,
				sourceMap: false,
				declaration: false,
			},
		});

		return Object.values(files)[0];
	}

	public async execute(ctx: CommandContext): Promise<void> {
		const {
			client,
			command,
			message,
			channel,
			guild,
			args,
			author,
		} = ctx;

		function send(content: string): Promise<Message> {
			return message.reply(crop(content, 2000));
		}

		function sendJS(content: string, channelID: string = channel.id): Promise<Message> {
			return sendMarkdown(content, 'ts');
		}

		function sendMarkdown(content: string, language: string = 'ts'): Promise<Message> {
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

			let code = ctx.args.join(' ').replace(/```(?:[a-z0-9]{1,12})?([\S\s]*)```/g, '$1');
			code = `wait(async function(){${code}})`;

			eval(await EvalCommand.compileTSToJS(code));
		} catch (e) {
			await sendJS(decodeURI(Deno.inspect(e, {
				sorted: true,
			})));
		}
	}
}
