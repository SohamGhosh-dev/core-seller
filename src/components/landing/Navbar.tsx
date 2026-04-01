import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Leads", href: "/leads" },
  { label: "Organization", href: "/organization" },
];

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      scrollToSection(href);
    } else {
      navigate(href);
    }
  };

  const handleDemo = () => {
    setOpen(false);
    scrollToSection("#demo");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Bot className="h-7 w-7 text-primary" />
          SalesmanAI
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button key={l.href} onClick={() => handleClick(l.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </button>
          ))}
          <Button variant="hero" size="sm" onClick={handleDemo}>
            Request Demo
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-b border-border"
          >
            <div className="flex flex-col gap-4 p-4">
              {navLinks.map((l) => (
                <button key={l.href} onClick={() => handleClick(l.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground text-left">
                  {l.label}
                </button>
              ))}
              <Button variant="hero" size="sm" onClick={handleDemo}>
                Request Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
