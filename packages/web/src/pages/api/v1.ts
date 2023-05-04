import { OEmbedProvider } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import normalizeUrl from "normalize-url";
import cors from "nextjs-cors";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  const { url, maxheight, maxwidth } = await req.body;

  // find the oembed provider
  const providers = await fetch("https://oembed.com/providers.json");
  const providersJson: OEmbedProvider[] = await providers.json();

  // find the provider that matches the url
  const normalizedUrl = new URL(
    normalizeUrl(url, {
      stripWWW: true,
    })
  ).hostname;
  const provider = providersJson.find((provider) => {
    const normalizedProviderUrl = new URL(
      normalizeUrl(provider.provider_url, {
        stripWWW: true,
      })
    ).hostname;
    return normalizedProviderUrl === normalizedUrl;
  });

  // if no provider is found, return a 404
  if (!provider) {
    return res.status(404).json({
      error: "No provider found",
    });
  }

  // find the endpoint that matches the url
  const endpoint = provider.endpoints?.[0]?.url;

  // if no endpoint is found, return a 404
  if (!endpoint) {
    return res.status(404).json({
      error: "No endpoint found",
    });
  }

  const fetchThisURL = new URL(endpoint);
  fetchThisURL.searchParams.set("format", "json");
  fetchThisURL.searchParams.set("url", url);
  if (maxwidth) {
    fetchThisURL.searchParams.set("maxwidth", maxwidth);
  }
  if (maxheight) {
    fetchThisURL.searchParams.set("maxheight", maxheight);
  }

  // fetch the oembed data
  const response = await fetch(fetchThisURL);
  const json = await response.json();

  // return the oembed data
  return res.status(200).json(json);
};

export default handler;
