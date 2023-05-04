import InnerHTML from "dangerously-set-html-content";
import { useCallback, useEffect, useState } from "react";
import { OEmbedResponse } from "../types";

export interface EmbedProps {
  url: string;
  maxwidth?: string;
  maxheight?: string;
  placeholder?: React.ReactNode;
  providerService?: string;
}

export const Embed = (props: EmbedProps) => {
  const { url, maxwidth, maxheight, placeholder } = props;
  const [oembedData, setOEmbedData] = useState<OEmbedResponse | null>(null);

  const provider =
    props.providerService ?? `https://cardboard-web.vercel.app/api/v1`;

  const getOEmbedData = useCallback(
    async (
      provider: string,
      url: string,
      maxwidth?: string,
      maxheight?: string
    ) => {
      const res = await fetch(provider, {
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
    getOEmbedData(provider, url, maxwidth, maxheight);
  }, [provider, url, maxwidth, maxheight]);

  if (!oembedData?.html) {
    return <>{placeholder}</>;
  }

  return <InnerHTML html={oembedData.html} />;
};
