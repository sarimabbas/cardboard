import normalizeUrl from "normalize-url";

export const existingScriptOnElement = (
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

export const scriptSrcWithoutCacheBuster = (src: string) => {
  if (!src) {
    return src;
  }
  return normalizeUrl(src, {
    removeQueryParameters: ["cachebuster"],
    sortQueryParameters: true,
  });
};

export const runExistingRule = (script: HTMLScriptElement): boolean => {
  if (script.src.includes("platform.twitter.com/widgets.js")) {
    // re-run twitter widgets.js
    if ((window as any)?.twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
    return true;
  }

  return false;
};
