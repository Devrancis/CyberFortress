"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function ConsultantDashboard() {
  const { data: session } = useSession();
  const [allTickets, setAllTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeChatTicket, setActiveChatTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatScrollRef = useRef(null);

  const activeTicketIdRef = useRef(null);
  useEffect(() => {
    activeTicketIdRef.current = activeChatTicket?.id;
  }, [activeChatTicket]);

  useEffect(() => {
    fetchGlobalTickets(false);

    const interval = setInterval(() => {
      fetchGlobalTickets(true); 
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalTickets = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/tickets');
      if (!res.ok) throw new Error("Server failed to respond");
      const data = await res.json();
      if (data.success) {
        setAllTickets(data.tickets);
        
        if (activeTicketIdRef.current) {
          const updatedTicket = data.tickets.find(t => t.id === activeTicketIdRef.current);
          if (updatedTicket) setActiveChatTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error("SOC Stream Error:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const markAsHumanResolved = async (ticketId) => {
    try {
      await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, newStatus: 'HUMAN_RESOLVED' })
      });
      fetchGlobalTickets();
    } catch (error) {
      console.error("Failed to resolve threat");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeChatTicket) return;
    
    setIsSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketId: activeChatTicket.id, 
          text: chatMessage, 
          sender: "CONSULTANT",
          isCriticalAlert: false 
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveChatTicket({
          ...activeChatTicket,
          messages: [...(activeChatTicket.messages || []), data.message]
        });
        setChatMessage('');
        fetchGlobalTickets();
      }
    } catch (error) {
      console.error("Failed to send message");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const criticalThreats = allTickets.filter(t => t.status === 'PENDING' || t.status === 'SCHEDULED').length;
  const scheduledCalls = allTickets.filter(t => t.status === 'SCHEDULED').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans pb-24 text-slate-300 relative">
      
      {/* Top Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Global SOC Stream
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              Clearance Level: <span className="text-cyan-400 font-bold uppercase">{session?.user?.role || 'LEAD_CONSULTANT'}</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <div className="bg-slate-950 border border-slate-800 px-6 py-2 rounded-xl text-center">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scheduled</div>
                <div className="text-xl font-black text-purple-400">{scheduledCalls}</div>
              </div>
              <div className="bg-red-950/30 border border-red-900/50 px-6 py-2 rounded-xl text-center">
                <div className="text-xs text-red-500/70 font-bold uppercase tracking-wider">Pending Action</div>
                <div className="text-xl font-black text-red-500">{criticalThreats}</div>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login?type=consultant' })} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-700 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-0">
        {isLoading ? (
          <div className="flex justify-center h-64 items-center">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : allTickets.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Network is Secure</h3>
            <p className="text-slate-500">No anomalies detected.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allTickets.map((ticket) => (
              <div key={ticket.id} className={`bg-slate-900 rounded-2xl border p-6 md:p-8 shadow-2xl transition-all ${
                (ticket.status === 'PENDING' || ticket.status === 'SCHEDULED')
                  ? 'border-red-900/50 shadow-[0_0_30px_rgba(239,68,68,0.05)]' 
                  : 'border-slate-800'
              }`}>
                
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{ticket.user?.name || "Unknown Organization"}</h3>
                    <p className="text-sm text-slate-500">{ticket.user?.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${
                      ticket.status === 'HUMAN_RESOLVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      ticket.status === 'AI_RESOLVED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 
                      ticket.status === 'SCHEDULED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Raw Telemetry</h4>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-300 text-sm">{ticket.issue}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">AI Triage Output</h4>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400 text-sm max-h-48 overflow-y-auto custom-scrollbar"
                         dangerouslySetInnerHTML={{ __html: ticket.aiResponse ? ticket.aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\n/g, '<br/>') : "No data." }}
                    />
                  </div>
                </div>

                {/* Chat & Resolve Actions */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                  
                  {/* Chat Button for Consultant */}
                  <button 
                    onClick={() => setActiveChatTicket(ticket)}
                    className="text-cyan-500 font-bold hover:text-cyan-400 flex items-center gap-2 transition-colors px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg shadow-inner"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    Communicate with Client
                    {ticket.messages?.length > 0 && (
                      <span className="bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-2 rounded-full text-[10px] ml-1">{ticket.messages.length}</span>
                    )}
                  </button>

                  {(ticket.status === 'PENDING' || ticket.status === 'SCHEDULED') && (
                    <button 
                      onClick={() => markAsHumanResolved(ticket.id)}
                      className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] ml-auto"
                    >
                      Mark as Human Resolved
                    </button>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat / Reply Modal for Consultant */}
      {activeChatTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-[80vh]">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-white">Secure Link: {activeChatTicket.user?.name}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider mt-2 inline-block ${
                  activeChatTicket.status === 'HUMAN_RESOLVED' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  Ticket: {activeChatTicket.id.slice(-6)} | {activeChatTicket.status}
                </span>
              </div>
              <button onClick={() => setActiveChatTicket(null)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Chat Messages Area */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900 custom-scrollbar">
              
              {/* Client Original Threat */}
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-600 mb-1 mx-1">ORIGINAL ALERT</span>
                <div className="bg-slate-800 text-slate-300 border border-slate-700 p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                  <p className="text-sm font-mono">{activeChatTicket.issue}</p>
                </div>
              </div>

              {activeChatTicket.messages?.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'CONSULTANT' ? 'items-end' : 'items-start'}`}>
                  <span className={`text-[10px] font-bold mb-1 mx-1 ${msg.sender === 'CONSULTANT' ? 'text-cyan-500' : 'text-slate-500'}`}>
                    {msg.sender === 'CONSULTANT' ? 'YOU (LEAD SOC)' : 'CLIENT'}
                  </span>
                  <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.sender === 'CONSULTANT' 
                      ? 'bg-cyan-900/30 text-cyan-100 border border-cyan-800/50 rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Area */}
            {activeChatTicket.status !== 'HUMAN_RESOLVED' && activeChatTicket.status !== 'AI_RESOLVED' ? (
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-3xl flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Transmit message to client..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 placeholder:text-slate-600"
                  disabled={isSendingMessage}
                />
                <button 
                  type="submit" 
                  disabled={isSendingMessage || !chatMessage.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 p-4 rounded-xl transition-colors disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            ) : (
              <div className="p-6 bg-slate-950 border-t border-slate-800 rounded-b-3xl text-center text-sm text-slate-600 font-medium">
                Transmission closed. Threat marked as resolved.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}