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

export function fancyFormatDiagnostics(errors: Deno.Diagnostic[]): string {
	return codeBlock(
		crop(
			errors
				.map(e => `${e.sourceLine}\n${' '.repeat(e.start?.character || e.end?.character || 0)}^\n${e.messageText}\nat line ${e.start?.line}:${e.start?.character}\nat line ${e.end?.line}:${e.end?.character}`)
				.join('\n'),
			1990),
		'ts');
}
