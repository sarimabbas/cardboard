import { useCallback, useContext, useEffect, useState } from "react";
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
}

export const Embed = (props: EmbedProps) => {
  const { url, maxwidth, maxheight, placeholder, error } = props;
  const [loading, setLoading] = useState(true);
  const [oembedHtml, setOEmbedHtml] = useState<string>("");
  const { addScripts, providerService } = useContext(EmbedContext);

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

    // get all the scripts
    const scripts = oembedDoc.querySelectorAll("script");
    addScripts(Array.from(scripts));

    // set the html
    oembedDoc.querySelectorAll("script").forEach((script) => script.remove());
    setOEmbedHtml(oembedDoc.body.innerHTML);

    setLoading(false);
  }, [providerService, url, maxheight, maxwidth, addScripts]);

  useEffect(() => {
    getOEmbedData();
  }, [getOEmbedData]);

  if (loading) {
    return <>{placeholder}</>;
  }

  if (!oembedHtml || oembedHtml === "") {
    return <>{error}</>;
  }

  return <div dangerouslySetInnerHTML={{ __html: oembedHtml }} />;
};
