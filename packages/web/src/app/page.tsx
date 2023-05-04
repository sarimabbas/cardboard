"use client";

import { Cardboard, CardboardProvider } from "@sarim.garden/cardboard";
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
      <CardboardProvider>
        <Cardboard url={url} providerService="/api/v1" />
      </CardboardProvider>
    </div>
  );
}
