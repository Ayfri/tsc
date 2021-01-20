import { commands, commandsManager } from "./src/commandsManager.ts";
import { Discord, dotEnvConfig, Message } from "./deps.ts";
import type Command from "./src/classes/Command.ts";

const cmdDir: Iterable<Deno.DirEntry> = Deno.readDirSync(
  Deno.realPathSync(dotEnvConfig.commandsFolder),
);
await commandsManager(cmdDir);

const a = {
  lol: {
    non: "oui",
  },
};

const { lol: { non } } = a;

export default Discord.startBot({
  token: dotEnvConfig.token,
  intents: [
    Discord.Intents.GUILD_MESSAGES,
    Discord.Intents.GUILDS,
    Discord.Intents.DIRECT_MESSAGES,
  ],
  eventHandlers: {
    ready() {
      return console.info("Ready ! ");
    },
    async messageCreate(message: Message) {
      if (message.author.bot) return;
      if (new RegExp(`<@!?${Discord.botID}>`).test(message.content)) {
        return message.reply("Use the bot with the `tsc ` prefix !");
      }

      const args: string[] = message.content.slice(dotEnvConfig.prefix.length)
        .trim().split(/\s+?/);
      const cmd: Command | undefined = commands.find((c: Command) =>
        c.name.toLowerCase().includes(args[0].toLowerCase())
      );

      if (message.content.startsWith(dotEnvConfig.prefix) && cmd) {
        args.shift();
        console.log(`Command '${cmd.name}' executed.`);
        await cmd.run(message, args);
      }
    },
  },
});
