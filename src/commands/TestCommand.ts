import {Command, CommandContext} from '../../deps.ts';

export default class TestCommand extends Command {
	public name = 'test';
	public aliases = ['t'];

	public async execute(ctx: CommandContext): Promise<void> {
		ctx.message.reply('this is a test');
	}
}
