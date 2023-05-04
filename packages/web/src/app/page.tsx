"use client";

import { Cardboard } from "@sarim.garden/cardboard";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");

  return (
    <div className="flex flex-col justify-center gap-8">
      <input
        type="url"
        className="p-4 border rounded-md"
        placeholder="Your URL here"
        onChange={(e) => setUrl(e.target.value)}
      />
      {url && <Cardboard url={url} />}
    </div>
  );
}
