import React, { useState } from "react";
import {
  Filter,
  Search,
  Plus,
  MoreVertical,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectsProps {
  store: any;
}

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Projects: React.FC<ProjectsProps> = ({ store }) => {
  const { projects = [], users = [], openProjectModal } = store || {};
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p: any) => p.status === filter);

  const MAX_VISIBLE_MEMBERS = 3;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-zinc-500 mt-1">
            Manage and track your team's project progress.
          </p>
        </div>
        <button
          onClick={openProjectModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filters & Search - Glass Pill Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card !bg-opacity-30 p-2 rounded-2xl border-white/20">
        <div className="flex p-1 glass-inset rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          {["All", "Active", "Planning", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-white/80 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto px-2">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter by name..."
              className="w-full glass-inset !bg-white/5 py-2 pl-9 pr-4 text-sm rounded-xl outline-none border-transparent focus:border-blue-500/30 transition-all"
            />
          </div>
          <button className="p-2 glass-inset hover:bg-white/20 dark:hover:bg-white/10 text-zinc-500 rounded-xl transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const lead = users.find((u: any) => u.id === project.leadId);
          const memberIds = project.memberIds || [];
          const membersToShow = memberIds.slice(0, MAX_VISIBLE_MEMBERS);
          const remainingCount = memberIds.length - MAX_VISIBLE_MEMBERS;

          return (
            <div
              key={project.id || index}
              className="glass-card group flex flex-col rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${
                      project.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : project.status === "Planning"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {(project.name || "P").charAt(0)}
                  </div>
                  <button className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg text-zinc-400 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded glass-inset ${
                      project.priority === "High"
                        ? "text-rose-600 dark:text-rose-400"
                        : project.priority === "Medium"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {project.priority} Priority
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded glass-inset`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full glass-inset h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 glass-inset !bg-transparent !border-x-0 !border-b-0 flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {membersToShow.map((id: string) => {
                    const member = users.find((u: any) => u.id === id);
                    return (
                      <img
                        key={id}
                        src={member?.avatar}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover shadow-sm"
                        title={member?.name}
                      />
                    );
                  })}
                  {remainingCount > 0 && (
                    <div className="w-8 h-8 rounded-full glass-inset flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800">
                      +{remainingCount}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
