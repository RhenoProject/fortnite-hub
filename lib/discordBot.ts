const DISCORD_API = "https://discord.com/api/v10";

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  image?: { url: string };
  thumbnail?: { url: string };
  footer?: { text: string; icon_url?: string };
  url?: string;
  timestamp?: string;
}

export interface MessageOptions {
  content?: string;
  embeds?: DiscordEmbed[];
}

async function postWithRetry(fn: () => Promise<Response>, maxAttempts = 3): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fn();
      if (res.ok) return;
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${detail}`);
    } catch (e) {
      lastErr = e;
      if (i < maxAttempts - 1) await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function sendBotMessage(
  token: string,
  channelId: string,
  options: MessageOptions,
  maxAttempts = 3
): Promise<void> {
  await postWithRetry(
    () => fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    }),
    maxAttempts
  );
}

export async function sendWebhookMessage(
  webhookUrl: string,
  options: MessageOptions,
  maxAttempts = 3
): Promise<void> {
  await postWithRetry(
    () => fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    }),
    maxAttempts
  );
}
