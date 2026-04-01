'use client';

import { Settings, Bell, Shield, User, Cpu, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'AI & API', icon: Cpu },
  ];

  return (
    <div className="space-y-12 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-content font-medium">Manage your workspace configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted-content hover:bg-primary/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 max-w-2xl">
          <div className="">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-sm font-bold text-muted-content capitalize">{activeTab}</h2>
              <button className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
                <Save size={16} /> Update
              </button>
            </div>

            <div className="space-y-8">
              {activeTab === 'general' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-content">Organization</label>
                    <input type="text" defaultValue="Umurava AI" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-content">Language</label>
                    <select className="input-field appearance-none">
                      <option>English (US)</option>
                      <option>French</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'api' && (
                <>
                   <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-xs font-bold text-primary flex items-center gap-2">
                        <Cpu size={16} /> Gemini 1.5 Pro active
                      </p>
                   </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-content">System key</label>
                    <input type="password" value="••••••••••••••••" readOnly className="input-field bg-transparent" />
                  </div>
                </>
              )}

              {activeTab !== 'general' && activeTab !== 'api' && (
                <div className="py-20 text-center opacity-20">
                  <p className="text-xs font-bold">Module restricted</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
