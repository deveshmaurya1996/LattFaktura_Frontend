import { useState, useEffect, useRef } from "react";

export function useResizeBackground() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const bgRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight + 60;
      setWindowHeight(newHeight);
      if (bgRef.current) {
        bgRef.current.style.height = `${newHeight}px`;
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return bgRef;
}
