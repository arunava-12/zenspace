import React, { useState, useRef } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Upload,
  Loader2,
} from "lucide-react";

interface SettingsProps {
  store: any;
}

const Settings: React.FC<SettingsProps> = ({ store }) => {
  const {
    currentUser,
    activeWorkspace,
    darkMode,
    setDarkMode,
    logout,
    updateProfile,
    updateAvatar,
    updateWorkspace,
  } = store;
  const [activeSection, setActiveSection] = useState("Profile");
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [jobTitle, setJobTitle] = useState("Product Designer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [wsName, setWsName] = useState(activeWorkspace?.name || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveAvatarToServer = async (avatar: string) => {
    if (!currentUser?.id) return;

    await fetch(`https://zenspace-production-fc6e.up.railway.app/api/user/avatar/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    });
  };

  const sections = [
    { name: "Profile", icon: User, desc: "Update your personal information" },
    { name: "Workspace", icon: Globe, desc: "Manage organization and team" },
    { name: "Notifications", icon: Bell, desc: "Configure alerts and updates" },
    {
      name: "Appearance",
      icon: Palette,
      desc: "Customize theme and interface",
    },
    { name: "Security", icon: Shield, desc: "Password and authentication" },
    {
      name: "Billing",
      icon: CreditCard,
      desc: "Manage subscription and invoices",
    },
  ];

  const handleSave = () => {
    if (activeSection === "Profile") {
      updateProfile(name, email);
    } else if (activeSection === "Workspace") {
      updateWorkspace(activeWorkspace.id, wsName);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const avatarBase64 = reader.result as string;

      updateAvatar(avatarBase64);
      await saveAvatarToServer(avatarBase64);

      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  className="w-24 h-24 rounded-3xl border-4 border-white dark:border-zinc-800 shadow-xl object-cover transition-all"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-[10px] font-black uppercase text-white">
                    Change
                  </span>
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center z-10">
                    <Loader2 size={24} className="text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>
                    {isUploading ? "Uploading..." : "Upload New Photo"}
                  </span>
                </button>
                <p className="text-xs text-zinc-500 font-medium">
                  JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-3.5 px-4 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-3.5 px-4 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-3.5 px-4 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-3.5 px-4 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold"
                />
              </div>
            </div>
          </div>
        );
      case "Appearance":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Theme Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`p-6 border rounded-[2rem] flex flex-col items-center gap-3 transition-all ${!darkMode ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10" : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                >
                  <Sun
                    className={!darkMode ? "text-blue-500" : "text-zinc-500"}
                    size={24}
                  />
                  <span className="text-sm font-bold">Light</span>
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`p-6 border rounded-[2rem] flex flex-col items-center gap-3 transition-all ${darkMode ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10" : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                >
                  <Moon
                    className={darkMode ? "text-blue-500" : "text-zinc-500"}
                    size={24}
                  />
                  <span className="text-sm font-bold">Dark</span>
                </button>
                <button className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center gap-3 opacity-50 cursor-not-allowed">
                  <Monitor className="text-zinc-500" size={24} />
                  <span className="text-sm font-bold">System</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Accent Color
              </h3>
              <div className="flex gap-4">
                {[
                  "bg-blue-600",
                  "bg-purple-600",
                  "bg-emerald-600",
                  "bg-rose-600",
                  "bg-amber-600",
                ].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full ${color} ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 hover:ring-2 transition-all cursor-pointer`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        );
      case "Workspace":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-8 glass-inset rounded-[2rem] flex items-center justify-between border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20">
                  {wsName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{wsName}</h4>
                  <p className="text-xs text-zinc-500 font-medium tracking-tight">
                    Active Team Space • Created 4 months ago
                  </p>
                </div>
              </div>
              <button className="text-xs font-black text-blue-500 hover:underline uppercase tracking-widest">
                Manage Team
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Workspace URL
                </label>
                <div className="flex">
                  <span className="bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 px-5 py-4 rounded-l-2xl text-sm text-zinc-500 font-medium">
                    zenspace.app/
                  </span>
                  <input
                    type="text"
                    defaultValue={wsName.toLowerCase().replace(" ", "-")}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-4 px-5 rounded-r-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "Security":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] bg-white/30 dark:bg-white/5">
                <div>
                  <h4 className="font-bold text-sm">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                  Enable
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "Billing":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-zinc-950 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Current Plan
                    </span>
                    <h3 className="text-4xl font-black mt-2 tracking-tighter">
                      Pro Monthly
                    </h3>
                  </div>
                  <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    Active
                  </span>
                </div>
                <div className="h-px bg-white/10 w-full"></div>
                <p className="text-zinc-400 text-sm font-bold tracking-tight">
                  Your next billing cycle starts on June 12, 2024.
                </p>
                <button className="bg-white text-zinc-950 px-8 py-4 rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                  Upgrade to Enterprise
                </button>
              </div>
              <CreditCard className="absolute -bottom-16 -right-16 text-white/5 w-80 h-80 rotate-12" />
            </div>
          </div>
        );
      default:
        return (
          <div className="py-20 text-center text-zinc-500 animate-in fade-in duration-500">
            Section coming soon.
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold text-sm transition-all group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="md:col-span-1 space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.name}
              onClick={() => setActiveSection(sec.name)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                activeSection === sec.name
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
              }`}
            >
              <sec.icon size={18} />
              {sec.name}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 glass-card rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 space-y-10 shadow-sm relative overflow-hidden flex flex-col min-h-[600px]">
          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-black tracking-tight leading-none">
              {activeSection}
            </h2>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-80">
              {sections.find((s) => s.name === activeSection)?.desc}
            </p>
          </div>

          <div className="relative z-10 flex-1">{renderSection()}</div>

          <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4 relative z-10">
            <button
              className="px-8 py-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-black text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
              onClick={() => {
                if (activeSection === "Profile") {
                  setName(currentUser.name);
                  setEmail(currentUser.email);
                } else if (activeSection === "Workspace") {
                  setWsName(activeWorkspace?.name || "");
                }
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className={`px-10 py-4 rounded-2xl text-sm font-black shadow-xl transition-all flex items-center gap-2 active:scale-95 ${isSaved ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"}`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : null}
              {isSaved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
