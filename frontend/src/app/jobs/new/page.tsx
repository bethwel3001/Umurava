'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob } from '@/store/slices/jobSlice';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Briefcase, FileText, Settings, Layers } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skills: '',
    experienceLevel: 'Junior',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
    };
    await dispatch(createJob(jobData));
    router.push('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in py-10">
      <Link href="/jobs" className="flex items-center gap-2 text-muted-content hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} />
        Back to recruitment
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Create job opening</h1>
          <p className="text-muted-content font-medium mt-2">Configure the role parameters for the AI screening engine.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              Core Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-content uppercase tracking-widest ml-1">Job title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer" 
                  className="input-field h-12 text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-content uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will this person do? Describe the impact of this role..." 
                  className="input-field min-h-[150px] text-sm py-4 leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-secondary" />
              Requirements & Skills
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-content uppercase tracking-widest ml-1">Mandatory Requirements (one per line)</label>
                <textarea 
                  rows={5}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Bachelor's degree in CS&#10;5+ years of experience with React&#10;Strong communication skills" 
                  className="input-field min-h-[120px] text-sm py-4"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-content uppercase tracking-widest ml-1">Technical Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Tailwind, Node.js..." 
                  className="input-field h-12 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary/5 dark:bg-white/5 p-8 rounded-3xl border border-primary/10 space-y-8">
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} className="text-accent" />
              Role Config
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-content uppercase tracking-widest ml-1">Experience level</label>
                <div className="relative">
                  <select 
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="input-field appearance-none h-12 pr-10 text-sm font-bold bg-white dark:bg-slate-900 border-2 border-primary/10 focus:border-primary/30"
                  >
                    <option value="Junior">Junior (0-2 years)</option>
                    <option value="Intermediate">Intermediate (3-5 years)</option>
                    <option value="Senior">Senior (5-8 years)</option>
                    <option value="Lead">Lead / Staff (8+ years)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <Briefcase size={16} />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 h-12">
                  <Save size={18} />
                  Publish Job
                </button>
                <Link href="/jobs" className="w-full flex items-center justify-center h-12 text-xs font-bold text-muted-content hover:text-primary transition-colors">
                  Discard changes
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 border border-[var(--border)] rounded-2xl bg-accent/5">
            <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">AI Screening Tip</h3>
            <p className="text-[11px] text-muted-content font-medium leading-relaxed">
              The more specific your requirements, the better our AI can rank your candidates. Try to include specific tools, methodologies, or certifications.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
