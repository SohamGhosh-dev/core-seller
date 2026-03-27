import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              AI-Powered Sales Intelligence
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Close Deals Faster with{" "}
            <span className="text-primary">AI‑Driven</span> Sales&nbsp;Insights
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            SalesmanAI empowers your team with automated lead scoring, predictive analytics, and real‑time chat — so you can focus on what matters: building relationships.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button variant="hero" size="lg" asChild>
              <a href="#demo">
                Request Demo <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="/leads">
                <Play className="mr-1 h-4 w-4" /> See It in Action
              </a>
            </Button>
          </motion.div>

          {/* Trust bar */}
          <motion.p
            className="mt-12 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Trusted by 2,000+ sales teams worldwide
          </motion.p>
        </div>
      </div>
    </section>
  );
}
