import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { EmbedProviderScriptsAtom } from "./provider";
import { useRef } from "react";

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
  // the provider to use e.g. https://cardboard-web.vercel.app/api/v1
  providerService?: string;
  // attempt to make the embed responsive
  responsive?: boolean;
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
    responsive,
  } = props;
  const [loading, setLoading] = useState(true);
  const setScripts = useSetAtom(EmbedProviderScriptsAtom);

  // use ref instead of state to avoid fallback to pre-embed html
  const ref = useRef<HTMLDivElement>(null);

  const getOEmbedData = useCallback(async () => {
    if (!url || !providerService || !ref.current) {
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
    ref.current.innerHTML = oembedDoc.body.innerHTML;

    // get all the scripts
    setScripts((prev) => [
      ...prev,
      ...Array.from(scripts).filter((s) => !prev.some((p) => p.isEqualNode(s))),
    ]);

    setLoading(false);
  }, [providerService, url, maxheight, maxwidth, setScripts, ref]);

  useEffect(() => {
    getOEmbedData();
  }, [getOEmbedData]);

  return (
    <div ref={ref} className={className}>
      {loading ? placeholder : null}
      {ref.current?.innerHTML ? null : error}
    </div>
  );
};
