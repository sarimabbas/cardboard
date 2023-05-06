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

export const resetElement = (element: HTMLElement) => {
  // reset margin
  element.style.margin = "0";
  // reset width
  element.style.width = "100%";
  element.style.maxWidth = "100%";
  // reset height
  element.style.maxHeight = "100%";
  element.style.height = "100%";
  // reset position to default
  element.style.position = "static";
};

export const fitChildToParent = (
  parent: React.RefObject<HTMLElement>,
  child: React.RefObject<HTMLElement>
) => {
  const parentWidth = parent.current?.getBoundingClientRect()?.width;
  const childWidth = child.current?.getBoundingClientRect()?.width;
  if (!parentWidth || !childWidth) {
    return;
  }
  const scale = parentWidth / childWidth;
  child.current.style.transformOrigin = "top left";
  child.current.style.transform = `scale(${scale})`;
};
