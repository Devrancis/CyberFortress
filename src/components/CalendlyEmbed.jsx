'use client';
import { useEffect } from 'react';

export default function CalendlyEmbed({ url }) {
  useEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
    head.appendChild(script);
  }, []);

  return (
    <div 
      className="calendly-inline-widget w-full h-[600px] border border-slate-200 rounded-lg shadow-sm" 
      data-url={url}
    ></div>
  );
}