import InnerHTML from "dangerously-set-html-content";
import { createContext, useCallback, useState } from "react";

export interface IEmbedContext {
  // a deduped list of scripts to add to the page
  scripts: HTMLScriptElement[];
  // add scripts to the page
  addScripts: (scripts: HTMLScriptElement[]) => void;
  // remove scripts from the page
  removeScripts: (scripts: HTMLScriptElement[]) => void;
  // the service to use for oembed
  providerService: string;
}

export const EmbedContext = createContext<IEmbedContext>({
  scripts: [],
  addScripts: () => {},
  removeScripts: () => {},
  providerService: "",
});

interface IUseCreateEmbedContextProps {
  // the service to use for oembed
  providerService?: string;
}

// this hook is used to create the context
const useCreateEmbedContext = (
  props: IUseCreateEmbedContextProps
): IEmbedContext => {
  const { providerService } = props;
  const [scripts, setScripts] = useState<HTMLScriptElement[]>([]);

  // implementation of addScripts
  const addScripts = useCallback((inputs: HTMLScriptElement[]) => {
    const toAdd = inputs.filter((input) => {
      const existsOnPage = window.document.querySelector(
        `script[src="${input.src}"]`
      );
      const existsInState = scripts.find((state) => state.src === input.src);
      console.log({ existsInState, existsOnPage });
      return !(existsOnPage || existsInState);
    });
    console.log({ "settinf scripts": toAdd, inputs: inputs });
    setScripts((prev) => [...prev, ...toAdd]);
  }, []);

  // implementation of removeScripts
  const removeScripts = useCallback((inputs: HTMLScriptElement[]) => {
    setScripts((prev) =>
      prev.filter((s) => {
        return !inputs.find((i) => i.src === s.src);
      })
    );
  }, []);

  return {
    scripts,
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
  const scripts = `<div>${ctx.scripts.map((s) => s.outerHTML).join("")}</div>`;

  return (
    <EmbedContext.Provider value={ctx}>
      {children}
      <InnerHTML html={scripts} key={ctx.scripts.map((s) => s.src).join(",")} />
    </EmbedContext.Provider>
  );
};
