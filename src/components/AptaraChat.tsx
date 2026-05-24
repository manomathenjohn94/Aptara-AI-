import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CornerDownLeft, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

interface AptaraChatProps {
  onTriggerSimulatedQuery?: (topic: string) => void;
}

export default function AptaraChat({ onTriggerSimulatedQuery }: AptaraChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "model",
      content: "### [APTARA CORE OPERATIONAL]\nWelcome to Aptara Central Intelligence, developed and operated by **CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries)**.\n\nAsk me about:\n* **Sensor Fusion protocols** (unified satellite & seismic tracking)\n* **Environmental climate monitoring** (CO2 levels, biodiversity metrics)\n* **Infrastructure diagnostics** (global grid, scrubber arrays)\n* **Disaster management algorithms** (active crisis routing)\n* **SOD Deployment** (Smart Observer Device systems)\n\nStation standby. Enter query below.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText ? customText.trim() : inputValue.trim();
    if (!textToSend || isLoading) return;

    if (!customText) {
      setInputValue("");
    }
    setErrorStatus(null);

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history for the backend chat API
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      
      const modelMsg: Message = {
        id: Math.random().toString(),
        role: "model",
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Chat failure:", err);
      setErrorStatus(err.message || "Unable to reach Aptara core neural network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(undefined, prompt);
    if (onTriggerSimulatedQuery) {
      onTriggerSimulatedQuery(prompt);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        role: "model",
        content: "### [APTARA CORE RE-INDEXED]\nNeurolink established. Mainframe standing by. Input telemetry inquiries or SOD deployment parameters.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setErrorStatus(null);
  };

  return (
    <div id="aptara-chat-console" className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          <span className="font-mono text-xs text-slate-700 font-semibold uppercase tracking-wider">APTARA COGNITIVE CORE</span>
        </div>
        <button
          onClick={clearChat}
          className="p-1.5 text-slate-500 hover:text-blue-600 font-mono text-[10px] uppercase flex items-center gap-1 bg-white border border-slate-200 rounded hover:border-blue-500/30 hover:bg-blue-50/20 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Clear Core
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-xl px-4 py-3 border font-sans text-sm ${
              msg.role === "user"
                ? "bg-blue-50/40 border-blue-200/50 text-slate-800 italic"
                : "bg-slate-50/80 border-slate-200/80 text-slate-700"
            }`}>
              {/* Parse headers and item points simply to keep dependencies pristine */}
              <div className="prose prose-xs space-y-2 max-w-none">
                {msg.content.split("\n").map((line, idx) => {
                  if (line.startsWith("### ")) {
                    return <h4 key={idx} className="font-heading text-blue-600 font-bold text-xs uppercase tracking-wider mt-2 mb-1">{line.replace("### ", "")}</h4>;
                  }
                  if (line.startsWith("* ")) {
                    const formattedLine = line.replace("* ", "");
                    // Handle simple bold highlight **
                    const parts = formattedLine.split("**");
                    return (
                      <li key={idx} className="list-disc ml-4 text-xs text-slate-600 leading-relaxed">
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-blue-600 font-semibold">{p}</strong> : p)}
                      </li>
                    );
                  }
                  
                  // Default render with search for bold highlighting
                  const parts = line.split("**");
                  if (parts.length > 1) {
                    return (
                      <p key={idx} className="text-xs text-slate-600 leading-relaxed">
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-blue-600 font-semibold">{p}</strong> : p)}
                      </p>
                    );
                  }
                  
                  return <p key={idx} className="text-xs text-slate-600 leading-relaxed">{line}</p>;
                })}
              </div>
              <span className="block text-[9px] font-mono text-slate-400 mt-2 text-right">
                {msg.timestamp}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 block mt-1">APTARA is thinking...</span>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-205/80 rounded-lg text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-semibold block font-mono text-[10px] uppercase text-red-600">Core Exception</span>
              <span>{errorStatus}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-1.5">
        <button
          onClick={() => handleQuickPrompt("What is sensor fusion monitoring?")}
          className="px-2 py-1 text-[10px] font-mono text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/20 border border-slate-200 hover:border-blue-300 rounded transition-all cursor-pointer"
        >
          &quot;Sensor Fusion&quot;
        </button>
        <button
          onClick={() => handleQuickPrompt("Status report on Smart Observer Device (SOD) deployment")}
          className="px-2 py-1 text-[10px] font-mono text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/20 border border-slate-200 hover:border-blue-300 rounded transition-all cursor-pointer"
        >
          &quot;SOD Deployment&quot;
        </button>
        <button
          onClick={() => handleQuickPrompt("Review active disaster alerts")}
          className="px-2 py-1 text-[10px] font-mono text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/20 border border-slate-200 hover:border-blue-300 rounded transition-all cursor-pointer"
        >
          &quot;Active Disasters&quot;
        </button>
      </div>

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Transmit priority command or query to Aptara..."
          disabled={isLoading}
          className="flex-1 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-xs text-slate-800 font-sans outline-none placeholder:text-slate-400 disabled:opacity-55"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider">Send</span>
          <CornerDownLeft className="w-3 h-3 text-blue-100 opacity-60 hidden sm:inline" />
        </button>
      </form>
    </div>
  );
}
