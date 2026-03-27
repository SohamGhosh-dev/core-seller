import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/data/leads";
import { Brain, TrendingUp, Clock, Eye } from "lucide-react";

interface AIInsightsModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateInsight(lead: Lead): string {
  if (lead.aiScore >= 85) {
    return `This lead has visited the pricing page ${lead.pricingVisits} times in 24 hours and has a total of ${lead.pageVisits} page visits. Their engagement score of ${lead.aiScore} places them in the top 5% of all leads. Recommendation: High-priority follow-up within the next 2 hours. Consider offering a personalized demo or limited-time enterprise discount.`;
  }
  if (lead.aiScore >= 60) {
    return `${lead.name} from ${lead.company} shows moderate buying intent with ${lead.pageVisits} page visits and ${lead.pricingVisits} pricing page view(s). Their AI score of ${lead.aiScore} indicates growing interest. Recommendation: Send a targeted case study relevant to the ${lead.industry} industry and schedule a follow-up within 48 hours.`;
  }
  return `This lead has minimal engagement with only ${lead.pageVisits} page visit(s) and no pricing page views. Current AI score: ${lead.aiScore}. Recommendation: Add to nurture campaign. Send educational content about ${lead.industry} use cases. Re-evaluate in 2 weeks.`;
}

export function AIInsightsModal({ lead, open, onOpenChange }: AIInsightsModalProps) {
  if (!lead) return null;

  const insight = generateInsight(lead);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights — {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Score bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <span className="text-sm font-medium text-foreground">AI Lead Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${lead.aiScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">{lead.aiScore}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-border text-center">
              <Eye className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{lead.pageVisits}</p>
              <p className="text-xs text-muted-foreground">Page Visits</p>
            </div>
            <div className="p-3 rounded-lg border border-border text-center">
              <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{lead.pricingVisits}</p>
              <p className="text-xs text-muted-foreground">Pricing Views</p>
            </div>
            <div className="p-3 rounded-lg border border-border text-center">
              <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground">{lead.lastVisit}</p>
              <p className="text-xs text-muted-foreground">Last Visit</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-primary" />
              AI Analysis
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
          </div>

          {/* Engagement history */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Engagement History</h4>
            <ul className="space-y-1.5">
              {lead.engagementHistory.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
