import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { Lead } from "@/data/leads";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSidebarProps {
  leads: Lead[];
  onFilter: (filter: { type: string; value: string | number } | null) => void;
}

function processQuery(query: string, leads: Lead[]): { response: string; filter: { type: string; value: string | number } | null } {
  const q = query.toLowerCase();

  if (q.includes("high-value") || q.includes("high value") || (q.includes("score") && q.includes("80"))) {
    const count = leads.filter((l) => l.aiScore > 80).length;
    return {
      response: `Found **${count} high-value leads** with AI Score > 80. I've filtered the table to show them. These leads show strong buying signals and should be prioritized for outreach.`,
      filter: { type: "minScore", value: 80 },
    };
  }

  if (q.includes("hot")) {
    const count = leads.filter((l) => l.status === "Hot").length;
    return {
      response: `Showing **${count} Hot leads**. These are your most engaged prospects — ${leads.filter(l => l.status === "Hot").map(l => l.name).join(", ")}. I recommend immediate follow-up.`,
      filter: { type: "status", value: "Hot" },
    };
  }

  if (q.includes("warm")) {
    const count = leads.filter((l) => l.status === "Warm").length;
    return {
      response: `Showing **${count} Warm leads**. These prospects are showing moderate interest. A targeted case study or personalized demo invite could convert them.`,
      filter: { type: "status", value: "Warm" },
    };
  }

  if (q.includes("cold")) {
    const count = leads.filter((l) => l.status === "Cold").length;
    return {
      response: `Showing **${count} Cold leads**. These need nurturing. I recommend adding them to an automated email drip campaign with educational content.`,
      filter: { type: "status", value: "Cold" },
    };
  }

  if (q.includes("all") || q.includes("reset") || q.includes("clear") || q.includes("show everything")) {
    return {
      response: "Filters cleared. Showing all **" + leads.length + " leads** in the table.",
      filter: null,
    };
  }

  if (q.includes("top") || q.includes("best")) {
    const top3 = [...leads].sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
    return {
      response: `Your **top 3 leads** by AI Score:\n\n1. **${top3[0].name}** (${top3[0].company}) — Score: ${top3[0].aiScore}\n2. **${top3[1].name}** (${top3[1].company}) — Score: ${top3[1].aiScore}\n3. **${top3[2].name}** (${top3[2].company}) — Score: ${top3[2].aiScore}\n\nFiltered to show leads with Score > 80.`,
      filter: { type: "minScore", value: 80 },
    };
  }

  if (q.includes("deal") || q.includes("revenue") || q.includes("value") || q.includes("pipeline")) {
    const total = leads.reduce((s, l) => s + l.dealValue, 0);
    const hot = leads.filter(l => l.status === "Hot").reduce((s, l) => s + l.dealValue, 0);
    return {
      response: `**Pipeline Summary:**\n\n• Total pipeline value: **$${(total / 1000).toFixed(0)}K**\n• Hot pipeline: **$${(hot / 1000).toFixed(0)}K**\n• Average deal size: **$${(total / leads.length / 1000).toFixed(1)}K**\n\nShowing high-value deals (Score > 80).`,
      filter: { type: "minScore", value: 80 },
    };
  }

  if (q.includes("saas") || q.includes("fintech") || q.includes("health") || q.includes("e-commerce") || q.includes("cloud")) {
    const industry = q.includes("saas") ? "SaaS" : q.includes("fintech") ? "FinTech" : q.includes("health") ? "Healthcare" : q.includes("e-commerce") ? "E-Commerce" : "Cloud Infrastructure";
    const count = leads.filter(l => l.industry === industry).length;
    return {
      response: `Found **${count} lead(s)** in the **${industry}** industry. Filtered the table for you.`,
      filter: { type: "industry", value: industry },
    };
  }

  return {
    response: `I can help you filter and analyze your leads. Try asking:\n\n• "Show me high-value leads"\n• "Show hot leads"\n• "What's my pipeline value?"\n• "Show top leads"\n• "Clear filters"`,
    filter: null,
  };
}

export function ChatSidebar({ leads, onFilter }: ChatSidebarProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI sales assistant. Ask me things like **\"Show me high-value leads\"** or **\"What's my pipeline value?\"** and I'll filter and analyze your data in real time.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
    const { response, filter } = processQuery(input, leads);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: response };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    onFilter(filter);
  };

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground text-sm">AI Sales Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    }`}
                  >
                    {/* Simple markdown-like bold rendering */}
                    {msg.content.split("\n").map((line, li) => (
                      <p key={li} className={li > 0 ? "mt-1" : ""}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={pi} className="font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            <span key={pi}>{part}</span>
                          )
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about your leads…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" variant="default">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
