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

interface AISummaryButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
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

  const handleButtonClick = () => {
    onClick?.();
    if (!isMounted) {
      setIsMounted(true);
      setOpen(true);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    // Dummy POST-like behavior
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const fakeResponse = `Here’s a brief summary based on your input: "${trimmed}". (dummy)`;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fakeResponse },
      ]);
    } catch (e) {
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
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      m.role === "assistant"
                        ? "text-black rounded-xl px-4 py-3"
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
              </div>

              <SheetFooter className="sticky bottom-0 p-4 border-t border-zinc-800 bg-black">
                <div className="flex w-full items-center gap-2">
                  <Input
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                    placeholder="Ask for a summary..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button onClick={handleSend} disabled={sending}>
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
