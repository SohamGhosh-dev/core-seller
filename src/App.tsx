import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index.tsx";
import Leads from "./pages/Leads.tsx";
import NotFound from "./pages/NotFound.tsx";
import Organization from "./pages/Organization.tsx";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.35 };

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen"><Index /></motion.div>} />
        <Route path="/leads" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen"><Leads /></motion.div>} />
        <Route path="*" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen"><NotFound /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
