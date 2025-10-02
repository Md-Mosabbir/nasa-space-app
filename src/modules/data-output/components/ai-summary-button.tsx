"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getLastAnalyseResponse,
  getAiChatHistory,
  setAiChatHistory,
  appendAiChatHistory,
  getAiChatCount,
  incrementAiChatCount,
  getAiInitialSent,
  setAiInitialSent,
} from "@/lib/analysis-store";

interface AISummaryButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

function getApiUrl(path: string) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:8000${path}`;
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}${path}`;
}

function pickReplyField(obj: unknown): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const rec = obj as Record<string, unknown>;
  const candidate = rec.reply ?? rec.content ?? rec.answer ?? rec.text;
  return typeof candidate === "string" ? candidate : undefined;
}

function extractAssistantText(raw: unknown): string {
  if (typeof raw === "string") {
    try {
      const parsed: unknown = JSON.parse(raw);
      const picked = pickReplyField(parsed);
      if (picked !== undefined) return picked;
    } catch {}
    return raw;
  }
  const picked = pickReplyField(raw);
  if (picked !== undefined) return picked;
  try {
    return JSON.stringify(raw);
  } catch {
    return String(raw ?? "");
  }
}

async function postAsk(payload: {
  analyzed_data: unknown;
  user_message?: string;
}) {
  const res = await fetch(getApiUrl("/ai/ask"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  try {
    const j: unknown = await res.json();
    return extractAssistantText(j);
  } catch {
    const t = await res.text();
    if (!t) return "";
    return extractAssistantText(t);
  }
}

export function AISummaryButton({
  label = "Summarise with AI",
  onClick,
  className,
}: AISummaryButtonProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: "Hi! I’m your AI assistant. Ask me to summarise your data.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const initialSentRef = React.useRef<boolean>(getAiInitialSent());

  React.useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, open]);

  const chatCount = getAiChatCount();
  const disabledByLimit = chatCount >= 15;

  const buildAnalyzedData = () => {
    const resp = getLastAnalyseResponse();
    if (!resp || typeof resp !== "object") return resp;
    const { graphs, ...rest } = resp as Record<string, unknown>;
    return rest;
  };

  const handleFirstOpenSend = async () => {
    // Guard both by store flag and local ref to avoid any duplicate sends
    if (initialSentRef.current || getAiInitialSent()) return;
    const analyzed = buildAnalyzedData();
    try {
      setSending(true);
      setError("");
      const assistantText = await postAsk({ analyzed_data: analyzed });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText || "(no content)" },
      ]);
      appendAiChatHistory(`Assistant: ${assistantText}`);
      setAiInitialSent(true);
      initialSentRef.current = true;
    } catch (e) {
      setError("Sorry, I couldn’t process that just now. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn’t process that just now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleButtonClick = async () => {
    onClick?.();
    if (!isMounted) {
      setIsMounted(true);
      setOpen(true);
      await handleFirstOpenSend();
    } else {
      setOpen((prev) => !prev);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    if (getAiChatCount() >= 15) return;
    setSending(true);
    setError("");

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    const history = getAiChatHistory();
    const combined = history
      ? `${history}\nUser: ${trimmed}`
      : `User: ${trimmed}`;

    const analyzed = buildAnalyzedData();

    try {
      const assistantText = await postAsk({
        analyzed_data: analyzed,
        user_message: combined,
      });
      incrementAiChatCount();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText || "(no content)" },
      ]);
      const newHistory = `${combined}\nAssistant: ${assistantText}`;
      setAiChatHistory(newHistory);
    } catch (e) {
      setError("Sorry, please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={
          `relative inline-flex items-center justify-center px-10 py-5 rounded-full text-white text-xl font-semibold ` +
          `overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-fuchsia-400 ` +
          `transition-transform duration-200 active:scale-95 ` +
          (className ?? "")
        }
        style={{
          background: "linear-gradient(135deg, #ff7a18, #af39ff)",
        }}
        disabled={disabledByLimit}
        aria-disabled={disabledByLimit}
        title={disabledByLimit ? "Chat limit reached (15)." : undefined}
      >
        <span className="relative z-10">{label}</span>
        <span
          aria-hidden
          className="absolute inset-0 animate-[pulseGradient_4s_ease_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,255,255,0.12) 0%, transparent 25%, rgba(255,255,255,0.12) 50%, transparent 75%, rgba(255,255,255,0.12) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        <style jsx>{`
          @keyframes pulseGradient {
            0% {
              opacity: 0.7;
              filter: saturate(1);
            }
            50% {
              opacity: 1;
              filter: saturate(1.2);
            }
            100% {
              opacity: 0.7;
              filter: saturate(1);
            }
          }
        `}</style>
      </button>

      {isMounted && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 bg-black text-zinc-100 overflow-hidden"
          >
            <SheetHeader className="p-4 border-b border-zinc-800">
              <SheetTitle>AI Summary</SheetTitle>
            </SheetHeader>

            <div className="flex h-full min-h-0 flex-col">
              <div
                ref={listRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      m.role === "assistant"
                        ? "text-white rounded-xl px-4 py-3"
                        : "bg-primary text-primary-foreground rounded-xl px-4 py-3 ml-auto max-w-[85%]"
                    }
                    style={
                      m.role === "assistant"
                        ? { backgroundColor: "#52B788" }
                        : {}
                    }
                  >
                    {m.content}
                  </div>
                ))}
                {error && (
                  <div className="text-red-400 text-sm" role="alert">
                    {error}
                  </div>
                )}
              </div>

              <SheetFooter className="sticky bottom-0 p-4 border-t border-zinc-800 bg-black">
                <div className="flex w-full items-center gap-2">
                  <Input
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                    placeholder={
                      disabledByLimit
                        ? "Chat limit reached (15)"
                        : "Ask for a summary..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!disabledByLimit) handleSend();
                      }
                    }}
                    disabled={disabledByLimit}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={sending || disabledByLimit}
                  >
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
