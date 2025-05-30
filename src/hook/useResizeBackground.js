import { useState, useEffect, useRef } from "react";

export function useResizeBackground() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const bgRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight + 150;
      setWindowHeight(newHeight);
      if (bgRef.current) {
        bgRef.current.style.height = `${newHeight}px`;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return bgRef;
}
