import {Command, CommandContext, Message} from '../../deps.ts';
import {codeBlock, crop, fancyFormatDiagnostics} from '../utils/utils.ts';

export default class EvalCommand extends Command {
	public name = 'eval';
	public aliases = ['e', 'run', 'js', 'ts'];
	public category = 'dev';
	public ownerOnly = true;

	public static async compileTSToJS(code: string) {
		const result = await Deno.emit('/assets/temp.ts', {
			sources: {
				'/assets/temp.ts': code,
			},
			compilerOptions: {
				noImplicitAny: false,
				sourceMap: false,
				declaration: true,
				module: 'esnext',
				target: 'esnext',
				alwaysStrict: false,
				strict: true,
			},
		});

		return {
			JSCode: Object.values(result.files)[0],
			errors: result.diagnostics,
		};
	}

	public async execute(ctx: CommandContext): Promise<void> {
		const {
			argString,
			client,
			command,
			message,
			channel,
			guild,
			args,
			author,
			prefix,
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

		let code = argString.replace(new RegExp(`\`\`\`(?:[a-z0-9]{1,12})?([\\S\\s]*)\`\`\``), '$1');
		code = `(async function(){${code}})()`;
		try {
			const {
				JSCode,
				errors,
			} = await EvalCommand.compileTSToJS(code);

			const result = eval(JSCode);
			if (!!result || !!(await result)) await sendJS(result instanceof Promise ? await result : result);

			if (errors && !JSCode.length) message.reply(fancyFormatDiagnostics(result.errors));
		} catch (e) {
			if (e) await sendJS(decodeURI(Deno.inspect(e, {
				sorted: true,
			})));
		}
	}
}
