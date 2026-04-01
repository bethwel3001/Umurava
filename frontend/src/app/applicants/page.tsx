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
  FileUp
} from 'lucide-react';
import { parseResume, fetchApplicants, uploadResume } from '@/store/slices/applicantSlice';

export default function ApplicantsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applicants, loading } = useSelector((state: RootState) => state.applicants);
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  const handleParseResume = async () => {
    if (!resumeText) return;
    setParsing(true);
    setParseSuccess(false);
    try {
      await dispatch(parseResume(resumeText)).unwrap();
      setResumeText('');
      setParseSuccess(true);
      setTimeout(() => setParseSuccess(false), 5000);
      dispatch(fetchApplicants());
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
    setParseSuccess(false);
    try {
      await dispatch(uploadResume(file)).unwrap();
      setParseSuccess(true);
      setTimeout(() => setParseSuccess(false), 5000);
      dispatch(fetchApplicants());
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredApplicants = applicants.filter((app: any) => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent pool</h1>
          <p className="text-muted-content font-medium">Manage candidate profiles and analyze new resumes with AI.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <UserPlus size={18} />
          Add candidate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-content" size={20} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 h-11"
              />
            </div>
          </div>

          <div className="p-0 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-content font-bold">Synchronizing talent pool...</p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-[var(--border)] rounded-2xl">
                <Users size={48} className="mx-auto text-muted-content/20 mb-4" />
                <p className="text-muted-content italic">No matching candidates found.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filteredApplicants.map((applicant: any) => (
                  <div key={applicant._id} className="p-5 hover:bg-primary/5 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg shrink-0">
                      {applicant.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate group-hover:text-primary transition-colors">{applicant.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <p className="text-xs text-muted-content flex items-center gap-1.5 truncate font-bold">
                          <Mail size={12} className="shrink-0" />
                          {applicant.email}
                        </p>
                        {applicant.phone && (
                          <p className="text-xs text-muted-content flex items-center gap-1.5 shrink-0 font-bold">
                            <Phone size={12} className="shrink-0" />
                            {applicant.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-bold text-muted-content hover:text-primary transition-colors">
                      Profile <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <div className="bg-primary/5 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={60} />
            </div>
            
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <FileText className="text-secondary" size={18} />
              AI parser
            </h2>
            <p className="text-xs text-muted-content font-bold mb-6 relative z-10 leading-relaxed">
              Extract candidate data instantly from text or PDF.
            </p>
            
            {parseSuccess && (
              <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 text-success text-[10px] font-bold animate-in fade-in">
                <CheckCircle2 size={16} />
                Profile added
              </div>
            )}

            <div className="relative z-10 space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center hover:bg-primary/5 transition-colors cursor-pointer group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden" 
                  accept=".pdf"
                />
                {uploading ? (
                  <Loader2 className="animate-spin mx-auto text-primary mb-2" size={24} />
                ) : (
                  <FileUp className="mx-auto text-primary/40 group-hover:text-primary mb-2 transition-colors" size={24} />
                )}
                <p className="text-xs font-bold text-primary">
                  {uploading ? 'Parsing CV...' : 'Upload PDF resume'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-muted-content">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">or paste text</span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <textarea 
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text here..." 
                className="input-field text-sm resize-none"
              ></textarea>
              
              <button 
                onClick={handleParseResume}
                disabled={parsing || !resumeText || uploading}
                className="w-full btn-primary flex items-center justify-center gap-2 group h-12"
              >
                {parsing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Process text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
