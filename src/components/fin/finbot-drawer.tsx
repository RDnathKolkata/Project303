import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Send, X } from "lucide-react";
import { buildFinContext } from "@/lib/finbot/buildContext";
import { finbotProvider, type ChatMessage } from "@/lib/finbot/provider";
import { useFin } from "@/lib/fin-context";
import { cn } from "@/lib/utils";
import finbotMark from "@/assets/finbot-mark.png";

const CHIPS = [
  "How do I split my ₹34,500 allowance?",
  "Explain Mutual Funds vs FDs",
  "How to reduce EMI strain?",
  "Which habit is costing me most?",
];

export function FinbotDrawer() {
  const fin = useFin();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const userName = fin.user.name || "friend";
      setMessages([
        {
          id: "greet",
          role: "assistant",
          content: `Hi ${userName} 👋 I'm **FinBot**. I can see your income, budget, EMIs and spending habits — ask me anything and I'll answer with your real numbers.`,
        },
      ]);
    }
  }, [fin.user.name, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: ChatMessage[] = [
      ...messages,
      { id: `u${Date.now()}`, role: "user", content: trimmed },
    ];
    setMessages(next);
    setInput("");
    setBusy(true);
    const context = buildFinContext({
      userName: fin.user.name,
      incomeSources: fin.incomeSources,
      allocation: fin.allocation,
      preset: fin.preset,
      totalIncome: fin.totalIncome,
      totalExpenses: fin.totalExpenses,
      netSavings: fin.netSavings,
      score: fin.score,
      streak: fin.streak,
      points: fin.points,
      completedLessons: fin.completedLessons,
    });
    try {
      const reply = await finbotProvider.sendMessage(next, context);
      setMessages((prev) => [...prev, { id: `a${Date.now()}`, role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e${Date.now()}`,
          role: "assistant",
          content: "Something went wrong reaching the assistant. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="size-4" />
          Ask FinBot
        </button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-[var(--shadow-lift)] transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <img src={finbotMark} alt="" className="size-9 rounded-lg" />
          <div className="flex-1">
            <p className="font-display text-sm font-semibold">FinBot Assistant</p>
            <p className="text-xs text-muted-foreground">Reading your live budget &amp; habits</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                  {m.content}
                </p>
              </div>
            ) : (
              <div
                key={m.id}
                className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ),
          )}
          {busy && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
              <span className="ml-1 text-xs">FinBot is thinking…</span>
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                disabled={busy}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask about your money…"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
