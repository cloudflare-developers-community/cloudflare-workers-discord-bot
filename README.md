# Cloudflare Workers Discord Bot

> A bot for the Cloudflare Workers Discord server

## Setup

Install at [`https://cloudflare-workers-discord-bot.gregbrimble.workers.dev/`](https://cloudflare-workers-discord-bot.gregbrimble.workers.dev/).

### Environment Variables

Other than those listed in [`wrangler.toml`](./wrangler.toml), this Worker requires a secret `APPLICATION_SECRET` which is set to the Discord "Client Secret".

More information can be found at [`@glenstack/cf-workers-discord-bot`](https://github.com/glenstack/glenstack/tree/master/packages/cf-workers-discord-bot).

## Usage

### Slash Commands

#### `/script`

Embed a script from [cloudflareworkers.com](https://cloudflareworkers.com).

| Option  | Description                                    |
| ------- | ---------------------------------------------- |
| `url`   | The URL of the Worker on cloudflareworkers.com |
| `title` | An optional title for the Worker script        |

#### `/docs`

Search the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).

| Option | Description     |
| ------ | --------------- |
| `term` | The search term |
