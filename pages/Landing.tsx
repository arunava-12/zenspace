import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  Sparkles,
  Users,
  ArrowRight,
  Github,
  MoreHorizontal,
  MessageSquare,
  ListTodo,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import DarkVeil from "../components/DarkVeil.tsx";
import BlobCursor from "../components/BlobCursor.tsx";
import { useStore } from "../store/useStore.ts";

const Landing: React.FC = () => {
  const { darkMode, setDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockTasks, setMockTasks] = useState([
    { title: "Design Hero Section", status: "Done" },
    { title: "API Integration", status: "In Progress" },
    { title: "App Store Icons", status: "Todo" },
  ]);

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newTasks = [
        { title: "Optimize Landing Page", status: "Todo" },
        ...mockTasks.slice(0, 2),
      ];
      setMockTasks(newTasks);
      setIsGenerating(false);
    }, 1500);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: ListTodo, label: "Tasks" },
    { icon: Users, label: "Team" },
    { icon: Sparkles, label: "AI Assistant" },
    { icon: MessageSquare, label: "Messages" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 80, skewY: 7, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-x-hidden selection:bg-blue-500/30 transition-colors duration-500 scroll-smooth">
      <BlobCursor
        darkMode={darkMode} // NEW – important
        blobType="circle"
        fillColor="#2563eb" // Primary Blue
        trailCount={3}
        sizes={[80, 140, 100]}
        innerSizes={[25, 40, 30]}
        // Stronger inner glow for dark mode
        innerColor={
          darkMode ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.3)"
        }
        // Slight opacity boost so dark = light visually
        opacities={darkMode ? [0.45, 0.35, 0.35] : [0.4, 0.3, 0.3]}
        shadowColor="rgba(37, 99, 235, 0.15)"
        shadowBlur={20}
        shadowOffsetX={0}
        shadowOffsetY={0}
        filterStdDeviation={35}
        useFilter={true}
        zIndex={1}
      >
        {/* Cinematic Background */}
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-1000 ${darkMode ? "opacity-100" : "opacity-10"}`}
        >
          <DarkVeil
            hueShift={darkMode ? 10 : -30}
            speed={0.2}
          />
        </div>

        {/* Navbar */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-default"
          >
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/30 transform group-hover:rotate-12 transition-transform duration-500">
              <Zap size={28} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              ZenSpace
            </span>
          </motion.div>

          <div className="flex items-center gap-4 md:gap-8">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-zinc-300 dark:hover:border-white/10 active:scale-90"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 pt-12 md:pt-24 pb-20 px-6 max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 max-w-5xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-bold tracking-widest uppercase"
            >
              <Sparkles size={14} />
              <span>The Intelligence Layer for Modern Teams</span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                variants={headlineVariants}
                className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] md:leading-[0.9] py-4"
              >
                Project Management <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  Redefined.
                </motion.span>
              </motion.h1>
            </div>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the modern command center. Minimal by design,
              intelligent by nature. ZenSpace brings your projects, tasks, and
              team into one focused flow.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Launch Workspace</span>
                <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all text-zinc-700 dark:text-zinc-300">
                <Github size={20} />
                <span>View Source</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Interactive Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 md:mt-32 relative group"
          >
            <div className="absolute -inset-4 md:-inset-10 bg-blue-500/10 blur-[60px] md:blur-[100px] opacity-40 rounded-full group-hover:opacity-60 transition-opacity"></div>

            <div className="relative rounded-2xl md:rounded-[2.5rem] border border-zinc-200 dark:border-white/10 overflow-hidden bg-white/50 dark:bg-zinc-900/40 backdrop-blur-3xl shadow-2xl aspect-[4/3] sm:aspect-video p-2 md:p-6 flex gap-3 md:gap-6">
              {/* Mini Sidebar Mockup */}
              <div className="hidden sm:flex w-12 md:w-16 h-full flex-col items-center py-4 md:py-6 gap-4 md:gap-6 glass-inset rounded-2xl md:rounded-3xl relative z-30">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Zap size={18} fill="currentColor" />
                </div>
                <div className="flex-1 flex flex-col gap-3 md:gap-4 items-center">
                  {sidebarItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all ${activeTab === idx ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400" : "text-zinc-400"}`}
                    >
                      <item.icon size={18} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Area Mockup */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden relative z-20">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/5">
                  <div className="space-y-1">
                    <div className="h-2 md:h-3 w-24 md:w-32 bg-zinc-200 dark:bg-white/10 rounded-full"></div>
                    <div className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white">
                      Workspace Overview
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-zinc-200 dark:bg-white/10"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 overflow-hidden">
                  <div className="md:col-span-2 space-y-4 md:space-y-6">
                    <div className="glass-card !bg-white/60 dark:!bg-white/[0.02] p-4 md:p-6 rounded-xl md:rounded-[2rem] border-zinc-200 dark:border-white/5 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Project Velocity
                      </div>
                      {[
                        {
                          title: "Website Launch",
                          progress: 75,
                          color: "bg-blue-600",
                        },
                        {
                          title: "Mobile Refactor",
                          progress: 40,
                          color: "bg-purple-600",
                        },
                      ].map((p, i) => (
                        <div
                          key={i}
                          className="space-y-2 p-3 md:p-4 glass-inset rounded-xl"
                        >
                          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold">
                            <span>{p.title}</span>
                            <span>{p.progress}%</span>
                          </div>
                          <div className="h-1 md:h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${p.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={`${p.color} h-full rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerate}
                      className={`w-full text-left glass-card p-4 md:p-6 rounded-xl md:rounded-[2rem] border flex items-center justify-between transition-all active:scale-[0.98] ${
                        isGenerating
                          ? "bg-blue-600/10 dark:bg-blue-600/30 border-blue-500/50"
                          : "bg-blue-600/5 dark:bg-blue-600/10 border-blue-500/10 hover:bg-blue-600/10 dark:hover:bg-blue-600/20 shadow-sm"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                          ZenAI Integration
                        </p>
                        <h4 className="text-sm md:text-xl font-black text-zinc-900 dark:text-white">
                          Generate Roadmap
                        </h4>
                      </div>
                      <div
                        className={`p-2 rounded-lg ${isGenerating ? "animate-spin text-blue-600" : "text-blue-500"}`}
                      >
                        <Sparkles size={20} />
                      </div>
                    </button>
                  </div>

                  <div className="hidden md:flex flex-col gap-6">
                    <div className="flex-1 glass-card !bg-white/60 dark:!bg-white/[0.02] p-6 rounded-[2rem] border-zinc-200 dark:border-white/5 space-y-4 overflow-hidden">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Queue
                      </div>
                      {mockTasks.map((task, i) => (
                        <motion.div
                          key={task.title}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 p-2 glass-inset rounded-lg"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${task.status === "Done" ? "bg-emerald-500" : "bg-blue-600"}`}
                          ></div>
                          <div className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300 truncate">
                            {task.title}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Features Section */}
        <section className="relative z-10 px-6 py-20 md:py-40 bg-white/50 dark:bg-transparent transition-colors">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-16 md:mb-24 space-y-4"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-black tracking-tighter"
              >
                Everything to ship faster.
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-lg text-zinc-600 dark:text-zinc-500 max-w-xl mx-auto font-medium"
              >
                ZenSpace is built for teams who move fast and value clarity. A
                modular interface powered by intelligence.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Unified Command",
                  desc: "Every project, task, and team member in one beautifully minimal view. No more clutter.",
                  color: "blue",
                },
                {
                  icon: Sparkles,
                  title: "Intelligent Assistant",
                  desc: "Integrated Gemini AI helps you summarize roadmaps, refine tasks, and brainstorm goals.",
                  color: "purple",
                },
                {
                  icon: Users,
                  title: "Team Alignment",
                  desc: "Real-time updates, granular roles, and powerful permissions built for growing orgs.",
                  color: "emerald",
                },
                {
                  icon: ListTodo,
                  title: "Fluid Workflow",
                  desc: "Drag and drop task management with powerful filters and intuitive keyboard shortcuts.",
                  color: "amber",
                },
                {
                  icon: Zap,
                  title: "Performance First",
                  desc: "Sub-100ms response times and an offline-ready engine designed for professional speed.",
                  color: "rose",
                },
                {
                  icon: Github,
                  title: "Deep Integrations",
                  desc: "Connect your existing stack with webhooks and direct sync for code and docs.",
                  color: "indigo",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={featureVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-xl"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-${f.color}-500/10 flex items-center justify-center text-${f.color}-600 dark:text-${f.color}-400 mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-500 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-24 md:py-40 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="
      relative max-w-5xl mx-auto
      rounded-[3rem]
      backdrop-blur-3xl
      bg-white/60 dark:bg-zinc-900/60
      border border-zinc-200 dark:border-white/10
      shadow-2xl
      p-10 md:p-20
      text-center
      space-y-10
      overflow-hidden
    "
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none"></div>

            {/* Floating Accent */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 blur-[100px] rounded-full"></div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter relative z-10"
            >
              Ready to find your flow?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-600 dark:text-zinc-400 text-base md:text-xl max-w-xl mx-auto relative z-10 font-medium leading-relaxed"
            >
              Join thousands of teams shipping faster with ZenSpace. Start your
              workspace today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10"
            >
              <Link
                to="/login"
                className="
          w-full sm:w-auto
          px-10 py-5
          bg-blue-600 hover:bg-blue-500
          text-white
          rounded-2xl
          font-black
          shadow-2xl shadow-blue-500/25
          transition-all
          active:scale-95
          hover:scale-[1.03]
          flex items-center justify-center gap-2
        "
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>

              <button
                className="
          w-full sm:w-auto
          px-10 py-5
          rounded-2xl
          font-black
          border border-zinc-300 dark:border-white/20
          bg-white/70 dark:bg-white/5
          hover:bg-zinc-100 dark:hover:bg-white/10
          transition-all
          active:scale-95
          hover:scale-[1.03]
          backdrop-blur-md
        "
              >
                Request Demo
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-12 px-6 border-t border-zinc-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Zap
                size={20}
                fill="currentColor"
                className="text-zinc-900 dark:text-white"
              />
              <span className="font-black tracking-tighter">
                ZenSpace © 2025
              </span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-blue-500 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </BlobCursor>
    </div>
  );
};

export default Landing;