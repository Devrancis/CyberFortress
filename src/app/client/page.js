"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function ClientDashboard() {
  const { data: session } = useSession(); 
  
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [needsHuman, setNeedsHuman] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [isFetchingTickets, setIsFetchingTickets] = useState(true);
  
  const [schedulingTicket, setSchedulingTicket] = useState(null);
  
  const [activeChatTicket, setActiveChatTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatScrollRef = useRef(null);
  const resultRef = useRef(null);

  const activeTicketIdRef = useRef(null);
  useEffect(() => {
    activeTicketIdRef.current = activeChatTicket?.id;
  }, [activeChatTicket]);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      fetchTickets(session.user.email, false); 
      
      const interval = setInterval(() => {
        fetchTickets(session.user.email, true);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    if (aiResponse && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [aiResponse]);

  useEffect(() => {
    if (activeChatTicket && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChatTicket?.messages]);

  const fetchTickets = async (userEmail, silent = false) => {
    if (!userEmail) return; 
    if (!silent) setIsFetchingTickets(true); 
    
    try {
      const res = await fetch(`/api/tickets?email=${userEmail}`);
      const data = await res.json();
      if (data.success) {
        setTicketHistory(data.tickets);
        
        if (activeTicketIdRef.current) {
          const updatedTicket = data.tickets.find(t => t.id === activeTicketIdRef.current);
          if (updatedTicket) setActiveChatTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      if (!silent) setIsFetchingTickets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setAiResponse(''); setNeedsHuman(false);

    let finalAiResponse = "";
    let finalNeedsHuman = false;

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue }),
      });
      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const data = await res.json();
      
      if (data.success) {
        finalAiResponse = data.reply;
        finalNeedsHuman = data.needsConsultant;
      } else {
        finalAiResponse = data.error || "System error connecting to SOC framework.";
        finalNeedsHuman = true;
      }
    } catch (error) {
      finalAiResponse = "AI connection timed out. Initiating direct human escalation protocol.";
      finalNeedsHuman = true;
    }

    setAiResponse(finalAiResponse);
    setNeedsHuman(finalNeedsHuman);

    if (session?.user?.email) {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          issue: issue,
          aiResponse: finalAiResponse,
          needsHuman: finalNeedsHuman
        })
      });
      fetchTickets(session.user.email, true); 
    }

    setLoading(false);
    setIssue(''); 
  };

  const markAsScheduled = async (ticketId) => {
    try {
      await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, newStatus: 'SCHEDULED' })
      });
      setSchedulingTicket(null); 
      if (session?.user?.email) fetchTickets(session.user.email, true); 
    } catch (error) {
      console.error("Failed to update status");
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
          sender: "CLIENT",
          isCriticalAlert: activeChatTicket.status === 'PENDING' 
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveChatTicket({
          ...activeChatTicket,
          messages: [...(activeChatTicket.messages || []), data.message]
        });
        setChatMessage('');
        if (session?.user?.email) fetchTickets(session.user.email, true);
      }
    } catch (error) {
      console.error("Failed to send message");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatAIResponse = (text) => {
    if (!text) return "";
    let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>');
    return htmlText.replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Command Center</h1>
            <p className="text-slate-500 font-medium">
              Authorized User: <span className="text-cyan-700 font-bold">{session?.user?.email || 'Loading...'}</span> | Organization: {session?.user?.name || 'Loading...'}
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login?type=client' })} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 transition-colors">
             Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Submission Form */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
            <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              Report Security Anomaly
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition-all placeholder:text-slate-400 resize-none shadow-inner"
                rows="5"
                placeholder="Describe the incident..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              ></textarea>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold tracking-wide py-4 px-6 rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:text-slate-500 shadow-lg flex justify-center items-center">
                {loading ? 'Processing Telemetry...' : 'Run AI Diagnostics'}
              </button>
            </form>
          </div>
        </div>

        {/* Tracking History */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-slate-900">Tracking History</h2>
          
          {isFetchingTickets ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex justify-center items-center shadow-sm h-48">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : ticketHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              No security anomalies reported yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {ticketHistory.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket: {ticket.id.slice(-6)}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      ticket.status === 'HUMAN_RESOLVED' ? 'bg-green-100 text-green-700' : 
                      ticket.status === 'AI_RESOLVED' ? 'bg-cyan-100 text-cyan-700' : 
                      ticket.status === 'SCHEDULED' ? 'bg-purple-100 text-purple-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium mb-4 line-clamp-2">"{ticket.issue}"</p>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-4 mt-2">
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    
                    <div className="flex items-center gap-4">
                      {/* CHAT THREAD BUTTON */}
                      <button 
                        onClick={() => setActiveChatTicket(ticket)}
                        className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors px-3 py-1.5 bg-blue-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        Thread
                        {ticket.messages?.length > 0 && (
                          <span className="bg-blue-200 text-blue-800 px-1.5 rounded-full text-[10px] ml-1">{ticket.messages.length}</span>
                        )}
                      </button>

                      {ticket.status === 'PENDING' && (
                        <button 
                          onClick={() => setSchedulingTicket(ticket)}
                          className="text-orange-600 font-bold hover:text-orange-800 flex items-center gap-1 transition-colors px-3 py-1.5 bg-orange-50 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          Schedule
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Result */}
      {aiResponse && (
        <div ref={resultRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-fade-in-up">
          <div className={`rounded-3xl p-8 md:p-12 border-2 shadow-2xl transition-all duration-500 ${
            needsHuman ? 'bg-orange-950 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.2)]' : 'bg-cyan-950 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
          }`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${needsHuman ? 'text-orange-400' : 'text-cyan-400'}`}>
              Automated Triage Result
            </h3>
            <div className="text-white leading-relaxed text-lg mb-8" dangerouslySetInnerHTML={{ __html: formatAIResponse(aiResponse) }} />
            
            {needsHuman && (
              <div className="mt-8 border-t border-orange-500/50 pt-8">
                <h4 className="font-bold text-orange-400 mb-6 flex items-center gap-3 text-lg">
                  Critical Threat: Please schedule an emergency consultation below.
                </h4>
                <div className="bg-white rounded-2xl overflow-hidden h-[600px] w-full shadow-inner border border-orange-900/50 relative">
                  <iframe src="https://calendly.com/francisiyiola/cyber-shield-solutions" width="100%" height="100%" frameBorder="0"></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat / Update Thread Modal */}
      {activeChatTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col h-[80vh]">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Secure Thread: {activeChatTicket.id.slice(-6)}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider mt-2 inline-block ${
                  activeChatTicket.status === 'HUMAN_RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {activeChatTicket.status}
                </span>
              </div>
              <button onClick={() => setActiveChatTicket(null)} className="text-slate-400 hover:text-slate-600 bg-slate-200 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Chat Messages Area */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100/50">
              {/* Original Issue Message */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 mb-1 mr-1">ORIGINAL REPORT</span>
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                  <p className="text-sm">{activeChatTicket.issue}</p>
                </div>
              </div>

              {/* Dynamic Messages */}
              {activeChatTicket.messages?.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'CLIENT' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-bold text-slate-400 mb-1 mx-1">
                    {msg.sender === 'CLIENT' ? 'YOU' : 'CYBERSHIELD SOC'}
                  </span>
                  <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.sender === 'CLIENT' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Area */}
            {activeChatTicket.status !== 'HUMAN_RESOLVED' && activeChatTicket.status !== 'AI_RESOLVED' ? (
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 rounded-b-3xl flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Provide an update or answer consultant questions..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
                  disabled={isSendingMessage}
                />
                <button 
                  type="submit" 
                  disabled={isSendingMessage || !chatMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors disabled:bg-slate-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            ) : (
              <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl text-center text-sm text-slate-500 font-medium">
                This threat has been marked as resolved. The thread is closed.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {schedulingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-2xl">
            <button onClick={() => setSchedulingTicket(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold mb-6 text-white">Schedule Security Consultation</h3>
            <div className="bg-white rounded-2xl overflow-hidden h-[500px] w-full mb-6">
              <iframe src="https://calendly.com/francisiyiola/cyber-shield-solutions" width="100%" height="100%" frameBorder="0"></iframe>
            </div>
            <div className="flex justify-end border-t border-slate-800 pt-6">
              <button onClick={() => markAsScheduled(schedulingTicket.id)} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-600/20">
                I Have Booked My Slot 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}