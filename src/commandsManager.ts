import {Collection, dotEnvConfig, SEP} from './deps.ts';
import type Command from './src/classes/Command.ts';

export const commands = new Collection<string, Command>();

export async function commandsManager(cmdDir: Iterable<Deno.DirEntry>): Promise<void> {
	for (let command of [...cmdDir]) {
		if (command.isFile && command.name.endsWith('.ts')) {
			const path: string = Deno.realPathSync(dotEnvConfig.commandsFolder + SEP + command.name);
			const commandClass: any = await import(`file://${path}`);
			const cmd: any = commandClass.default;
			if (!cmd) {
				console.warn(`Could not load '${command.name}' command !`);
				continue;
			}
			commands.set(cmd.name, new cmd());
			console.log(`Successfully loaded '${cmd.name}' command !`);
		}
	}
}
