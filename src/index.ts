import { createSlashCommandHandler } from "@glenstack/cf-workers-discord-bot";
import { commands } from "./commands";

const slashCommandHandler = createSlashCommandHandler({
  applicationID: APPLICATION_ID,
  applicationSecret: APPLICATION_SECRET,
  publicKey: PUBLIC_KEY,
  commands,
});

addEventListener("fetch", (event) => {
  event.respondWith(slashCommandHandler(event.request));
});
