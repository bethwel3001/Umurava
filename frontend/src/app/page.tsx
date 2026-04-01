'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/store/slices/jobSlice';
import { fetchApplicants } from '@/store/slices/applicantSlice';
import { fetchDashboardStats } from '@/store/slices/statsSlice';
import { RootState, AppDispatch } from '@/store';
import { 
  Briefcase, 
  Users, 
  ArrowRight,
  AlertCircle,
  Loader2,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs);
  const { applicants, loading: appsLoading } = useSelector((state: RootState) => state.applicants);
  const { dashboard: stats, loading: statsLoading, error: statsError } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const dashboardStats = [
    { name: 'Active jobs', value: stats?.activeJobs ?? 0, icon: Briefcase, color: 'text-primary' },
    { name: 'Total applicants', value: stats?.totalApplicants ?? 0, icon: Users, color: 'text-secondary' },
    { name: 'Screened today', value: stats?.screenedToday ?? 0, icon: Zap, color: 'text-accent' },
  ];

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10">
        <AlertCircle size={40} className="text-error mb-4" />
        <h2 className="text-xl font-bold">Connection error</h2>
        <p className="text-muted-content mb-6 text-sm">Unable to retrieve console analytics.</p>
        <button onClick={() => dispatch(fetchDashboardStats())} className="text-sm font-bold text-primary hover:underline">Retry connection</button>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-content text-sm mt-2 font-medium">Real-time recruitment performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="flex flex-col">
            <p className="text-xs font-bold text-muted-content mb-3">{stat.name}</p>
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold">
                {statsLoading ? <Loader2 className="animate-spin" size={24} /> : stat.value}
              </p>
              <stat.icon size={20} className={`${stat.color} opacity-50`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-bold text-muted-content">Recent activity</h2>
            <Link href="/jobs" className="text-xs font-bold text-primary hover:underline">View all</Link>
          </div>
          
          <div className="space-y-6">
            {jobsLoading ? (
              <div className="py-10"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : jobs.length === 0 ? (
              <div className="py-10 text-sm text-muted-content italic">No active job posts.</div>
            ) : (
              jobs.slice(0, 4).map((job: any) => (
                <div key={job._id} className="flex items-center justify-between group py-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors cursor-pointer">{job.title}</p>
                    <p className="text-xs text-muted-content mt-1 font-medium">{job.experienceLevel} • {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    job.status === 'Open' ? "text-success" : "text-error"
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-bold text-muted-content">Top talent</h2>
            <Link href="/applicants" className="text-xs font-bold text-primary hover:underline">Browse pool</Link>
          </div>
          <div className="space-y-6">
            {appsLoading ? (
              <div className="py-10"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : applicants.length === 0 ? (
              <div className="py-10 text-sm text-muted-content italic">No candidate profiles found.</div>
            ) : (
              applicants.slice(0, 5).map((applicant: any) => (
                <div key={applicant._id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{applicant.name}</p>
                    <p className="text-xs text-muted-content truncate font-medium">{applicant.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
