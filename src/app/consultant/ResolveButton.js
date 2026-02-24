"use client";

import { useState } from 'react';
import { markTicketAsResolved } from './actions';

export default function ResolveButton({ ticketId, currentStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (currentStatus === 'AI_RESOLVED' || currentStatus === 'HUMAN_RESOLVED') {
    return null; 
  }

  const handleResolve = async () => {
    setIsUpdating(true);
    await markTicketAsResolved(ticketId);
    setIsUpdating(false);
  };

  return (
    <button
      onClick={handleResolve}
      disabled={isUpdating}
      className="inline-flex items-center px-2 py-0.5 bg-cyan-950/30 text-cyan-300 text-[10px] font-bold tracking-wide uppercase rounded border border-cyan-800/50 hover:bg-cyan-900 hover:text-white hover:border-cyan-400 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 translate-y-0.5"
    >
      {isUpdating ? 'CLOSING...' : 'MARK RESOLVED ✓'}
    </button>
  );
}