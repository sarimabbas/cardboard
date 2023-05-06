import normalizeUrl from "normalize-url";

export const existingScriptOnElement = (
  element: HTMLDivElement,
  script: HTMLScriptElement
) => {
  const scripts = Array.from(element.querySelectorAll("script"));
  return scripts.find((s) => {
    if (script.src) {
      return (
        scriptSrcWithoutCacheBuster(s.src) ===
        scriptSrcWithoutCacheBuster(script.src)
      );
    } else {
      return s.innerHTML === script.innerHTML;
    }
  });
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
  if (
    script.src.includes("platform.twitter.com/widgets.js") &&
    (window as any)?.twttr?.widgets
  ) {
    // re-run twitter widgets.js
    (window as any).twttr.widgets.load();
    return true;
  }

  return false;
};
