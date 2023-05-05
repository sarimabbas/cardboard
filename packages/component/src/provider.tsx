import { atom, useAtomValue } from "jotai";
import normalizeUrl from "normalize-url";
import { useCallback, useEffect, useRef } from "react";

const scriptSrcWithoutCacheBuster = (src: string) => {
  if (!src) {
    return src;
  }
  return normalizeUrl(src, {
    removeQueryParameters: ["cachebuster"],
    sortQueryParameters: true,
  });
};

export const EmbedProviderScriptsAtom = atom<HTMLScriptElement[]>([]);

const existingScriptOnElement = (
  element: HTMLDivElement,
  script: HTMLScriptElement
) => {
  const scripts = element.querySelectorAll("script");
  for (const existingScript of scripts) {
    if (
      existingScript.src &&
      scriptSrcWithoutCacheBuster(existingScript.src) ===
        scriptSrcWithoutCacheBuster(script.src)
    ) {
      return existingScript;
    }
    if (existingScript.innerHTML === script.innerHTML) {
      return existingScript;
    }
  }
  return undefined;
};

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

const runExistingRule = (script: HTMLScriptElement): boolean => {
  if (script.src.includes("platform.twitter.com/widgets.js")) {
    // re-run twitter widgets.js
    if ((window as any)?.twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
    return true;
  }

  return false;
};
