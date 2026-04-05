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
  MoreHorizontal, 
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
  ExternalLink,
  Edit,
  Trash2,
  Archive,
  Clock
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
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
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
        <Link href="/jobs/new" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-primary/20">
          <Plus size={18} />
          Post new role
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-content/50" size={18} />
          <input 
            type="text" 
            placeholder="Search by job title or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 h-12 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-muted-content font-black text-[10px] uppercase tracking-widest">Updating listings...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px]">
          <Briefcase size={48} className="mx-auto mb-4 text-muted-content/20" />
          <h3 className="text-lg font-bold">No job openings found</h3>
          <p className="text-muted-content mb-8 max-w-xs mx-auto text-sm font-medium">Try adjusting your search or create a new job posting.</p>
          <Link href="/jobs/new" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Create first posting</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-visible">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-muted-content text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-2">Job title</th>
                  <th className="px-6 py-2">Experience</th>
                  <th className="px-6 py-2">Status</th>
                  <th className="px-6 py-2">Posted Date</th>
                  <th className="px-6 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {filteredJobs.map((job: any) => (
                  <tr key={job._id} className="bg-white dark:bg-white/5 hover:shadow-md transition-all group rounded-2xl">
                    <td className="px-6 py-5 font-bold first:rounded-l-2xl">
                      <Link href={`/jobs/${job._id}`} className="flex items-center gap-2 hover:text-primary transition-colors group-hover:translate-x-1 transition-transform inline-flex">
                        {job.title}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-sm text-muted-content font-bold">{job.experienceLevel}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        job.status === 'Open' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-muted-content font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-40" />
                        {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right relative last:rounded-r-2xl">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                        className={`p-2 rounded-xl transition-all ${activeMenu === job._id ? 'bg-primary text-white scale-110' : 'text-muted-content hover:bg-primary/10 hover:text-primary'}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {activeMenu === job._id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-6 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right"
                        >
                          <div className="p-2 space-y-1">
                            <Link 
                              href={`/jobs/${job._id}/edit`}
                              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                              <Edit size={16} />
                              Edit details
                            </Link>
                            <button 
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                              <Clock size={16} />
                              End role posting
                            </button>
                            <button 
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                              <Archive size={16} />
                              Archive listing
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-error hover:bg-error/5 rounded-xl transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete permanently
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

          <div className="md:hidden space-y-4">
            {filteredJobs.map((job: any) => (
              <div key={job._id} className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <Link href={`/jobs/${job._id}`} className="font-extrabold text-lg text-primary truncate pr-4">{job.title}</Link>
                  <button 
                    onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                    className="text-muted-content p-1"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="flex gap-4 mb-6">
                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    job.status === 'Open' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                  }`}>
                    {job.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-content uppercase tracking-widest">
                    <Briefcase size={12} /> {job.experienceLevel}
                  </div>
                </div>

                {activeMenu === job._id && (
                  <div className="grid grid-cols-2 gap-2 mb-6 animate-in slide-in-from-top-2 duration-200">
                    <Link href={`/jobs/${job._id}/edit`} className="flex items-center justify-center gap-2 py-3 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Edit size={14} /> Edit
                    </Link>
                    <button onClick={() => handleDeleteJob(job._id)} className="flex items-center justify-center gap-2 py-3 bg-error/5 text-error rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-content/50 uppercase tracking-widest">
                  <Calendar size={12} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
