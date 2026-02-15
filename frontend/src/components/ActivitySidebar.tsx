import React, { useMemo } from "react";
import { X, CheckCircle2, MessageCircle, PlusCircle, Clock } from "lucide-react";

interface ActivitySidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tasks?: any[];
  users?: any[];
  projects?: any[];
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
  isOpen,
  setIsOpen,
  tasks = [],
  users = [],
  projects = []
}) => {

  // ---------- BUILD REAL ACTIVITY ----------
  const activities = useMemo(() => {
    const acts: any[] = [];

    // Tasks Activity
    tasks.forEach((task) => {
      const user = users.find((u: any) => u.id === task.assigneeId);

      acts.push({
        id: `task-${task.id}`,
        type: task.status === "Done" ? "complete" : "update",
        user,
        target: task.title,
        time: task.updatedAt || task.createdAt || "Recently"
      });
    });

    // Projects Activity
    projects.forEach((project) => {
      const lead = users.find((u: any) => u.id === project.leadId);

      acts.push({
        id: `project-${project.id}`,
        type: "create",
        user: lead,
        target: project.name,
        time: project.createdAt || "Recently"
      });
    });

    // Sort latest first
    return acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [tasks, users, projects]);

  return (
    <aside
      className={`fixed md:relative right-0 top-0 h-full transition-all duration-300 z-30 flex flex-col glass-card ${
        isOpen ? "w-80 translate-x-0" : "w-0 translate-x-full md:w-0"
      } overflow-hidden`}
    >
      <div className="w-80 flex flex-col h-full">

        {/* HEADER */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Activity Feed
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {activities.length === 0 && (
            <p className="text-zinc-500 text-sm">No activity yet.</p>
          )}

          {activities.map((activity) => (
            <div key={activity.id} className="space-y-1">

              <div className="flex items-center gap-2">
                <img
                  src={
                    activity.user?.avatar ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm font-bold">
                  {activity.user?.name || "User"}
                </p>
              </div>

              <p className="text-xs text-zinc-600">
                {activity.type === "complete" && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    completed
                  </span>
                )}
                {activity.type === "create" && (
                  <span className="flex items-center gap-1">
                    <PlusCircle size={12} className="text-blue-500" />
                    created
                  </span>
                )}
                {activity.type === "update" && (
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-amber-500" />
                    updated
                  </span>
                )}

                <span className="ml-1 font-semibold">
                  "{activity.target}"
                </span>
              </p>

              <p className="text-[10px] text-zinc-400">
                {new Date(activity.time).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      </div>
    </aside>
  );
};

export default ActivitySidebar;
