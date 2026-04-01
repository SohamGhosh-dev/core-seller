import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Building2,
  Pencil,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const industries = ["SaaS", "FinTech", "Healthcare", "E-Commerce", "Cloud", "AI/ML", "Manufacturing", "Logistics"];
const statuses = ["Hot", "Warm", "Cold"];

interface OrgMetric {
  id?: string;
  month: string;
  revenue: number;
  leads: number;
  conversions: number;
  deals: number;
  industry: string;
  status: string;
}

const emptyMetric: OrgMetric = {
  month: "Jan",
  revenue: 0,
  leads: 0,
  conversions: 0,
  deals: 0,
  industry: "SaaS",
  status: "Hot",
};

const Organization = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<OrgMetric[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OrgMetric>({ ...emptyMetric });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("org_metrics")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Error loading data", description: error.message, variant: "destructive" });
    } else {
      setMetrics(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSave = async () => {
    if (form.revenue < 0 || form.leads < 0 || form.conversions < 0 || form.deals < 0) {
      toast({ title: "Invalid values", description: "Values cannot be negative.", variant: "destructive" });
      return;
    }
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("org_metrics")
        .update({
          month: form.month,
          revenue: form.revenue,
          leads: form.leads,
          conversions: form.conversions,
          deals: form.deals,
          industry: form.industry,
          status: form.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated successfully" });
      }
    } else {
      const { error } = await supabase.from("org_metrics").insert({
        month: form.month,
        revenue: form.revenue,
        leads: form.leads,
        conversions: form.conversions,
        deals: form.deals,
        industry: form.industry,
        status: form.status,
      });
      if (error) {
        toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Data added successfully" });
      }
    }

    setEditingId(null);
    setForm({ ...emptyMetric });
    setShowForm(false);
    setSaving(false);
    fetchMetrics();
  };

  const handleEdit = (m: OrgMetric) => {
    setEditingId(m.id || null);
    setForm({ ...m });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("org_metrics").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted successfully" });
      fetchMetrics();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...emptyMetric });
    setShowForm(false);
  };

  const totals = metrics.reduce(
    (acc, m) => ({
      revenue: acc.revenue + Number(m.revenue),
      leads: acc.leads + m.leads,
      conversions: acc.conversions + m.conversions,
      deals: acc.deals + m.deals,
    }),
    { revenue: 0, leads: 0, conversions: 0, deals: 0 }
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Organization Data</h1>
          </div>
          <Button variant="hero" size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyMetric }); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: `$${(totals.revenue / 1000).toFixed(0)}K`, icon: TrendingUp },
            { label: "Total Leads", value: totals.leads.toLocaleString(), icon: BarChart3 },
            { label: "Conversions", value: totals.conversions.toLocaleString(), icon: TrendingUp },
            { label: "Deals Closed", value: totals.deals.toLocaleString(), icon: BarChart3 },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <card.icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-xl border border-primary/20 bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {editingId ? "Edit Entry" : "Add New Monthly Data"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Month</Label>
                    <Select value={form.month} onValueChange={(v) => setForm({ ...form, month: v })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Industry</Label>
                    <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((i) => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">Revenue ($K)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.revenue}
                      onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Leads</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.leads}
                      onChange={(e) => setForm({ ...form, leads: Number(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Conversions</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.conversions}
                      onChange={(e) => setForm({ ...form, conversions: Number(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Deals</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.deals}
                      onChange={(e) => setForm({ ...form, deals: Number(e.target.value) })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="hero" size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" /> {saving ? "Saving…" : editingId ? "Update" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Your Organization Metrics</h3>
            <p className="text-xs text-muted-foreground mt-1">This data feeds into the Analytics & Markets dashboard charts.</p>
          </div>
          {loading ? (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">Loading…</div>
          ) : metrics.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">
              No data yet. Click "Add Entry" to input your organization's metrics.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left px-6 py-3 font-medium">Month</th>
                    <th className="text-left px-4 py-3 font-medium">Industry</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-right px-4 py-3 font-medium">Revenue</th>
                    <th className="text-right px-4 py-3 font-medium">Leads</th>
                    <th className="text-right px-4 py-3 font-medium">Conv.</th>
                    <th className="text-right px-4 py-3 font-medium">Deals</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-3 font-medium text-foreground">{m.month}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.industry}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          m.status === "Hot" ? "bg-primary/20 text-primary" :
                          m.status === "Warm" ? "bg-accent/20 text-accent" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">${Number(m.revenue).toLocaleString()}K</td>
                      <td className="px-4 py-3 text-right text-foreground">{m.leads}</td>
                      <td className="px-4 py-3 text-right text-foreground">{m.conversions}</td>
                      <td className="px-4 py-3 text-right text-foreground">{m.deals}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(m)} className="text-muted-foreground hover:text-primary transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(m.id!)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;
