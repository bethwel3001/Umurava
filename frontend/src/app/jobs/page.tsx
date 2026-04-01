'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, deleteJob } from '@/store/slices/jobSlice';
import { RootState, AppDispatch } from '@/store';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredJobs = jobs.filter((job: any) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await dispatch(deleteJob(id));
      setActiveMenu(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10">
        <AlertCircle size={40} className="text-error mb-4" />
        <h2 className="text-lg font-bold tracking-tight">Sync failed</h2>
        <p className="text-muted-content mb-8">Unable to fetch job listings.</p>
        <button onClick={() => dispatch(fetchJobs())} className="btn-primary px-10">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job openings</h1>
          <p className="text-muted-content font-medium">Manage your active recruitment pipelines.</p>
        </div>
        <Link href="/jobs/new" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus size={18} />
          Post new role
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-content" size={18} />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 h-11"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 h-11 border border-[var(--border)] rounded-xl hover:bg-primary/5 transition-all text-xs font-bold">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-muted-content font-bold text-[10px]">Updating listings...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <Briefcase size={40} className="mx-auto mb-4" />
          <h3 className="text-lg font-bold">No results</h3>
          <p className="text-muted-content mb-8 max-w-xs mx-auto text-sm">Adjust your filters or post a new job opening.</p>
          <Link href="/jobs/new" className="text-xs font-bold text-primary hover:underline">Create posting</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted-content text-xs font-bold border-b border-[var(--border)]">
                  <th className="px-4 py-5 font-bold">Job title</th>
                  <th className="px-4 py-5 font-bold">Level</th>
                  <th className="px-4 py-5 font-bold">Status</th>
                  <th className="px-4 py-5 font-bold">Posted</th>
                  <th className="px-4 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredJobs.map((job: any) => (
                  <tr key={job._id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-4 py-5 font-bold">
                      <Link href={`/jobs/${job._id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                        {job.title}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-4 py-5 text-sm text-muted-content font-medium">{job.experienceLevel}</td>
                    <td className="px-4 py-5">
                      <span className={`text-[10px] font-bold ${
                        job.status === 'Open' ? "text-success" : "text-error"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm text-muted-content font-medium">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-5 text-right relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                        className="text-muted-content hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeMenu === job._id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-4 mt-2 w-48 bg-white border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="py-1">
                            <Link 
                              href={`/jobs/${job._id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-content hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              <Edit size={14} />
                              Edit Job
                            </Link>
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-error hover:bg-error/5 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete Job
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-8">
            {filteredJobs.map((job: any) => (
              <div key={job._id} className="py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/jobs/${job._id}`} className="font-bold text-primary truncate pr-4">{job.title}</Link>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${
                      job.status === 'Open' ? "text-success" : "text-error"
                    }`}>
                      {job.status}
                    </span>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                      className="text-muted-content"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {activeMenu === job._id && (
                  <div className="flex gap-4 mb-4 p-2 bg-primary/5 rounded-lg animate-in slide-in-from-top-2 duration-200">
                    <Link href={`/jobs/${job._id}/edit`} className="text-[10px] font-bold text-primary flex items-center gap-1">
                      <Edit size={12} /> Edit
                    </Link>
                    <button onClick={() => handleDeleteJob(job._id)} className="text-[10px] font-bold text-error flex items-center gap-1">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}

                <div className="flex gap-4 text-[10px] font-bold text-muted-content">
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={12} /> {job.experienceLevel}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
