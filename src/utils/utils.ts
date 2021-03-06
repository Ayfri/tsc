import {dotEnvConfig} from '../../deps.ts';

export function codeBlock(code: string = '', language?: string): string {
	return `\`\`\`${language}\n${code}\`\`\``;
}

export function crop(text: string, maxLength?: number): string {
	maxLength ??= text.length;
	return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export function commandToFile(command: string): string {
	return `${command[0].toUpperCase()}${command.slice(1)}Command.ts`;
}

export function isOwner(id: string): boolean {
	return dotEnvConfig.botOwners.split(',').includes(id);
}

export async function compileTSToJS(code: string) {
	const {files} = await Deno.emit('/assets/temp.ts', {
		sources:         {
			'/assets/temp.ts': code,
		},
		compilerOptions: {
			noImplicitAny: false,
			sourceMap:     false,
			declaration:   false,
		},
	});

	return Object.values(files)[0];
}
