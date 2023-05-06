import { createContext, useCallback, useRef } from "react";
import { existingScriptOnElement, runExistingRule } from "./scripts";
import { DOMSet } from "./set";

interface IEmbedContext {
  runScripts: (scripts: HTMLScriptElement[]) => void;
}

export const EmbedContext = createContext<IEmbedContext>({
  runScripts: () => {},
});

// how many times a script has been added
const scriptsCache = new DOMSet<HTMLScriptElement>();

interface EmbedProviderProps {
  children: React.ReactNode;
}

export const EmbedProvider = (props: EmbedProviderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const runScripts = useCallback(
    async (inputScripts: HTMLScriptElement[]) => {
      if (!ref.current) {
        return;
      }

      // add scripts to cache
      inputScripts.forEach((s) => {
        scriptsCache.add(s);
      });

      scriptsCache.forEach((s) => {
        console.log("running script", s);

        // create script tag
        const scriptTag = document.createElement("script");
        if (s.src) {
          scriptTag.src = s.src;
          scriptTag.async = true;
          scriptTag.defer = true;
        } else {
          scriptTag.innerHTML = s.text;
        }

        // if no existing script, just append to DOM to run it
        const existingScript = existingScriptOnElement(ref.current!, s);
        if (!existingScript) {
          console.log("no existing script, appending");
          ref.current?.appendChild(scriptTag);
          return;
        }

        // run existing script based on rule
        const didRun = runExistingRule(existingScript);
        if (didRun) {
          console.log(
            "existing script ran from rule, skipping: ",
            existingScript
          );
          return;
        }

        // replace existing script with cachebusted version to force reload
        existingScript.remove();
        console.log("existing script removed: ", existingScript);
        if (s.src) {
          scriptTag.src = scriptTag.src + "?cachebuster=" + Date.now();
        } else {
          scriptTag.innerHTML =
            scriptTag.innerHTML + "/* cachebuster=" + Date.now() + " */";
        }
        ref.current?.appendChild(scriptTag);
      });
    },
    [ref]
  );

  return (
    <EmbedContext.Provider value={{ runScripts }}>
      {props.children}
      <div ref={ref} />
    </EmbedContext.Provider>
  );
};
