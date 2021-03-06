import {Command, CommandContext} from '../../deps.ts';

export default class TestCommand extends Command {
	name = 'test';
	aliases = ['t'];

	public async execute(ctx: CommandContext): Promise<void> {
		ctx.message.reply('this is a test');
	}
}
