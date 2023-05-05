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
      const scriptTag = document.createElement("script");

      // create script tag
      if (script.src) {
        scriptTag.src = script.src;
        scriptTag.async = true;
        scriptTag.defer = true;
      } else {
        scriptTag.innerHTML = script.text;
      }

      // check existing
      const existingScript = existingScriptOnElement(ref.current!, script);
      if (existingScript) {
        existingScript.remove();
        if (script.src) {
          scriptTag.src = scriptTag.src + "?cachebuster=" + Date.now();
        } else {
          scriptTag.innerHTML =
            scriptTag.innerHTML + "/* cachebuster=" + Date.now() + " */";
        }
      }

      // append script tag
      ref.current?.appendChild(scriptTag);
    });
  }, [scripts]);

  useEffect(() => {
    runScripts();
  }, [runScripts]);

  return <div ref={ref} />;
};
