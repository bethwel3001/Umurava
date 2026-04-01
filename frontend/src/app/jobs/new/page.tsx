'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob } from '@/store/slices/jobSlice';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
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
    <div className="max-w-3xl space-y-12 animate-in">
      <Link href="/jobs" className="flex items-center gap-2 text-muted-content hover:text-primary transition-colors text-sm font-bold">
        <ArrowLeft size={18} />
        Back to jobs
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create job opening</h1>
        <p className="text-muted-content font-medium mt-2">Define the role requirements for AI screening.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-content uppercase tracking-widest">Job title</label>
          <input 
            type="text" 
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior frontend engineer" 
            className="input-field"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-content uppercase tracking-widest">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the role and responsibilities..." 
            className="input-field min-h-[120px]"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-content uppercase tracking-widest">Experience level</label>
            <select 
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="input-field appearance-none"
            >
              <option value="Junior">Junior</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-content uppercase tracking-widest">Skills (comma separated)</label>
            <input 
              type="text" 
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, TypeScript, Node.js..." 
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-content uppercase tracking-widest">Requirements (one per line)</label>
          <textarea 
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="List specific qualifications..." 
            className="input-field min-h-[120px]"
          ></textarea>
        </div>

        <div className="pt-6 flex justify-end gap-6 items-center">
          <Link href="/jobs" className="text-sm font-bold text-muted-content hover:text-primary transition-colors">
            Cancel
          </Link>
          <button type="submit" className="btn-primary flex items-center gap-2 px-10">
            <Save size={18} />
            Post job
          </button>
        </div>
      </form>
    </div>
  );
}
