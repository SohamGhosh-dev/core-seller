import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lead } from "@/data/leads";
import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

interface EmailDraftModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateEmail(lead: Lead): { subject: string; body: string } {
  if (lead.aiScore >= 85) {
    return {
      subject: `Exclusive Offer for ${lead.company} — Let's Accelerate Your Sales Pipeline`,
      body: `Hi ${lead.name.split(" ")[0]},

I noticed ${lead.company} has been exploring our platform extensively — and I'm impressed by the level of diligence your team brings to evaluating new solutions.

Given your role as ${lead.title} in the ${lead.industry} space, I wanted to personally reach out. We've helped similar companies achieve:

• 40% faster lead-to-close cycles
• 3x improvement in pipeline visibility
• 95%+ forecast accuracy with our AI engine

I'd love to offer you a personalized walkthrough tailored to ${lead.company}'s specific needs. Would you have 20 minutes this week?

I've also attached our ${lead.industry} case study — I think you'll find the results compelling.

Looking forward to connecting,
Alex Morgan
Senior Account Executive, SalesmanAI`,
    };
  }

  if (lead.aiScore >= 60) {
    return {
      subject: `How ${lead.industry} Leaders Are Transforming Their Sales with AI`,
      body: `Hi ${lead.name.split(" ")[0]},

I came across ${lead.company} and was excited to see the innovative work you're doing in ${lead.industry}.

At SalesmanAI, we've been helping ${lead.industry} teams like yours unlock hidden revenue opportunities using AI-powered lead scoring and predictive analytics.

Here's what stood out to me about your profile:
• Your team could benefit from automated lead prioritization
• Our ${lead.industry}-specific models could surface insights you're missing
• Real-time chat integration could boost your response time by 60%

Would you be open to a quick 15-minute intro call? I'd love to learn more about ${lead.company}'s goals and share how we might help.

Best regards,
Alex Morgan
Senior Account Executive, SalesmanAI`,
    };
  }

  return {
    subject: `${lead.name.split(" ")[0]}, Quick Question About ${lead.company}'s Sales Strategy`,
    body: `Hi ${lead.name.split(" ")[0]},

I hope this finds you well! I'm reaching out because we work with a number of ${lead.industry} companies, and I thought ${lead.company} might find value in some of the trends we're seeing.

We recently published a report on how AI is reshaping B2B sales in ${lead.industry} — covering topics like:

• Automated lead scoring that reduces manual prospecting by 70%
• Predictive pipeline analytics for more accurate forecasting
• AI-assisted email personalization that doubles response rates

Would you be interested in receiving a copy? No strings attached — just thought it might be useful.

Cheers,
Alex Morgan
Senior Account Executive, SalesmanAI`,
  };
}

export function EmailDraftModal({ lead, open, onOpenChange }: EmailDraftModalProps) {
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const { subject, body } = generateEmail(lead);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            AI Email Draft — {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border">
            <div className="px-4 py-2 border-b border-border bg-secondary/50">
              <p className="text-xs text-muted-foreground">To: {lead.email}</p>
            </div>
            <div className="px-4 py-2 border-b border-border bg-secondary/50">
              <p className="text-xs text-muted-foreground">Subject: {subject}</p>
            </div>
            <div className="p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {body}
              </pre>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" /> Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
