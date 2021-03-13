import {Command, CommandContext} from '../../deps.ts';
import {LABS_TS, WAIT_EMOJI} from '../constants.ts';

export default class TestCommand extends Command {
	public name = 'test';
	public aliases = ['t'];
	public category = 'dev';

	public async execute(ctx: CommandContext): Promise<void> {
		ctx.message.reply('this is a test');
	}
}
