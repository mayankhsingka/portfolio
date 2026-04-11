"use client";

import { useState, useEffect } from "react";

const HEX_CHARS = "0123456789ABCDEF";

export function useScrambleText(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    // We update text if props change
    if (!isDecrypting) {
      setDisplayText(originalText);
    }
  }, [originalText, isDecrypting]);

  useEffect(() => {
    const handleDecrypt = () => {
      // Instantly turn into pure HEX string when event fires
      let pureHex = "";
      for (let i = 0; i < originalText.length; i++) {
        pureHex += originalText[i] === " " ? " " : HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
      }
      setDisplayText(pureHex);
      
      // Add a tiny delay before it starts solving itself to create suspense
      setTimeout(() => {
        setIsDecrypting(true);
      }, 500);
    };

    window.addEventListener("system-decrypt", handleDecrypt);
    return () => window.removeEventListener("system-decrypt", handleDecrypt);
  }, [originalText]);

  useEffect(() => {
    if (!isDecrypting) return;

    const length = originalText.length;
    let iterations = 0;
    
    // Base the duration on string length so short strings don't solve instantly and long strings don't take forever
    // By giving it a fixed MAX_ITERATIONS, they all solve roughly simultaneously across the DOM
    const MAX_ITERATIONS = 60; // ~1 second on a 60fps monitor

    let animationFrameId: number;

    const decryptLoop = () => {
      let result = "";
      for (let i = 0; i < length; i++) {
        // Matrix style: Sweep from left to right as iterations grow
        if (i < (iterations / MAX_ITERATIONS) * length) {
            result += originalText[i];
        } else {
            // Keep scrambling the unresolved characters
            if (originalText[i] === " ") {
                result += " ";
            } else {
                result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
            }
        }
      }
      
      setDisplayText(result);

      // Slower sweep = more Matrix feel
      iterations += 0.8; 

      if (iterations >= MAX_ITERATIONS) {
        setDisplayText(originalText);
        setIsDecrypting(false);
        cancelAnimationFrame(animationFrameId);
      } else {
        // Use a slight throttle to make the matrix text readable rather than an imperceptible blur
        // Doing it every frame is too smooth. We'll do it every frame but the visual jump is nice
        animationFrameId = requestAnimationFrame(decryptLoop);
      }
    };

    animationFrameId = requestAnimationFrame(decryptLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDecrypting, originalText]);

  return displayText;
}
