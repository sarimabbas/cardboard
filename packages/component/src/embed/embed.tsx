import { useCallback, useContext, useEffect, useState } from "react";
import { EmbedContext } from "./provider";

export interface EmbedProps {
  url: string;
  maxwidth?: string;
  maxheight?: string;
  placeholder?: React.ReactNode;
  error?: React.ReactNode;
  providerService?: string;
}

export const Embed = (props: EmbedProps) => {
  const { url, maxwidth, maxheight, placeholder, error } = props;
  const [loading, setLoading] = useState(true);
  const [oembedHtml, setOEmbedHtml] = useState<string>("");
  const { addScripts } = useContext(EmbedContext);

  const provider =
    props.providerService ?? `https://cardboard-web.vercel.app/api/v1`;

  const getOEmbedData = useCallback(async () => {
    if (!url) {
      return;
    }

    setLoading(true);

    // fetch the oembed data
    const res = await fetch(provider, {
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
    // oembedDoc.querySelectorAll("script").forEach((script) => script.remove());
    setOEmbedHtml(oembedDoc.body.innerHTML);

    setLoading(false);
  }, [provider, url, maxheight, maxwidth, addScripts]);

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
