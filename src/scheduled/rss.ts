import Parser from "rss-parser";

const rss = new Parser();

const RSS_FEED_URL =
  "https://community.cloudflare.com/tag/workersreleasenotes.rss";
const KV_KEY = "LAST_RELEASE_NOTES_TIMESTAMP";

const stripDiscourse = (text: string) =>
  text.split("\n").slice(0, -2).join("\n");

export const workersReleaseNotes = async () => {
  const lastPostDate = new Date((await KV.get(KV_KEY)) as string);

  const response = await fetch(RSS_FEED_URL);
  const feed = await rss.parseString(await response.text());

  const items = feed.items.filter(
    (item) => item.isoDate && new Date(item.isoDate) > lastPostDate
  );

  if (items.length > 0) {
    const promises = items.map((item) => {
      const message = {
        content: item.contentSnippet
          ? stripDiscourse(item.contentSnippet)
          : undefined,
        embeds: [
          {
            title: item.title,
            url: item.link,
            footer: {
              text: "community.cloudflare.com",
            },
            provider: {
              name: "community.cloudflare.com",
              url: "https://community.cloudflare.com/",
            },
            author: {
              name: item.creator,
            },
            timestamp: item.isoDate,
          },
        ],
      };

      return fetch(WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    await Promise.all(promises);
    await KV.put(KV_KEY, items[0].isoDate as string);
  }
};
