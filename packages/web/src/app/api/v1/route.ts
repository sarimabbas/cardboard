import { OEmbedProvider } from "@/types";
import { NextResponse, NextRequest } from "next/server";
import normalizeUrl from "normalize-url";

export async function POST(request: NextRequest) {
  const { url, maxheight, maxwidth } = await request.json();

  // find the oembed provider
  const providers = await fetch("https://oembed.com/providers.json");
  const providersJson: OEmbedProvider[] = await providers.json();

  // find the provider that matches the url
  const provider = providersJson.find((provider) => {
    const normalizedUrl = new URL(
      normalizeUrl(url, {
        stripWWW: true,
      })
    ).hostname;
    const normalizedProviderUrl = new URL(
      normalizeUrl(provider.provider_url, {
        stripWWW: true,
      })
    ).hostname;
    return normalizedProviderUrl === normalizedUrl;
  });

  // if no provider is found, return a 404
  if (!provider) {
    return NextResponse.json(
      {
        error: "No provider found",
      },
      { status: 404 }
    );
  }

  // find the endpoint that matches the url
  const endpoint = provider.endpoints?.[0]?.url;

  // if no endpoint is found, return a 404
  if (!endpoint) {
    return NextResponse.json(
      {
        error: "No endpoint found",
      },
      { status: 404 }
    );
  }

  // fetch the oembed data
  const response = await fetch(
    `${endpoint}?format=json&url=${url}&maxwidth=${maxwidth}&maxheight=${maxheight}`
  );
  const json = await response.json();

  // return the oembed data
  return NextResponse.json(json);
}
