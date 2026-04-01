'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/store/slices/jobSlice';
import { fetchApplicants, screenApplicants, fetchScreeningResults } from '@/store/slices/applicantSlice';
import { RootState, AppDispatch } from '@/store';
import { 
  ArrowLeft, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function JobDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { applicants, results, loading: screeningLoading, error: applicantError } = useSelector((state: RootState) => state.applicants);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const job = jobs.find((j: any) => j._id === id);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
    if (id) {
      dispatch(fetchScreeningResults(id as string));
    }
  }, [dispatch, id]);

  const handleScreen = async () => {
    if (!id || selectedApplicants.length === 0) return;
    setLocalError(null);
    try {
      await dispatch(screenApplicants({ jobId: id as string, applicantIds: selectedApplicants })).unwrap();
      dispatch(fetchScreeningResults(id as string));
    } catch (err: any) {
      // err will be the string from rejectWithValue or the error object
      const message = typeof err === 'string' ? err : (err.message || 'AI screening is currently unavailable. Please try again later.');
      setLocalError(message);
    }
  };

  const toggleApplicant = (applicantId: string) => {
    setSelectedApplicants(prev => 
      prev.includes(applicantId) 
        ? prev.filter(a => a !== applicantId) 
        : [...prev, applicantId]
    );
  };

  if (!job) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-muted-content font-bold text-sm uppercase tracking-widest">Loading job details</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in pb-20">
      <Link href="/jobs" className="flex items-center gap-2 text-muted-content hover:text-primary transition-colors text-sm font-bold">
        <ArrowLeft size={18} />
        Back to jobs
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="text-xs font-bold text-muted-content uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-md">{job.experienceLevel}</span>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md ${
              job.status === 'Open' ? "text-success bg-success/5" : "text-error bg-error/5"
            }`}>{job.status}</span>
          </div>
        </div>
        <button 
          onClick={handleScreen}
          disabled={screeningLoading || selectedApplicants.length === 0}
          className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 h-12 px-10"
        >
          {screeningLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing
            </>
          ) : (
            <>
              Run AI screening
            </>
          )}
        </button>
      </div>

      {localError && (
        <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-error text-sm font-bold animate-in slide-in-from-top-2">
          {localError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-6">Role overview</h2>
            <p className="text-sm text-muted-content font-bold leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </section>
          
          <section>
            <h3 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-6">Key requirements</h3>
            <ul className="space-y-4">
              {job.requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em]">Select talent</h2>
              <span className="text-[10px] font-bold text-primary">{selectedApplicants.length} selected</span>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {applicants.map((app: any) => (
                <div 
                  key={app._id}
                  onClick={() => toggleApplicant(app._id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${
                    selectedApplicants.includes(app._id) 
                      ? "bg-primary text-white shadow-lg" 
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedApplicants.includes(app._id) ? "bg-white border-white" : "border-primary/20"
                  }`}>
                    {selectedApplicants.includes(app._id) && <span className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{app.name}</p>
                    <p className={`text-[10px] truncate font-bold opacity-60 ${selectedApplicants.includes(app._id) ? "text-white" : "text-muted-content"}`}>{app.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em]">AI ranked shortlist</h2>
          </div>
          
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-primary/[0.02] rounded-3xl border-2 border-dashed border-[var(--border)]">
              <h3 className="font-bold">No screening results yet</h3>
              <p className="text-muted-content max-w-xs mx-auto mt-2 text-sm font-bold">
                Select candidates and run AI evaluation to generate a ranked shortlist.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {results.map((result: any) => (
                <div key={result._id} className="group border-b border-[var(--border)] last:border-0 pb-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {result.rank}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{result.applicantId.name}</h3>
                        <p className="text-sm text-muted-content font-bold mt-1">{result.applicantId.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{result.matchScore}%</div>
                      <p className="text-[10px] font-bold text-muted-content uppercase tracking-widest mt-1">Match score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                    <div>
                      <h4 className="font-bold text-success text-[10px] uppercase tracking-widest mb-4">
                        Strengths
                      </h4>
                      <ul className="space-y-3">
                        {result.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-sm font-bold opacity-80 flex items-start gap-2">
                            <span className="text-success mt-1.5 w-1 h-1 rounded-full bg-success shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-accent text-[10px] uppercase tracking-widest mb-4">
                        Gaps & risks
                      </h4>
                      <ul className="space-y-3">
                        {result.gaps.map((g: string, i: number) => (
                          <li key={i} className="text-sm font-bold opacity-80 flex items-start gap-2">
                            <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-primary/[0.02] p-8 rounded-3xl">
                    <h4 className="text-[10px] font-bold text-muted-content uppercase tracking-widest mb-4">Analysis & reasoning</h4>
                    <p className="text-sm font-bold text-muted-content leading-relaxed italic">{result.reasoning}</p>
                    <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-muted-content uppercase tracking-widest">Recommendation</p>
                        <p className="font-bold text-primary mt-1">{result.recommendation}</p>
                      </div>
                      <Link 
                        href={`/applicants/${result.applicantId._id}`}
                        className="text-xs font-bold flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        Full profile <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
