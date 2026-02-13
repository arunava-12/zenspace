import React from 'react';
import { X, CheckCircle2, AlertCircle, PlusCircle, MessageCircle, Clock } from 'lucide-react';

interface ActivitySidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tasks?: any[];
  users?: any[];
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
  isOpen,
  setIsOpen,
  tasks = [],
  users = []
}) => {

  // Safe mock data
  const activities = [
    { id: 1, type: 'complete', user: users?.[1], target: tasks?.[0]?.title || 'Task', time: '2 mins ago' },
    { id: 2, type: 'comment', user: users?.[2], target: tasks?.[1]?.title || 'Task', time: '1 hour ago' },
    { id: 3, type: 'create', user: users?.[0], target: 'New Mobile App Project', time: '3 hours ago' },
    { id: 4, type: 'priority', user: users?.[1], target: tasks?.[2]?.title || 'Task', time: 'Yesterday' },
    { id: 5, type: 'complete', user: users?.[0], target: 'Draft PR for Sidebar', time: '2 days ago' },
  ];

  return (
    <aside
      className={`fixed md:relative right-0 top-0 h-full transition-all duration-300 z-30 flex flex-col glass-card ${
        isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full md:w-0'
      } overflow-hidden`}
    >
      <div className="w-80 flex flex-col h-full">

        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Activity Feed
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {activities.map((activity) => (
            <div key={activity.id} className="space-y-1">

              <p className="text-xs text-zinc-500">{activity.time}</p>

              <div className="flex items-center gap-2">
                <img
                  src={activity.user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                  className="w-5 h-5 rounded-full"
                />
                <p className="text-sm font-bold truncate">
                  {activity.user?.name?.split(' ')[0] || 'User'}
                </p>
              </div>

              <p className="text-xs text-zinc-600">
                {activity.type === 'complete' ? 'completed ' :
                 activity.type === 'comment' ? 'commented on ' :
                 activity.type === 'create' ? 'created ' :
                 'changed priority of '}
                <span className="font-semibold">"{activity.target}"</span>
              </p>

            </div>
          ))}

        </div>
      </div>
    </aside>
  );
};

export default ActivitySidebar;
