"use client";

import { Cardboard, CardboardProvider } from "@sarim.garden/cardboard";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);

  return (
    <div className="flex flex-col justify-center gap-8">
      <input
        type="url"
        className="p-4 border rounded-md"
        placeholder="Your URL here"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="p-4 border rounded-md"
        onClick={() => {
          if (url === "") {
            return;
          }
          setUrls([...urls, url]);
        }}
      >
        Add
      </button>
      <CardboardProvider>
        {urls.map((url) => (
          <Cardboard url={url} />
        ))}
      </CardboardProvider>
    </div>
  );
}
