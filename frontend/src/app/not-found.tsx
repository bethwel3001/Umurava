'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <h1 className="text-6xl font-black text-primary/20 mb-4">404</h1>
      <h2 className="text-xl font-bold mb-2">Resource not found</h2>
      <p className="text-muted-content max-w-xs mx-auto mb-10 text-sm font-medium">
        The page you are looking for has been moved or does not exist in this console.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}
