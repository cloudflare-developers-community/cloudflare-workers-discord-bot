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
import algoliasearch from "@glenstack/cf-workers-algolia-search";

export const command: ApplicationCommand = {
  name: "docs",
  description: "Search the Workers documentation for a term",
  options: [
    {
      name: "term",
      description: "The search term",
      type: ApplicationCommandOptionType.STRING,
      required: true,
    },
  ],
};

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

type SearchResult = {
  anchor: string;
  content: string | null;
  hierarchy: {
    lvl0: string | null;
    lvl1: string | null;
    lvl2: string | null;
    lvl3: string | null;
    lvl4: string | null;
    lvl5: string | null;
    lvl6: string | null;
  };
  url: string;
};

const hierarchyOrder: (keyof SearchResult["hierarchy"])[] = [
  "lvl0",
  "lvl1",
  "lvl2",
  "lvl3",
  "lvl4",
  "lvl5",
  "lvl6",
];

const makeBreakcrumb = (result: SearchResult) =>
  (hierarchyOrder
    .map((key) => result.hierarchy[key])
    .filter((title) => title) as string[]).reduce(
    (previousValue, currentValue) =>
      `${previousValue} > ${currentValue.trim()}`,
    ""
  );

export const handler: InteractionHandler = async (
  interaction: Interaction
): Promise<InteractionResponse> => {
  const options = (interaction.data as ApplicationCommandInteractionData)
    .options as ApplicationCommandInteractionDataOption[];
  const term = (options.find((option) => option.name === "term") || {}).value;

  try {
    const results = await index.search<SearchResult>(term);

    if (results.hits.length > 0) {
      const result = results.hits[0];
      const breadcrumb = makeBreakcrumb(result);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "",
          embeds: [
            {
              title: breadcrumb,
              url: result.url,
              description:
                result.content !== null ? `${result.content}...` : undefined,
              provider: {
                name: "Cloudflare",
                url: "https://developers.cloudflare.com/workers/",
              },
              footer: {
                text: `${results.nbHits} results`,
              },
            },
          ],
        },
      };
    } else {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `No results found for term: ${term}.`,
        },
      };
    }
  } catch (e) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: e.message },
    };
  }
};
