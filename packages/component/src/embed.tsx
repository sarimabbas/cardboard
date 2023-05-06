import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { EmbedContext } from "./provider";

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
  // attempt to make the embed responsive
  // forceFit?: boolean;
}

export const Embed = (props: EmbedProps) => {
  const { url, maxwidth, maxheight, placeholder, error, className } = props;

  const [loading, setLoading] = useState(true);
  const { runScripts, providerService } = useContext(EmbedContext);

  // use ref instead of state to avoid fallback to pre-embed html
  const parentRef = useRef<HTMLDivElement>(null);
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
    runScripts(Array.from(scripts));

    // set the html
    oembedDoc.querySelectorAll("script").forEach((script) => script.remove());
    ref.current.innerHTML = oembedDoc.body.innerHTML;

    setLoading(false);
  }, [providerService, url, maxheight, maxwidth, ref, runScripts]);

  useEffect(() => {
    getOEmbedData();
  }, [getOEmbedData]);

  return (
    <div ref={parentRef} className={className}>
      {loading ? placeholder : null}
      {ref.current?.innerHTML ? null : error}
      <div ref={ref} />
    </div>
  );
};
