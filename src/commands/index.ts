import {
  ApplicationCommand,
  InteractionHandler,
} from "@glenstack/cf-workers-discord-bot";
import { command as scriptCommand, handler as scriptHandler } from "./script";
import { command as docsCommand, handler as docsHandler } from "./docs";

export const commands: [ApplicationCommand, InteractionHandler][] = [
  [scriptCommand, scriptHandler],
  [docsCommand, docsHandler],
];
