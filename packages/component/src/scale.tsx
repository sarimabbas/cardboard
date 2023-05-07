import { useRef } from "react";
import { useMutationObserver, useOnWindowResize } from "rooks";

interface AutoScaleProps {
  children: React.ReactNode;
}

const scale = (
  parentRef: React.RefObject<HTMLElement>,
  childRef: React.RefObject<HTMLElement>
) => {
  if (parentRef.current && childRef.current) {
    const parentWidth = parentRef.current.getBoundingClientRect().width;
    const childWidth = getChildMaxWidth(childRef.current, true);
    const scale = parentWidth / childWidth;
    console.log({ parentWidth, childWidth, scale });
    childRef.current.style.transform = `scale(${scale})`;
    childRef.current.style.transformOrigin = "top left";
    // todo: reduce height to fit as screen is scaled
    parentRef.current.style.height = `${
      parentRef.current.getBoundingClientRect().height * scale
    }`;
  }
};

function getChildMaxWidth(element: HTMLElement, searchIframe: boolean): number {
  // Initialize the maximum width to 0
  let maxWidth = 0;

  // Get all child elements of the current element
  const children = element.children;

  // Loop through each child element
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;

    // Check if the child element is an <iframe> and we're searching for one
    const isIframe = searchIframe && child.tagName === "IFRAME";

    // Get the width of the child element
    const width = child.offsetWidth;

    // Update the maximum width if this child element is wider
    if (width > maxWidth && (!searchIframe || isIframe)) {
      maxWidth = width;
    }

    // Recursively call this function on the child element
    const childMaxWidth = getChildMaxWidth(child, searchIframe || isIframe);

    // Update the maximum width if the child element is wider
    if (childMaxWidth > maxWidth) {
      maxWidth = childMaxWidth;
    }
  }

  // Return the maximum width of all child elements
  return maxWidth;
}

export const AutoScale = (props: AutoScaleProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    scale(parentRef, childRef);
  });

  useMutationObserver(
    childRef,
    () => {
      scale(parentRef, childRef);
    },
    {
      subtree: true,
      childList: true,
    }
  );

  return (
    <div ref={parentRef} className="w-full">
      <div ref={childRef}>{props.children}</div>
    </div>
  );
};
