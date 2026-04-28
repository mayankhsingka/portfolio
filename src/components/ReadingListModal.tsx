"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSystemAudio } from "@/hooks/useSystemAudio";
import { PORTFOLIO_DATA } from "@/data/portfolio";

interface ReadingListModalProps {
  onClose: () => void;
}

export function ReadingListModal({ onClose }: ReadingListModalProps) {
  const { playKeystroke, playSnap } = useSystemAudio();
  const [typedContent, setTypedContent] = useState("");
  const [phase, setPhase] = useState<"decrypting" | "reading">("decrypting");

  useEffect(() => {
    playSnap();
    const rawContent = (PORTFOLIO_DATA.fileSystem as any)["reading_list.dat"];
    
    // Quick "decryption" sequence before typing
    const decryptTimeout = setTimeout(() => {
      setPhase("reading");
      let charIdx = 0;
      
      const typeChar = () => {
        if (charIdx <= rawContent.length) {
          setTypedContent(rawContent.substring(0, charIdx));
          if (rawContent[charIdx] !== " ") playKeystroke();
          charIdx++;
          setTimeout(typeChar, 10 + Math.random() * 20);
        }
      };
      
      typeChar();
    }, 800);

    return () => clearTimeout(decryptTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border-4 border-black text-black font-mono shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col"
      >
        <div className="bg-black text-white p-2 text-xs font-bold uppercase tracking-widest flex justify-between items-center">
          <span>READING_LIST.DAT</span>
          <button onClick={onClose} className="hover:text-red-500">[X]</button>
        </div>
        
        <div className="p-6 h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed relative">
          {phase === "decrypting" ? (
            <div className="text-red-600 animate-pulse font-bold mt-4">
              [SYSTEM] Decrypting operator databank... Please wait.
            </div>
          ) : (
            <>
              <div className="opacity-80">
                {typedContent}
                <span className="inline-block w-2 h-4 bg-black ml-1 animate-pulse align-middle" />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
