'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchJobs } from '@/store/slices/jobSlice';
import { fetchApplicants, screenApplicants } from '@/store/slices/applicantSlice';
import { 
  Zap, 
  Search, 
  ShieldCheck, 
  Filter, 
  Loader2, 
  CheckSquare, 
  Square,
  ChevronRight,
  AlertCircle,
  Trophy,
  Target,
  BarChart3
} from 'lucide-react';

export default function ScreeningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { applicants, results, loading, error: screeningError } = useSelector((state: RootState) => state.applicants);
  
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
  }, [dispatch]);

  const toggleApplicant = (id: string) => {
    setSelectedApplicantIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleStartScreening = async () => {
    if (!selectedJobId || selectedApplicantIds.length === 0) return;
    
    setIsProcessing(true);
    try {
      await dispatch(screenApplicants({ 
        jobId: selectedJobId, 
        applicantIds: selectedApplicantIds 
      })).unwrap();
    } catch (err) {
      console.error('Screening failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedJob = jobs.find(j => j._id === selectedJobId);

  return (
    <div className="space-y-12 animate-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Evaluation</h1>
          <p className="text-muted-content font-medium">Rank talent against job requirements using deep analysis.</p>
        </div>
        <button 
          onClick={handleStartScreening}
          disabled={isProcessing || !selectedJobId || selectedApplicantIds.length === 0}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-primary/20 disabled:grayscale disabled:opacity-30 transition-all"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
          {isProcessing ? 'Analyzing...' : 'Run evaluation batch'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-content">1. Select Target Role</h2>
            <div className="space-y-2">
              {jobs.filter(j => j.status === 'Open').map(job => (
                <div 
                  key={job._id}
                  onClick={() => setSelectedJobId(job._id)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                    selectedJobId === job._id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-100 dark:border-white/5 hover:border-primary/20'
                  }`}
                >
                  <p className="font-bold text-sm">{job.title}</p>
                  <p className="text-[10px] font-bold text-muted-content mt-1">{job.experienceLevel}</p>
                </div>
              ))}
              {jobs.length === 0 && <p className="text-xs italic text-muted-content">No open jobs found.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-content">2. Select Candidates ({selectedApplicantIds.length})</h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {applicants.map(app => (
                <div 
                  key={app._id}
                  onClick={() => toggleApplicant(app._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedApplicantIds.includes(app._id)
                    ? 'bg-primary/10'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {selectedApplicantIds.includes(app._id) ? (
                    <CheckSquare size={18} className="text-primary" />
                  ) : (
                    <Square size={18} className="text-muted-content/30" />
                  )}
                  <div>
                    <p className="text-xs font-bold">{app.name}</p>
                    <p className="text-[10px] text-muted-content truncate max-w-[150px]">{app.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-primary/5 rounded-[40px] border-2 border-dashed border-primary/20">
              <div className="relative">
                <Loader2 className="animate-spin text-primary" size={64} />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold">Deep Analysis in Progress</h3>
                <p className="text-sm text-muted-content mt-2 max-w-xs mx-auto">Gemini is comparing candidate experience against "{selectedJob?.title}" requirements.</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-content">Evaluation Results</h2>
                <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">{results.length} Candidates Screened</span>
              </div>
              
              <div className="space-y-4">
                {results.map((result: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg font-black">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{result.applicantId?.name || 'Candidate'}</h3>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            result.recommendation.includes('Strongly') ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                          }`}>
                            {result.recommendation}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-muted-content uppercase tracking-widest mb-1">Match Score</p>
                          <p className={`text-3xl font-black ${
                            result.matchScore >= 80 ? 'text-success' : result.matchScore >= 60 ? 'text-accent' : 'text-error'
                          }`}>
                            {result.matchScore}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-slate-100 dark:border-white/5 pt-8">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-2">
                          <Trophy size={14} /> Key Strengths
                        </h4>
                        <ul className="space-y-2">
                          {result.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-xs font-medium text-muted-content flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-2">
                          <Target size={14} /> Gaps & Risks
                        </h4>
                        <ul className="space-y-2">
                          {result.gaps.map((g: string, i: number) => (
                            <li key={i} className="text-xs font-medium text-muted-content flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl">
                      <h4 className="text-[10px] font-black text-muted-content uppercase tracking-widest mb-2 flex items-center gap-2">
                        <BarChart3 size={14} /> AI Reasoning
                      </h4>
                      <p className="text-xs font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
                        "{result.reasoning}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px]">
              <Zap size={48} className="text-muted-content/10 mb-4" />
              <h3 className="text-lg font-bold">No active evaluation</h3>
              <p className="text-muted-content max-w-sm mx-auto mt-2 text-sm font-medium leading-relaxed">
                Configure your batch on the left by selecting a job and candidate profiles to begin the AI evaluation process.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
