"use client";

import { useEffect, useState } from "react";

export function TypewriterHeading({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    // Initial delay for glitch effect
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50); // fast typing speed
      return () => clearInterval(interval);
    }, 200);

    return () => clearTimeout(startDelay);
  }, [text]);

  return (
    <h1 className={`${className} relative`}>
      {displayText}
      {isTyping && <span className="typewriter-cursor"></span>}
    </h1>
  );
}
