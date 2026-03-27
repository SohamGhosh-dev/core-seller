import { Bot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Bot className="h-5 w-5 text-primary" />
          SalesmanAI
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SalesmanAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
