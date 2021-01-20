import type { Message } from "../../deps.ts";

export default abstract class Command {
  public readonly name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  public abstract run(message: Message, args: string[]): Promise<void>;
}
