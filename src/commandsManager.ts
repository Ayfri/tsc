import {Collection, dotEnvConfig, SEP} from '../deps.ts';
import type Command from './classes/Command.ts';

export const commands = new Collection<string, Command>();

export async function commandsManager(
	cmdDir: Iterable<Deno.DirEntry>,
): Promise<void> {
	for (let commandFile of [...cmdDir]) {
		if (commandFile.isFile && commandFile.name.endsWith('.ts')) {
			const path: string = Deno.realPathSync(
				dotEnvConfig.commandsFolder + SEP + commandFile.name,
			);
			const imported = await import(`file:///${path}`);
			const command = new (imported.default)();
			if (!command) {
				console.warn(`Could not load '${commandFile.name}' command !`);
				continue;
			}
			commands.set(commandFile.name, command);
			console.log(`Successfully loaded '${command.name}' command !`);
		}
	}
}
