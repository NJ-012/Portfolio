// components/sections/TerminalMode.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState } from '@/providers/GlobalStateProvider';

const TerminalMode = () => {
  const { isCoreOsMode, setIsCoreOsMode } = useGlobalState();
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ type: 'user' | 'output'; text: string }>>([
    { type: 'output', text: 'Welcome to Niyati Joshi\'s Core OS. Type "help" for commands.' },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Table representation mapping platform metrics
  const projectsTable = `
+----------------------+----------------------------------------------------------+
| PLATFORM ARCHITECT   | INFRASTRUCTURE / INTEGRATED CORE STACK                   |
+----------------------+----------------------------------------------------------+
| Tech Island          | Next.js, TypeScript, PostgreSQL, Prisma, Node.js         |
| ShopSphere           | Java, Spring Boot, MySQL, Hibernate, JWT                 |
| Resume Alchemist     | FastAPI, Python, NLP, Docker                             |
| AURA AI              | Python, Scikit-Learn, FastAPI                            |
+----------------------+----------------------------------------------------------+
`;

  const executeCommand = useCallback((command: string) => {
    if (isStreaming) return;
    const trimmedCommand = command.trim().toLowerCase();
    const newEntry = { type: 'user', text: `> ${command}` } as const;

    setHistory((prev) => [...prev, newEntry]);

    if (trimmedCommand === 'help') {
      setHistory((prev) => [
        ...prev,
        { 
          type: 'output', 
          text: 'Available commands:\n  help       - Show this help message\n  clear      - Clear the terminal screen\n  projects   - Display platform architecture table\n  experience - Clear & stream internship logging telemetry\n  exit       - Return to GUI Mode' 
        },
      ]);
    } else if (trimmedCommand === 'clear') {
      setHistory([{ type: 'output', text: 'Terminal cleared. Type "help" for commands.' }]);
    } else if (trimmedCommand === 'projects') {
      setHistory((prev) => [...prev, { type: 'output', text: projectsTable }]);
    } else if (trimmedCommand === 'experience') {
      // Clear panel first
      setHistory([]);
      setIsStreaming(true);

      const bootSequence = [
        "[BOOT]: INITIALIZING SUBSYSTEM: EXPERIENCE_STREAM...",
        "[BOOT]: RETRIEVING ARCHIVAL CADENCE FROM SECURE DATABASE...",
        "[OK]  : ESTABLISHED SECURE HANDSHAKE // PING: 8.2ms",
        "",
        "==========================================================================",
        " EMPLOYER : OURANOS ROBOTICS PVT. LTD.",
        " ROLE     : WEB DEVELOPMENT INTERN // DURATION: JUNE 2026 - PRESENT",
        "--------------------------------------------------------------------------",
        " [LOG_01]: Building responsive Agri-IoT product interfaces using",
        "           production-grade frameworks and scalable API architectures.",
        " [LOG_02]: Shipping high-throughput features across iterative CI/CD",
        "           pipelines through cross-functional collaboration.",
        "==========================================================================",
        "",
        "==========================================================================",
        " EMPLOYER : THIRD ESSENTIALS",
        " ROLE     : SOFTWARE ENGINEERING INTERN // DURATION: MAY 2026 - PRESENT",
        "--------------------------------------------------------------------------",
        " [LOG_01]: Integrating low-latency real-time telemetry protocols for",
        "           distributed sensory arrays.",
        " [LOG_02]: Implementing automated unit testing modules and reducing",
        "           execution overhead inside core services.",
        "==========================================================================",
        "",
        "[BOOT]: STREAMING COMPLETED. LOG_INTEGRITY: 100% // READY // STABLE."
      ];

      let currentLine = 0;
      const streamLines = () => {
        if (currentLine < bootSequence.length) {
          setHistory((prev) => [...prev, { type: 'output', text: bootSequence[currentLine] }]);
          currentLine++;
          setTimeout(streamLines, 60 + Math.random() * 50); // fast dynamic streaming speeds
        } else {
          setIsStreaming(false);
          // Auto-refocus input
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
          }, 35);
        }
      };

      setTimeout(streamLines, 100);
    } else if (trimmedCommand === 'exit') {
      setIsCoreOsMode(false); // Transition back to GUI mode
      setHistory((prev) => [...prev, { type: 'output', text: 'Exiting Core OS...' }]);
    } else {
      setHistory((prev) => [...prev, { type: 'output', text: `Command not found: "${command}"` }]);
    }
    setInput(''); // Clear input after execution
  }, [setIsCoreOsMode, isStreaming]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    }
    // Handle Ctrl+C or other potential shortcuts if needed
  };

  // Auto-focus the input when the terminal becomes active
  useEffect(() => {
    if (isCoreOsMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCoreOsMode]);

  // Scroll to bottom logic
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Framer Motion variants for the terminal container
  const terminalVariants = {
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
  };

  return (
    <AnimatePresence>
      {isCoreOsMode && (
        <motion.div
          ref={terminalRef}
          key="terminal-mode"
          variants={terminalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-8 font-jetbrains-mono text-lg leading-relaxed backdrop-blur-sm"
          style={{
            // Ensure backdrop-filter works if needed, may require Tailwind config extension
            // backdropFilter: 'blur(8px)', // Example
          }}
        >
          <div className="w-full max-w-4xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {history.map((line, index) => (
              <p key={index} className={`whitespace-pre-wrap ${line.type === 'user' ? 'text-neon-emerald' : 'text-gray-300'}`}>
                {line.text}
              </p>
            ))}
            <div className="flex items-center">
              <span className="mr-2 text-neon-emerald">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                className="w-full flex-grow bg-transparent font-jetbrains-mono text-lg text-white focus:outline-none disabled:opacity-50"
                autoFocus
                spellCheck="false"
              />
            </div>
          </div>
           {/* Simple Exit Button for fallback */}
           <button
            onClick={() => setIsCoreOsMode(false)}
            className="absolute bottom-4 right-4 text-gray-500 hover:text-white transition-colors duration-200"
           >
             Exit (ESC)
           </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalMode;