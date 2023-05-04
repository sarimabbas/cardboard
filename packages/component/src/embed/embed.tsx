import InnerHTML from "dangerously-set-html-content";
import { useCallback, useEffect, useState } from "react";
import { OEmbedResponse } from "../types";

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
      setLoading(true);
      const res = await fetch(provider, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, maxheight, maxwidth }),
      });
      const data = await res.json();
      setOEmbedData(data);
      setLoading(false);
    },
    []
  );

  // fetch oembed
  useEffect(() => {
    getOEmbedData(provider, url, maxwidth, maxheight);
  }, [provider, url, maxwidth, maxheight]);

  if (loading) {
    return <>{placeholder}</>;
  }

  if (!oembedData?.html) {
    return <>{error}</>;
  }

  return <InnerHTML html={oembedData.html} />;
};
