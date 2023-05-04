import InnerHTML from "dangerously-set-html-content";
import { createContext, useCallback, useState } from "react";

interface IEmbedContext {
  scripts: HTMLScriptElement[];
  addScripts: (scripts: HTMLScriptElement[]) => void;
  removeScripts: (scripts: HTMLScriptElement[]) => void;
}

export const EmbedContext = createContext<IEmbedContext>({
  scripts: [],
  addScripts: () => {},
  removeScripts: () => {},
});

const useCreateEmbedContext = (): IEmbedContext => {
  const [scripts, setScripts] = useState<HTMLScriptElement[]>([]);

  const addScripts = useCallback((inputs: HTMLScriptElement[]) => {
    const toAdd = inputs.filter((input) => {
      const existsOnPage = window.document.querySelector(
        `script[src="${input.src}"]`
      );
      const existsInState = scripts.find((state) => state.src === input.src);
      return existsOnPage || existsInState;
    });
    setScripts((prev) => [...prev, ...toAdd]);
  }, []);

  const removeScripts = useCallback((inputs: HTMLScriptElement[]) => {
    setScripts((prev) =>
      prev.filter((s) => {
        return !inputs.find((i) => i.src === s.src);
      })
    );
  }, []);

  return { scripts, addScripts, removeScripts };
};

interface IEmbedProviderProps {
  children: React.ReactNode;
}

export const EmbedProvider = (props: IEmbedProviderProps) => {
  const { children } = props;
  const ctx = useCreateEmbedContext();
  const scripts = `<div>${ctx.scripts.map((s) => s.outerHTML).join("")}</div>`;

  return (
    <EmbedContext.Provider value={ctx}>
      {children}
      <InnerHTML html={scripts} />
    </EmbedContext.Provider>
  );
};
