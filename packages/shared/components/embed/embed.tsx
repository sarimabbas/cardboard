import { useCallback, useEffect, useState } from "react";
import { OEmbedResponse } from "../types";

const provider = process.env.EMBED_PROVIDER ?? "http://localhost:3000/api/v1";

interface EmbedProps {
  url: string;
  maxwidth?: string;
  maxheight?: string;
}

export const Embed = (props: EmbedProps) => {
  const { url, maxwidth, maxheight } = props;
  const [oembedData, setOEmbedData] = useState<OEmbedResponse | null>(null);

  const getOEmbedData = useCallback(
    async (url: string, maxwidth?: string, maxheight?: string) => {
      const res = await fetch(`${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, maxheight, maxwidth }),
      });
      const data = await res.json();
      setOEmbedData(data);
    },
    []
  );

  // fetch oembed
  useEffect(() => {
    getOEmbedData(url, maxwidth, maxheight);
  }, [url, maxwidth, maxheight]);

  if (!oembedData) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: oembedData.html }} />;
};
