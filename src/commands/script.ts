import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  Interaction,
  ApplicationCommandInteractionData,
  ApplicationCommandInteractionDataOption,
  InteractionHandler,
  InteractionResponse,
  InteractionResponseType,
} from "@glenstack/cf-workers-discord-bot";

export const command: ApplicationCommand = {
  name: "script",
  description: "Embed a script from cloudflareworkers.com",
  options: [
    {
      name: "url",
      description: "The URL of the Worker on cloudflareworkers.com",
      type: ApplicationCommandOptionType.STRING,
      required: true,
    },
    {
      name: "title",
      description: "An optional title for the Worker script",
      type: ApplicationCommandOptionType.STRING,
    },
  ],
};

const getScriptID = (url: string) =>
  new URL(url).hash.split(":")[0].split("#")[1];

export const handler: InteractionHandler = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  const options = (interaction.data as ApplicationCommandInteractionData)
    .options as ApplicationCommandInteractionDataOption[];

  try {
    const url = (options.find(
      (option) => option.name === "url"
    ) as ApplicationCommandInteractionDataOption).value;
    const id = getScriptID(url);

    const title =
      (options.find((option) => option.name === "title") || {}).value ||
      "Untitled Worker";

    const response = await fetch(`https://cloudflareworkers.com/script/${id}`);
    const script = await response.text();
    const content = `\`\`\`javascript
${script}
\`\`\``;

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content,
        embeds: [
          {
            title,
            url: url,
            footer: {
              text: "cloudflareworkers.com",
            },
            provider: {
              name: "cloudflareworkers.com",
              url: "https://cloudflareworkers.com/",
            },
            author: {
              name: `@${interaction.member.user.username}`,
              icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
            },
          },
        ],
      },
    };
  } catch {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content:
          "Invalid URL. It must be in the format: `https://www.cloudflareworkers.com/#1234567890:https://example.com/`",
      },
    };
  }
};
