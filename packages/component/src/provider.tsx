import { atom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { existingScriptOnElement, runExistingRule } from "./scripts";

export const EmbedProviderScriptsAtom = atom<HTMLScriptElement[]>([]);

export const EmbedProvider = () => {
  const scripts = useAtomValue(EmbedProviderScriptsAtom);
  const ref = useRef<HTMLDivElement>(null);

  const runScripts = useCallback(async () => {
    if (!ref.current) {
      return;
    }

    scripts.forEach((script) => {
      // create script tag
      const scriptTag = document.createElement("script");
      if (script.src) {
        scriptTag.src = script.src;
        scriptTag.async = true;
        scriptTag.defer = true;
      } else {
        scriptTag.innerHTML = script.text;
      }

      // if no existing script, just append to DOM to run it
      const existingScript = existingScriptOnElement(ref.current!, script);
      if (!existingScript) {
        ref.current?.appendChild(scriptTag);
        return;
      }

      // run existing script based on rule
      const didRun = runExistingRule(existingScript);
      if (didRun) {
        return;
      }

      // replace existing script with cachebusted version to force reload
      existingScript.remove();
      if (script.src) {
        scriptTag.src = scriptTag.src + "?cachebuster=" + Date.now();
      } else {
        scriptTag.innerHTML =
          scriptTag.innerHTML + "/* cachebuster=" + Date.now() + " */";
      }
      ref.current?.appendChild(scriptTag);
    });
  }, [scripts]);

  useEffect(() => {
    runScripts();
  }, [runScripts]);

  return <div ref={ref} />;
};
