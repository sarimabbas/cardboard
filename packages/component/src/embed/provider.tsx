import normalizeUrl from "normalize-url";
import { createContext, useCallback } from "react";

export interface IEmbedContext {
  // add scripts to the page
  addScripts: (scripts: HTMLScriptElement[]) => void;
  // remove scripts from the page
  removeScripts: (scripts: HTMLScriptElement[]) => void;
  // the service to use for oembed
  providerService: string;
}

export const EmbedContext = createContext<IEmbedContext>({
  addScripts: () => {},
  removeScripts: () => {},
  providerService: "",
});

const scriptSrcWithoutCacheBuster = (src: string) => {
  if (!src) {
    return src;
  }
  return normalizeUrl(src, {
    removeQueryParameters: ["cachebuster"],
    sortQueryParameters: true,
  });
};

interface IUseCreateEmbedContextProps {
  // the service to use for oembed
  providerService?: string;
}

// this hook is used to create the context
const useCreateEmbedContext = (
  props: IUseCreateEmbedContextProps
): IEmbedContext => {
  const { providerService } = props;

  // implementation of addScripts
  const addScripts = useCallback((inputs: HTMLScriptElement[]) => {
    const existingScripts = Array.from(
      document.body.querySelectorAll("script")
    );
    inputs.forEach((input) => {
      const existingScript = existingScripts.find((s) => s.isEqualNode(input));
      if (existingScript) {
        existingScript.remove();
        setTimeout(() => {
          document.body.appendChild(input);
        }, 80);
      } else {
        document.body.appendChild(input);
      }
    });
  }, []);

  // implementation of removeScripts
  const removeScripts = useCallback((inputs: HTMLScriptElement[]) => {
    const existingScripts = Array.from(
      document.body.querySelectorAll("script")
    );
    inputs.forEach((input) => {
      const existingScript = existingScripts.find((s) => s.isEqualNode(input));
      if (existingScript) {
        existingScript.remove();
      }
    });
  }, []);

  return {
    addScripts,
    removeScripts,
    providerService:
      providerService ?? "https://cardboard-web.vercel.app/api/v1",
  };
};

interface IEmbedProviderProps {
  // the children to render
  children: React.ReactNode;
  // the service to use for oembed
  // e.g. https://cardboard-web.vercel.app/api/v1
  providerService?: string;
}

export const EmbedProvider = (props: IEmbedProviderProps) => {
  const { providerService, children } = props;
  const ctx = useCreateEmbedContext({ providerService });

  return <EmbedContext.Provider value={ctx}>{children}</EmbedContext.Provider>;
};
