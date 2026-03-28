import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { SalesChatbot } from "@/components/SalesChatbot";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DashboardMockup onChatClick={() => setChatOpen(true)} />
      <CTA />
      <Footer />
      <SalesChatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
