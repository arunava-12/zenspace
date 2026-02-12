
import React from 'react';
import { X, CheckCircle2, AlertCircle, PlusCircle, MessageCircle, Clock } from 'lucide-react';

interface ActivitySidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tasks: any[];
  users: any[];
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ isOpen, setIsOpen, tasks, users }) => {
  // Generate some mock activity items based on the store data
  const activities = [
    { id: 1, type: 'complete', user: users[1], target: tasks[0]?.title, time: '2 mins ago' },
    { id: 2, type: 'comment', user: users[2], target: tasks[1]?.title, time: '1 hour ago' },
    { id: 3, type: 'create', user: users[0], target: 'New Mobile App Project', time: '3 hours ago' },
    { id: 4, type: 'priority', user: users[1], target: tasks[2]?.title, time: 'Yesterday' },
    { id: 5, type: 'complete', user: users[0], target: 'Draft PR for Sidebar', time: '2 days ago' },
  ];

  return (
    <aside 
      className={`fixed md:relative right-0 top-0 h-full transition-all duration-300 z-30 flex flex-col glass-card !bg-opacity-50 !rounded-none !border-y-0 !border-r-0 border-l border-zinc-200 dark:border-white/5 shadow-2xl md:shadow-none ${
        isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full md:w-0'
      } overflow-hidden`}
    >
      <div className="w-80 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Activity Feed
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-8 pb-1 group last:pb-0">
              {/* Timeline Connector */}
              <div className="absolute left-3 top-2 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 group-last:hidden"></div>
              
              {/* Icon */}
              <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-zinc-50 dark:ring-zinc-950 z-10 ${
                activity.type === 'complete' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' :
                activity.type === 'comment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                activity.type === 'create' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' :
                'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
              }`}>
                {activity.type === 'complete' && <CheckCircle2 size={12} />}
                {activity.type === 'comment' && <MessageCircle size={12} />}
                {activity.type === 'create' && <PlusCircle size={12} />}
                {activity.type === 'priority' && <AlertCircle size={12} />}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-medium">{activity.time}</p>
                <div className="flex items-center gap-2">
                   <img src={activity.user?.avatar} className="w-5 h-5 rounded-full" alt="" />
                   <p className="text-sm font-bold truncate">
                    {activity.user?.name.split(' ')[0]}
                   </p>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {activity.type === 'complete' ? 'completed ' : 
                   activity.type === 'comment' ? 'commented on ' :
                   activity.type === 'create' ? 'created ' :
                   'changed priority of '}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">"{activity.target}"</span>
                </p>
              </div>
            </div>
          ))}

          {/* Activity Footer */}
          <div className="pt-4 text-center">
            <button className="text-xs font-bold text-blue-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
              View All History
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ActivitySidebar;
