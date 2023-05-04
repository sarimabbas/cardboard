import Image from "next/image";
import { Inter } from "next/font/google";
import { Cardboard } from "@sarim.garden/cardboard";

export default function Home() {
  return (
    <main>
      <Cardboard url="https://twitter.com/jack/status/20" />
    </main>
  );
}
