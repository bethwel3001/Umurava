'use client';

import { Zap, Search, ShieldCheck, Filter, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ScreeningPage() {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScreening = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-12 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI screening</h1>
          <p className="text-muted-content font-medium">Automate candidate evaluation with Gemini AI.</p>
        </div>
        <button 
          onClick={handleStartScreening}
          disabled={isScanning}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
          {isScanning ? 'Processing...' : 'Run new batch'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Search, title: 'Matching', desc: '95% accuracy in skill verification.', color: 'text-primary' },
          { icon: ShieldCheck, title: 'Fraud', desc: 'Detects inconsistent history.', color: 'text-secondary' },
          { icon: Filter, title: 'Ranking', desc: 'Automatic shortlist generation.', color: 'text-accent' },
        ].map((item, i) => (
          <div key={i} className="bg-primary/5 p-6 rounded-2xl">
            <item.icon className={`${item.color} mb-4`} size={24} />
            <h3 className="font-bold text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-muted-content font-bold leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold text-muted-content">Screening history</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--border)] rounded-2xl">
          <Zap size={40} className="text-muted-content/20 mb-4" />
          <h3 className="font-bold text-sm">No active batches</h3>
          <p className="text-muted-content max-w-sm mx-auto mt-2 text-xs font-bold leading-relaxed">
            Select a job and candidates to begin AI evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
