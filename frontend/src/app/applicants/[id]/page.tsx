'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicantById, clearSelectedApplicant } from '@/store/slices/applicantSlice';
import { RootState, AppDispatch } from '@/store';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin,
  Calendar,
  Loader2,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ApplicantProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedApplicant: applicant, loading } = useSelector((state: RootState) => state.applicants);

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicantById(id as string));
    }
    return () => {
      dispatch(clearSelectedApplicant());
    };
  }, [dispatch, id]);

  if (loading || !applicant) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-muted-content font-bold text-sm uppercase tracking-widest">Loading profile</p>
    </div>
  );

  const data = applicant.parsedData || {};

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-content hover:text-primary transition-colors text-sm font-bold"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-primary text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/20">
            {applicant.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{applicant.name}</h1>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-muted-content">
                <Mail size={16} className="text-primary/40" />
                {applicant.email}
              </div>
              {applicant.phone && (
                <div className="flex items-center gap-2 text-sm font-bold text-muted-content">
                  <Phone size={16} className="text-primary/40" />
                  {applicant.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {data.Summary && (
            <section>
              <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-6">Professional summary</h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {data.Summary}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-8">Work experience</h2>
            <div className="space-y-12 relative before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-primary/10 pl-8">
              {data.Experience?.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-xl font-bold">{exp.title}</h3>
                  <div className="flex justify-between items-center mt-1 mb-4">
                    <p className="text-primary font-bold">{exp.company}</p>
                    <p className="text-xs font-bold text-muted-content uppercase tracking-widest">{exp.duration}</p>
                  </div>
                  <p className="text-sm text-muted-content font-medium leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-8">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.Education?.map((edu: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-primary/[0.02] border border-primary/5">
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <p className="text-primary font-bold mt-1">{edu.institution}</p>
                  <p className="text-xs font-bold text-muted-content mt-4 uppercase tracking-widest">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-xs font-bold text-muted-content uppercase tracking-[0.2em] mb-6">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {data.Skills?.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-xl border border-primary/10">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Resume file</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FileText size={24} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">Resume.pdf</p>
                <button className="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest mt-1">
                  View original
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
