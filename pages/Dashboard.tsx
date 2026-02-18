import React from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard.tsx";

interface DashboardProps {
  store: any;
}

const Dashboard: React.FC<DashboardProps> = ({ store }) => {
  const {
    projects = [],
    tasks = [],
    currentUser = { id: "", name: "" },
    openProjectModal,
    openChatbot,
    users = [],
    activeWorkspace,
  } = store || {};

  const navigate = useNavigate();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p: any) => p.status === "Completed",
  ).length;
  const myTasks = tasks.filter((t: any) => t.assigneeId === currentUser.id);
  const overdueTasks = myTasks.filter(
    (t: any) => new Date(t.dueDate) < new Date() && t.status !== "Done",
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">
              Morning, {(currentUser.name || "").split(" ")[0]}
            </h1>
          </div>
          <p className="text-zinc-500 font-medium pl-1">
            Everything looks smooth in{" "}
            <span className="text-zinc-900 dark:text-white font-bold">
              {activeWorkspace?.name || "Workspace"}
            </span>{" "}
            today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Team Settings
          </button>
          <button
            onClick={openProjectModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Create Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Active Projects"
          value={totalProjects}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          label="Done Tasks"
          value={completedProjects}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          label="Your Queue"
          value={myTasks.length}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          label="Critical"
          value={overdueTasks.length}
          icon={AlertCircle}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/30 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <TrendingUp size={20} />
                </div>
                <h2 className="font-bold text-xl tracking-tight">
                  Focus Projects
                </h2>
              </div>
              <Link
                to="/projects"
                className="text-blue-500 hover:text-blue-600 text-sm font-bold inline-flex items-center gap-1 transition-colors"
              >
                Explore All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {projects.slice(0, 3).map((project: any) => (
                <div
                  key={project.id}
                  className="p-8 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors tracking-tight"
                      >
                        {project.name}
                      </Link>
                      <p className="text-sm text-zinc-500 font-medium">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                        project.priority === "High"
                          ? "bg-rose-500/10 text-rose-600"
                          : project.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-zinc-500/10 text-zinc-500"
                      }`}
                    >
                      {project.priority}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-6">
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-1000 shadow-lg"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-200">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group relative bg-white dark:bg-zinc-950 rounded-[2.5rem] p-10 text-zinc-900 dark:text-white overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/5 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 opacity-50"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity">
              <Sparkles size={120} />
            </div>

            <div className="relative z-10 max-w-lg space-y-6">
              <div className="bg-blue-600 w-fit p-3 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                <Zap size={24} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">
                Meet ZenAI.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed">
                Your team's intelligence layer. Generate roadmaps, brainstorm
                tasks, and summarize chaos into clarity.
              </p>
              <button
                onClick={openChatbot}
                className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-8 py-3.5 rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Activate Assistant
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="glass-card rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-xl tracking-tight">Your Queue</h2>
              <span className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] px-3 py-1 rounded-full font-black">
                {myTasks.length}
              </span>
            </div>
            <div className="flex-1 p-6 space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
              {myTasks.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-zinc-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-zinc-500 font-medium">Clear schedule!</p>
                </div>
              ) : (
                myTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${
                          task.status === "Done"
                            ? "bg-emerald-500"
                            : task.status === "In Progress"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold tracking-tight truncate ${task.status === "Done" ? "line-through text-zinc-400" : ""}`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={12} className="text-zinc-400" />
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {task.dueDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/[0.02]">
              <button
                onClick={() => navigate("/tasks")}
                className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-500/10 rounded-xl transition-all"
              >
                Full View
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 space-y-8">
            <h2 className="font-bold text-xl tracking-tight">The Squad</h2>
            <div className="space-y-6">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        className="w-12 h-12 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-110 transition-transform"
                        alt=""
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 shadow-sm"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/team")}
              className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-sm font-black transition-all hover:opacity-90 active:scale-95 shadow-xl"
            >
              Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
