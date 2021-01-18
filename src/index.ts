import { createSlashCommandHandler } from "@glenstack/cf-workers-discord-bot";
import { commands } from "./commands";
import { workersReleaseNotes } from "./scheduled/rss";

const slashCommandHandler = createSlashCommandHandler({
  applicationID: APPLICATION_ID,
  applicationSecret: APPLICATION_SECRET,
  publicKey: PUBLIC_KEY,
  commands,
});

addEventListener("scheduled", (event) => {
  event.waitUntil(workersReleaseNotes());
});

addEventListener("fetch", (event) => {
  event.respondWith(slashCommandHandler(event.request));
});
