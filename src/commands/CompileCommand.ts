import {Command, CommandContext} from '../../deps.ts';
import {ERROR_EMOJI, WAIT_EMOJI} from '../constants.ts';
import {codeBlock, crop, fancyFormatDiagnostics} from '../utils/utils.ts';

export default class CompileCommand extends Command {
	public name = 'compile';
	public aliases = ['tsc', 'c'];
	public category = 'dev';

	public static async compile(code: string) {
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

		const resultCode = result.files['file:///C:/assets/temp.ts.js'];
		const types = result.files['file:///C:/assets/temp.ts.d.ts'].replace('/// <amd-module name="file:///C:/assets/temp.ts" />', '');
		const errors = result.diagnostics;

		return {
			resultCode,
			types,
			errors,
		};
	}

	public async execute(ctx: CommandContext): Promise<void> {
		await ctx.message.addReaction(WAIT_EMOJI);

		const code: string = ctx.args.join(' ').replace(/```([tj]s|(type|java)script)?/gi, '').trim();
		const {
			resultCode,
			types,
			errors,
		} = await CompileCommand.compile(code);

		await ctx.message.reply(codeBlock(crop(resultCode, 1990), 'js'));
		if (types.trim().length > 0) ctx.channel.send(`> **Types :**\n${codeBlock(crop(types, 1990), 'ts')}`);
		if (errors.length > 0) {
			ctx.message.addReaction(ERROR_EMOJI);
			await ctx.channel.send(`> **Errors :**\n${(fancyFormatDiagnostics(errors))}`);
		}

		await ctx.message.removeReaction(WAIT_EMOJI, ctx.client.user);
	}
}
