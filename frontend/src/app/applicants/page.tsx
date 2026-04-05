'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  Upload, 
  Search, 
  UserPlus, 
  Mail, 
  Phone,
  FileText,
  Loader2,
  CheckCircle2,
  Users,
  Sparkles,
  ChevronRight,
  FileUp,
  X,
  Briefcase,
  GraduationCap,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { parseResume, fetchApplicants, uploadResume } from '@/store/slices/applicantSlice';

export default function ApplicantsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applicants, loading } = useSelector((state: RootState) => state.applicants);
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parserSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  const handleParseResume = async () => {
    if (!resumeText) return;
    setParsing(true);
    try {
      console.log('Starting resume parse...');
      const result = await dispatch(parseResume(resumeText)).unwrap();
      console.log('Parse result:', result);
      setResumeText('');
      await dispatch(fetchApplicants());
      console.log('Applicants refreshed after parse');
      triggerSuccess();
    } catch (error) {
      console.error('Error parsing resume:', error);
    } finally {
      setParsing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log('Starting PDF upload:', file.name);
      const result = await dispatch(uploadResume(file)).unwrap();
      console.log('Upload result:', result);
      await dispatch(fetchApplicants());
      console.log('Applicants refreshed after upload');
      if (fileInputRef.current) fileInputRef.current.value = '';
      triggerSuccess();
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setUploading(false);
    }
  };

  const triggerSuccess = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const scrollToParser = () => {
    parserSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    parserSectionRef.current?.classList.add('ring-4', 'ring-primary/20');
    setTimeout(() => {
      parserSectionRef.current?.classList.remove('ring-4', 'ring-primary/20');
    }, 2000);
  };

  const filteredApplicants = applicants.filter((app: any) => 
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in relative pb-20">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-success text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-4 border-white/20">
            <CheckCircle2 size={24} />
            Candidate parsed & saved to Talent Pool
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
          <p className="text-muted-content font-medium">Manage candidate profiles and analyze new resumes with AI.</p>
        </div>
        <button 
          onClick={scrollToParser}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center group"
        >
          <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
          Add Candidate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-content" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          </div>

          <div className="p-0 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-muted-content font-black uppercase tracking-widest text-[10px]">Syncing Talent Pool...</p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-center py-32 border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[40px]">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={40} className="text-muted-content/20" />
                </div>
                <h3 className="text-lg font-bold">No candidates found</h3>
                <p className="text-muted-content font-medium mt-2">Upload a resume or paste text to build your pool.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApplicants.map((applicant: any) => (
                  <div key={applicant._id} className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {applicant.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black truncate group-hover:text-primary transition-colors uppercase tracking-tight">{applicant.name}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                        <p className="text-sm text-muted-content flex items-center gap-2 font-bold">
                          <Mail size={14} className="text-primary/40" />
                          {applicant.email}
                        </p>
                        {applicant.phone && (
                          <p className="text-sm text-muted-content flex items-center gap-2 font-bold">
                            <Phone size={14} className="text-primary/40" />
                            {applicant.phone}
                          </p>
                        )}
                      </div>
                      
                      {applicant.parsedData?.Skills && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {applicant.parsedData.Skills.slice(0, 4).map((skill: string, i: number) => (
                            <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-white/10 rounded-md">
                              {skill}
                            </span>
                          ))}
                          {applicant.parsedData.Skills.length > 4 && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-primary/5 text-primary rounded-md">
                              +{applicant.parsedData.Skills.length - 4} More
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="h-12 px-6 bg-slate-50 dark:bg-white/5 hover:bg-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0">
                      Profile <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <div 
            ref={parserSectionRef}
            className="bg-primary/5 dark:bg-white/5 p-10 rounded-[48px] relative overflow-hidden transition-all duration-500 border border-primary/10 shadow-2xl shadow-primary/5"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles size={150} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                  <Wand2 size={18} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">AI Parser</h2>
              </div>
              <p className="text-xs text-muted-content font-bold mb-10 leading-relaxed uppercase tracking-widest">
                Automated extraction of name, contact, skills, and experience.
              </p>
              
              <div className="space-y-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-primary/20 rounded-[32px] p-10 text-center hover:bg-primary/5 dark:hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/40 bg-white/50 dark:bg-black/20"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept=".pdf"
                  />
                  {uploading ? (
                    <Loader2 className="animate-spin mx-auto text-primary mb-4" size={40} />
                  ) : (
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileUp className="text-primary" size={32} />
                    </div>
                  )}
                  <p className="text-sm font-black text-primary uppercase tracking-widest">
                    {uploading ? 'Analyzing PDF...' : 'Drop PDF Resume'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-muted-content/20">
                  <div className="h-px flex-1 bg-current" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Manual Entry</span>
                  <div className="h-px flex-1 bg-current" />
                </div>

                <div className="space-y-4">
                  <textarea 
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume content here..." 
                    className="input-field text-sm font-bold resize-none py-6 leading-relaxed bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10"
                  ></textarea>
                  
                  <button 
                    onClick={handleParseResume}
                    disabled={parsing || !resumeText || uploading}
                    className="w-full btn-primary flex items-center justify-center gap-3 group h-16 rounded-[20px] shadow-xl shadow-primary/30 text-base font-black uppercase tracking-widest"
                  >
                    {parsing ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                        Process Talent
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-accent/5 rounded-[32px] border border-accent/10">
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <AlertCircle size={14} /> Extraction Quality
            </h4>
            <p className="text-xs font-bold text-muted-content leading-relaxed">
              Our AI engine identifies roles and skills even in complex layouts. For best results, ensure the PDF is text-searchable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
