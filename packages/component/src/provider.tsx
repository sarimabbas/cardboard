import { createContext, useCallback, useRef } from "react";
import { existingScriptOnElement, runExistingRule } from "./scripts";

interface IEmbedContext {
  // the provider to use e.g. https://cardboard-web.vercel.app/api/v1
  providerService: string;
  // run scripts for the embed
  runScripts: (scripts: HTMLScriptElement[]) => void;
}

export const EmbedContext = createContext<IEmbedContext>({
  providerService: "",
  runScripts: () => {},
});

interface EmbedProviderProps {
  providerService?: string;
  children: React.ReactNode;
}

export const EmbedProvider = (props: EmbedProviderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const runScripts = useCallback(
    async (inputScripts: HTMLScriptElement[]) => {
      if (!ref.current) {
        return;
      }

      inputScripts.forEach((s) => {
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
    <EmbedContext.Provider
      value={{
        runScripts,
        providerService:
          props.providerService ?? "https://cardboard-web.vercel.app/api/v1",
      }}
    >
      {props.children}
      <div ref={ref} />
    </EmbedContext.Provider>
  );
};
