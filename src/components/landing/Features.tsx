import { motion } from "framer-motion";
import { Target, MessageCircle, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Automated Lead Scoring",
    description: "Prioritize high‑value leads instantly with AI models trained on your historical win data.",
  },
  {
    icon: MessageCircle,
    title: "Real‑time Chat Integration",
    description: "Engage prospects the moment they land on your site with context‑aware AI conversations.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast pipeline revenue and close rates with 95%+ accuracy using machine learning.",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate follow‑ups, meeting scheduling, and CRM updates — zero manual effort.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. Your data stays encrypted at rest and in transit.",
  },
  {
    icon: BarChart3,
    title: "Custom Reporting",
    description: "Build drag‑and‑drop dashboards that surface the KPIs your team actually needs.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Sell Smarter
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete AI toolkit designed for modern B2B sales teams.
          </p>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
