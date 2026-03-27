import { useState, useMemo } from "react";
import { mockLeads, Lead, LeadStatus } from "@/data/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AIInsightsModal } from "@/components/leads/AIInsightsModal";
import { EmailDraftModal } from "@/components/leads/EmailDraftModal";
import { ChatSidebar } from "@/components/leads/ChatSidebar";
import {
  Bot,
  Brain,
  Mail,
  Search,
  ArrowLeft,
  Filter,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const statusColors: Record<LeadStatus, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Cold: "bg-muted text-muted-foreground border-border",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [chatFilter, setChatFilter] = useState<{
    type: string;
    value: string | number;
  } | null>(null);

  const [insightLead, setInsightLead] = useState<Lead | null>(null);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    let result = mockLeads;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q)
      );
    }

    // Status filter buttons
    if (statusFilter !== "All") {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Chat-driven filter
    if (chatFilter) {
      if (chatFilter.type === "minScore") {
        result = result.filter((l) => l.aiScore > (chatFilter.value as number));
      } else if (chatFilter.type === "status") {
        result = result.filter((l) => l.status === chatFilter.value);
      } else if (chatFilter.type === "industry") {
        result = result.filter((l) => l.industry === chatFilter.value);
      }
    }

    return result;
  }, [search, statusFilter, chatFilter]);

  const handleChatFilter = (
    filter: { type: string; value: string | number } | null
  ) => {
    setChatFilter(filter);
    // Reset manual filters when chat takes over
    setStatusFilter("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">SalesmanAI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredLeads.length} of {mockLeads.length} leads
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Title & description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-scored leads with real-time insights. Use the chat assistant to
            filter and analyze.
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads, companies, industries…"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setChatFilter(null);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["All", "Hot", "Warm", "Cold"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(s);
                  setChatFilter(null);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Active chat filter indicator */}
        {chatFilter && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-sm">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              AI filter active:{" "}
              <strong className="text-foreground">
                {chatFilter.type === "minScore"
                  ? `Score > ${chatFilter.value}`
                  : `${chatFilter.type}: ${chatFilter.value}`}
              </strong>
            </span>
            <button
              className="ml-auto text-xs text-primary hover:underline"
              onClick={() => setChatFilter(null)}
            >
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead className="text-center">AI Score</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Deal Value</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No leads match your current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="group hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{lead.company}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {lead.industry}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${lead.aiScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {lead.aiScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={statusColors[lead.status]}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-foreground">
                      ${(lead.dealValue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInsightLead(lead)}
                          title="AI Insights"
                        >
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="hidden xl:inline ml-1">Insights</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEmailLead(lead)}
                          title="Draft AI Email"
                        >
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="hidden xl:inline ml-1">Email</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Modals */}
      <AIInsightsModal
        lead={insightLead}
        open={!!insightLead}
        onOpenChange={(open) => !open && setInsightLead(null)}
      />
      <EmailDraftModal
        lead={emailLead}
        open={!!emailLead}
        onOpenChange={(open) => !open && setEmailLead(null)}
      />

      {/* Chat */}
      <ChatSidebar leads={mockLeads} onFilter={handleChatFilter} />
    </div>
  );
}
