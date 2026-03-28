import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function CTA() {
  const handleRequestDemo = () => {
    toast.success("Demo request received!", {
      description: "Our team will reach out within 24 hours to schedule your personalized walkthrough.",
    });
  };

  return (
    <section id="demo" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-foreground" />
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Sales Pipeline?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
              Get a personalized demo in under 15 minutes and see the impact on your pipeline.
            </p>
            <Button variant="secondary" size="lg" className="font-semibold text-base" onClick={handleRequestDemo}>
              Request Demo <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
