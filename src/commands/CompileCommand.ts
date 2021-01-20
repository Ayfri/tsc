import { Message } from "../../deps.ts";
import Command from "../classes/Command.ts";
import { codeBlock, crop } from "../utils/utils.ts";

export default class CompileCommand extends Command {
  private static readonly tempPath: string = ".\\assets\\temp.ts";
  private static readonly tempPathDTS: string = ".\\assets\\temp.d.ts";

  public constructor() {
    super("compile");
  }

  public async run(message: Message, args: string[]): Promise<void> {
    const code: string = args.join(" ").replace(/```(ts|typescript)?/gi, "");
    const lastResult: string = Deno.readTextFileSync(
      CompileCommand.tempPath.replace(/.ts$/, ".js"),
    );
    Deno.writeTextFileSync(CompileCommand.tempPath, code, {
      create: false,
    });

    const process = Deno.run({
      cmd: [
        "cmd",
        "/c",
        `tsc ${CompileCommand.tempPath} --target ESNEXT --module commonJS --declaration`,
      ],
      cwd: Deno.cwd(),
      stdout: "piped",
    });

    const result: string = Deno.readTextFileSync(
      CompileCommand.tempPath.replace(/.ts$/, ".js"),
    );
    const types: string = Deno.readTextFileSync(CompileCommand.tempPathDTS);
    const errors: string = new TextDecoder("utf8").decode(
      await process.output(),
    );

    if (lastResult === result && errors) {
      message.send(`> **Errors :**\n${codeBlock(crop(errors, 1990), "ts")}`);
    } else {
      message.send(codeBlock(crop(result, 1990), "js"));
      if (types) {
        message.send(`> **Types :**\n${codeBlock(crop(types, 1990), "ts")}`);
      }
      if (errors) {
        message.send(`> **Errors :**\n${codeBlock(crop(errors, 1990), "ts")}`);
      }
    }
  }
}
