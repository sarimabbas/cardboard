import { OEmbedProvider } from "@/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  // find the oembed provider
  const providers = await fetch("https://oembed.com/providers.json");
  const providersJson: OEmbedProvider[] = await providers.json();

  // find the provider that matches the url
  const provider = providersJson.find((provider) =>
    params.url.includes(provider.provider_url)
  );

  // if no provider is found, return a 404
  if (!provider) {
    return new Response("Not found", { status: 404 });
  }

  // find the endpoint that matches the url
  const endpoint = provider.endpoints?.[0]?.url;

  // if no endpoint is found, return a 404
  if (!endpoint) {
    return new Response("Not found", { status: 404 });
  }

  // fetch the oembed data
  const oembed = await fetch(
    `${endpoint}?format=json&url=${params.url}&maxwidth=${params.maxwidth}&maxheight=${params.maxheight}`
  );

  // return the oembed data
  return new Response(await oembed.text(), {
    headers: { "Content-Type": "application/json" },
  });
}
