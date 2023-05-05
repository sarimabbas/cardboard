"use client";

import { Cardboard, CardboardBox } from "@sarim.garden/cardboard";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);

  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="flex items-center gap-4">
        <input
          type="url"
          className="p-4 border rounded-md flex-1"
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
      </div>
      <CardboardBox />
      {urls.map((url, idx) => (
        <Cardboard
          url={url}
          key={`${idx}=${url}`}
          className="!rounded-lg !overflow-hidden w-fit"
        />
      ))}
    </div>
  );
}
