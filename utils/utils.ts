export function codeBlock(code: string = '', language?: string): string {
	return `\`\`\`${language}\n${code}\`\`\``;
}

export function crop(text: string, length?: number): string {
	length ??= text.length;
	return text.length > length ? text.slice(0, length - 3) + '...' : text;
}

export function commandToFile(command: string): string {
	return `${command[0].toUpperCase() + command.slice(1)}Command.ts`;
}
