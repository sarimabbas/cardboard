import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { EmbedProviderScriptsAtom } from "./provider";

export interface EmbedProps {
  // the url to embed
  url: string;
  // the max width of the embed
  maxwidth?: string;
  // the max height of the embed
  maxheight?: string;
  // the placeholder to show while loading
  placeholder?: React.ReactNode;
  // the error to show if the embed fails
  error?: React.ReactNode;
  // classes to apply to the embed
  className?: string;
  // the provider to use
  providerService?: string;
}

export const Embed = (props: EmbedProps) => {
  const {
    url,
    maxwidth,
    maxheight,
    placeholder,
    error,
    className,
    providerService = "https://cardboard-web.vercel.app/api/v1",
  } = props;
  const [loading, setLoading] = useState(true);
  const [oembedHtml, setOEmbedHtml] = useState<string>("");
  const setScripts = useSetAtom(EmbedProviderScriptsAtom);

  const getOEmbedData = useCallback(async () => {
    if (!url || !providerService) {
      return;
    }

    setLoading(true);

    // fetch the oembed data
    const res = await fetch(providerService, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, maxheight, maxwidth }),
    });
    const data = await res.json();

    // parse the html from the oembed response
    const parser = new DOMParser();
    const oembedDoc = parser.parseFromString(data.html, "text/html");

    // set scripts
    const scripts: NodeListOf<HTMLScriptElement> =
      oembedDoc.querySelectorAll("script");
    setScripts((prev) => [
      ...prev,
      ...Array.from(scripts).filter((s) => !prev.some((p) => p.isEqualNode(s))),
    ]);

    // set the html
    oembedDoc.querySelectorAll("script").forEach((script) => script.remove());
    setOEmbedHtml(oembedDoc.body.innerHTML);

    // get all the scripts
    setScripts((prev) => [
      ...prev,
      ...Array.from(scripts).filter((s) => !prev.some((p) => p.isEqualNode(s))),
    ]);

    setLoading(false);
  }, [providerService, url, maxheight, maxwidth, setScripts]);

  useEffect(() => {
    getOEmbedData();
  }, [getOEmbedData]);

  if (loading) {
    return <>{placeholder}</>;
  }

  if (!oembedHtml || oembedHtml === "") {
    return <>{error}</>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: oembedHtml }}
      className={className}
    />
  );
};
