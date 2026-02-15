
import React, { useState } from 'react';
import { Mail, Shield, MoreVertical, Plus, Search, Link as LinkIcon, Check, Copy, UserPlus, ArrowRight } from 'lucide-react';

interface TeamProps {
  store: any;
}

const Team: React.FC<TeamProps> = ({ store }) => {
  const {
  users = [],
  activeWorkspace = { id: '', name: '' },
  addMember,
  joinWorkspace
} = store || {};
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://zenspace.app/join/${activeWorkspace?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      addMember(inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
      alert(`Invitation sent to ${inviteEmail}`);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinWorkspace(joinCode)) {
      setJoinCode('');
      setShowJoinModal(false);
    } else {
      alert("Invalid code or workspace not found.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">The Squad</h1>
          <p className="text-zinc-500 font-medium">Collaborators in <span className="text-zinc-900 dark:text-white font-bold">{activeWorkspace?.name}</span></p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowJoinModal(true)}
            className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/10 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Join Team
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <UserPlus size={18} />
            <span>Invite</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-zinc-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/30 dark:bg-white/5">
           <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="w-full glass-inset !border-transparent py-3 pl-11 pr-4 text-sm rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Workspace Population</p>
              <p className="text-lg font-black">{users.length} members</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-black/20 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Member</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-105 transition-transform" alt="" />
                      <div>
                        <p className="text-sm font-bold tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">@{user.name.toLowerCase().replace(' ', '')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Shield size={14} className={user.role === 'Admin' ? 'text-blue-500' : 'text-zinc-400'} />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="opacity-40" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Online
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl text-zinc-400 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-10 animate-in zoom-in duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-black tracking-tighter">Invite Team</h2>
               <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Team Link</label>
                <div className="flex gap-2">
                   <div className="flex-1 glass-inset !border-transparent rounded-2xl p-4 text-xs font-mono truncate text-zinc-500">
                      {inviteLink}
                   </div>
                   <button 
                    onClick={handleCopy}
                    className={`px-4 rounded-2xl transition-all flex items-center justify-center ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                   >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium pl-1 italic">Anyone with this link can join the workspace.</p>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-1 border-t border-zinc-100 dark:border-white/5"></div>
                <span className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Or Email</span>
                <div className="flex-1 border-t border-zinc-100 dark:border-white/5"></div>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <input 
                  required
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                />
                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black tracking-tighter">Join Team</h2>
               <button onClick={() => setShowJoinModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Team Code</label>
                <input 
                  required
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  placeholder="Enter join code or name"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-center uppercase tracking-widest"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Join Workspace</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal utility component
const X = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default Team;
