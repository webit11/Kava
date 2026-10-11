import React, { useState, useRef } from 'react';
import { 
  Search, Filter, Send, Lock, UserCheck, Shield, AlertCircle, CheckCircle2, 
  Clock, Paperclip, Image as ImageIcon, FileText, X, Sparkles, ChevronDown, 
  User, MessageSquare, History, Terminal, Star, ArrowUpRight, Check, Tag, RefreshCw
} from 'lucide-react';
import { SupportTicket, SupportTicketMessage, SupportTicketMessageAttachment } from '../types';

interface SupportQueueCenterProps {
  tickets: SupportTicket[];
  onUpdateTickets: (updated: SupportTicket[]) => void;
  onTriggerToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  currentAgentName?: string;
}

const QUICK_REPLY_TEMPLATES = [
  {
    title: 'Request Browser & Console Logs',
    text: 'Hello! To help us diagnose this issue faster, could you please confirm your browser version and share any error messages appearing in your browser console?'
  },
  {
    title: 'Bug Escalated to Engineering',
    text: 'Thank you for reporting this issue. I have escalated this bug to our core platform engineering team with high priority. We will notify you as soon as a patch is deployed.'
  },
  {
    title: 'Billing & Refund Confirmation',
    text: 'Your workspace subscription details have been updated accordingly. If you requested a refund or invoice adjustment, it will reflect on your statement within 2-3 business days.'
  },
  {
    title: 'Issue Resolved Inquiry',
    text: 'We have applied a fix for the reported issue. Please refresh your browser or reload the applet and let us know if everything is working smoothly now!'
  }
];

const AGENT_LIST = ['Sarah Connor', 'Artha Wibawa', 'Alex Chen', 'Elena Rostova', 'Devon Webb'];

export default function SupportQueueCenter({
  tickets,
  onUpdateTickets,
  onTriggerToast,
  currentAgentName = 'Artha Wibawa'
}: SupportQueueCenterProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(() => tickets[0]?.id || null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [assignedFilter, setAssignedFilter] = useState<string>('All');

  // Reply Composer state
  const [replyMode, setReplyMode] = useState<'reply' | 'internal'>('reply');
  const [replyText, setReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<SupportTicketMessageAttachment[]>([]);
  const [activeTabRight, setActiveTabRight] = useState<'details' | 'audit' | 'logs'>('details');
  const [selectedImageModalUrl, setSelectedImageModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active selected ticket
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  // Filtered tickets list
  const filteredTickets = tickets.filter(tkt => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = tkt.subject?.toLowerCase().includes(q);
      const matchUser = tkt.user?.toLowerCase().includes(q) || tkt.userEmail?.toLowerCase().includes(q);
      const matchId = tkt.id?.toLowerCase().includes(q);
      const matchWs = tkt.workspaceName?.toLowerCase().includes(q);
      if (!matchSubject && !matchUser && !matchId && !matchWs) return false;
    }

    // Status filter
    if (statusFilter !== 'All' && tkt.status !== statusFilter) return false;

    // Priority filter
    if (priorityFilter !== 'All' && tkt.priority !== priorityFilter) return false;

    // Category filter
    if (categoryFilter !== 'All' && tkt.category !== categoryFilter) return false;

    // Unread filter
    if (unreadOnly && !tkt.unreadByAdmin) return false;

    // Assigned filter
    if (assignedFilter === 'Me' && tkt.assignedTo !== currentAgentName) return false;
    if (assignedFilter === 'Unassigned' && tkt.assignedTo && tkt.assignedTo !== 'Unassigned') return false;
    if (assignedFilter !== 'All' && assignedFilter !== 'Me' && assignedFilter !== 'Unassigned' && tkt.assignedTo !== assignedFilter) return false;

    return true;
  });

  // Ticket stats
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const waitingUserCount = tickets.filter(t => t.status === 'Waiting for User').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const unreadCount = tickets.filter(t => t.unreadByAdmin).length;

  // Select ticket handler
  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
    // Mark read by admin
    const updated = tickets.map(t => {
      if (t.id === id) {
        return { ...t, unreadByAdmin: false };
      }
      return t;
    });
    onUpdateTickets(updated);
  };

  // Status Change
  const handleChangeStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    const nowIso = new Date().toISOString();
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const audit = t.auditLogs || [];
        return {
          ...t,
          status: newStatus,
          lastActivity: nowIso,
          unreadByHost: true,
          auditLogs: [
            ...audit,
            {
              id: `log-${Date.now()}`,
              actor: currentAgentName,
              action: `Changed status to "${newStatus}"`,
              timestamp: nowIso
            }
          ]
        };
      }
      return t;
    });
    onUpdateTickets(updated);
    if (onTriggerToast) {
      onTriggerToast('Ticket Updated', `Status set to ${newStatus} for #${ticketId}`, 'success');
    }
  };

  // Priority Change
  const handleChangePriority = (ticketId: string, newPriority: SupportTicket['priority']) => {
    const nowIso = new Date().toISOString();
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const audit = t.auditLogs || [];
        return {
          ...t,
          priority: newPriority,
          lastActivity: nowIso,
          auditLogs: [
            ...audit,
            {
              id: `log-${Date.now()}`,
              actor: currentAgentName,
              action: `Updated priority to "${newPriority}"`,
              timestamp: nowIso
            }
          ]
        };
      }
      return t;
    });
    onUpdateTickets(updated);
    if (onTriggerToast) {
      onTriggerToast('Priority Updated', `Priority set to ${newPriority} for #${ticketId}`, 'info');
    }
  };

  // Assign Agent
  const handleAssignAgent = (ticketId: string, agent: string) => {
    const nowIso = new Date().toISOString();
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const audit = t.auditLogs || [];
        return {
          ...t,
          assignedTo: agent,
          lastActivity: nowIso,
          auditLogs: [
            ...audit,
            {
              id: `log-${Date.now()}`,
              actor: currentAgentName,
              action: `Reassigned ticket to ${agent}`,
              timestamp: nowIso
            }
          ]
        };
      }
      return t;
    });
    onUpdateTickets(updated);
    if (onTriggerToast) {
      onTriggerToast('Agent Assigned', `Ticket assigned to ${agent}`, 'success');
    }
  };

  // File Attachment Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: SupportTicketMessageAttachment[] = [];
    Array.from(files).forEach((file: File) => {
      const isImg = file.type.startsWith('image/');
      const fakeUrl = isImg ? URL.createObjectURL(file) : '#';
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: fakeUrl,
        type: file.type
      });
    });

    setReplyAttachments(prev => [...prev, ...newAttachments]);
  };

  // Send Reply or Internal Note
  const handleSendReply = () => {
    if (!selectedTicket || (!replyText.trim() && replyAttachments.length === 0)) return;

    const nowIso = new Date().toISOString();
    const isInternal = replyMode === 'internal';

    const newMessage: SupportTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      senderName: currentAgentName,
      text: replyText.trim(),
      timestamp: nowIso,
      isInternalNote: isInternal,
      attachments: replyAttachments.length > 0 ? replyAttachments : undefined
    };

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        const audit = t.auditLogs || [];
        // If public reply, set status to Waiting for User if open
        const newStatus = (!isInternal && t.status === 'Open') ? 'In Progress' : t.status;
        return {
          ...t,
          status: newStatus,
          lastActivity: nowIso,
          unreadByHost: !isInternal, // Host gets unread notification if public reply
          messages: [...t.messages, newMessage],
          auditLogs: [
            ...audit,
            {
              id: `log-${Date.now()}`,
              actor: currentAgentName,
              action: isInternal ? 'Added an internal staff note' : 'Sent public reply to customer',
              timestamp: nowIso
            }
          ]
        };
      }
      return t;
    });

    onUpdateTickets(updated);
    setReplyText('');
    setReplyAttachments([]);

    if (onTriggerToast) {
      onTriggerToast(
        isInternal ? 'Internal Note Saved' : 'Reply Sent',
        isInternal ? 'Internal note visible only to support staff' : `Message sent to ${selectedTicket.user}`,
        'success'
      );
    }
  };

  // Insert Template
  const handleInsertTemplate = (templateText: string) => {
    setReplyText(prev => prev ? `${prev}\n\n${templateText}` : templateText);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Waiting for User':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5 text-left animate-fade-in">
      
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <button
          onClick={() => { setStatusFilter('All'); setUnreadOnly(false); }}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            statusFilter === 'All' && !unreadOnly ? 'bg-slate-900 text-white border-transparent shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">Total Tickets</span>
          <span className="text-xl font-black">{totalCount}</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Open'); setUnreadOnly(false); }}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            statusFilter === 'Open' ? 'bg-slate-900 text-white border-transparent shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">Open Queue</span>
          <span className="text-xl font-black">{openCount}</span>
        </button>

        <button
          onClick={() => { setStatusFilter('In Progress'); setUnreadOnly(false); }}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            statusFilter === 'In Progress' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">In Progress</span>
          <span className="text-xl font-black">{inProgressCount}</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Waiting for User'); setUnreadOnly(false); }}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            statusFilter === 'Waiting for User' ? 'bg-slate-800 text-white border-transparent shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">Awaiting User</span>
          <span className="text-xl font-black">{waitingUserCount}</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Resolved'); setUnreadOnly(false); }}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            statusFilter === 'Resolved' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">Resolved</span>
          <span className="text-xl font-black">{resolvedCount}</span>
        </button>

        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            unreadOnly ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">Unread</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black">{unreadCount}</span>
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
            )}
          </div>
        </button>
      </div>

      {/* Search & Comprehensive Filter Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, ID, user, workspace..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for User">Waiting for User</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Assigned Agent Select */}
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Assignees</option>
            <option value="Me">Assigned to Me ({currentAgentName})</option>
            <option value="Unassigned">Unassigned</option>
            {AGENT_LIST.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {(statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || unreadOnly || assignedFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setCategoryFilter('All');
                setUnreadOnly(false);
                setAssignedFilter('All');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* Main 3-Column Support Center View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[600px]">
        
        {/* COLUMN 1: Ticket Queue List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden max-h-[750px]">
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">
              Filtered Queue ({filteredTickets.length})
            </h3>
            {unreadOnly && (
              <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Unread Only
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Filter className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No matching tickets found</p>
                <p className="text-[11px] text-slate-400">Try loosening your search or filters.</p>
              </div>
            ) : (
              filteredTickets.map(tkt => {
                const isSelected = tkt.id === selectedTicketId;
                return (
                  <button
                    key={tkt.id}
                    onClick={() => handleSelectTicket(tkt.id)}
                    className={`w-full p-4 text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-slate-100/80 border-l-4 border-slate-500 pl-3.5 shadow-3xs' 
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-900 font-extrabold">#{tkt.id}</span>
                          {tkt.unreadByAdmin && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Unread activity"></span>
                          )}
                        </div>
                        <span>{new Date(tkt.lastActivity || tkt.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-950 line-clamp-2 leading-snug">
                        {tkt.subject}
                      </h4>

                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold text-slate-700">{tkt.user}</span>
                        <span>•</span>
                        <span className="truncate">{tkt.workspaceName || 'Personal Workspace'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono tracking-wider border ${getPriorityBadgeClass(tkt.priority)}`}>
                          {tkt.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono tracking-wider border ${getStatusBadgeClass(tkt.status)}`}>
                          {tkt.status}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]" title={`Assigned: ${tkt.assignedTo || 'Unassigned'}`}>
                        {tkt.assignedTo ? `@${tkt.assignedTo.split(' ')[0]}` : 'Unassigned'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* COLUMN 2 & 3: Ticket Conversation Thread & Details Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden max-h-[750px]">
          
          {selectedTicket ? (
            <>
              {/* Ticket Header Bar */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    <span>Ticket #{selectedTicket.id}</span>
                    <span>•</span>
                    <span className="text-slate-900 font-extrabold">{selectedTicket.category}</span>
                    <span>•</span>
                    <span>Created {new Date(selectedTicket.created).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                    {selectedTicket.subject}
                  </h2>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 font-medium pt-0.5">
                    <span className="font-bold text-slate-900">{selectedTicket.user}</span>
                    <span className="text-slate-400">({selectedTicket.userEmail || 'no-email@kava.co'})</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                      {selectedTicket.workspaceName || 'Workspace'}
                    </span>
                  </div>
                </div>

                {/* Header Action Selects */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  
                  {/* Priority Changer */}
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handleChangePriority(selectedTicket.id, e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-3xs cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>

                  {/* Status Changer */}
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleChangeStatus(selectedTicket.id, e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-900 shadow-3xs cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for User">Waiting for User</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {/* Assign Agent Select */}
                  <select
                    value={selectedTicket.assignedTo || 'Unassigned'}
                    onChange={(e) => handleAssignAgent(selectedTicket.id, e.target.value)}
                    className="bg-slate-900 text-white border-transparent rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    <option value="Unassigned">Assign Agent...</option>
                    {AGENT_LIST.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Main Content Workspace Split (Conversation vs Info Sidebar) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                
                {/* Conversation Stream (8 cols) */}
                <div className="md:col-span-8 flex flex-col border-r border-slate-100 bg-slate-50/30 overflow-hidden">
                  
                  {/* Messages Feed */}
                  <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[420px]">
                    
                    {/* System Header Info Banner */}
                    <div className="bg-slate-100 border border-slate-200/80 rounded-2xl p-3 text-[11px] text-slate-600 font-mono space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>🔐 SECURE SUPPORT TICKET CHANNEL COMPILATION</span>
                        <span>{new Date(selectedTicket.created).toLocaleString()}</span>
                      </div>
                      <p>Category: {selectedTicket.category} | Priority: {selectedTicket.priority} | Agent: {selectedTicket.assignedTo || 'Unassigned'}</p>
                    </div>

                    {/* Messages List */}
                    {selectedTicket.messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      const isInternal = msg.isInternalNote;

                      if (isInternal) {
                        return (
                          <div key={msg.id} className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-950 shadow-3xs">
                            <div className="flex items-center justify-between font-mono text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                              <div className="flex items-center space-x-1.5">
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>INTERNAL STAFF NOTE • {msg.senderName}</span>
                              </div>
                              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                            
                            {/* Note Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="pt-2 flex flex-wrap gap-2">
                                {msg.attachments.map((att, i) => (
                                  <div key={i} className="bg-white/80 border border-amber-200 rounded-lg px-2.5 py-1 text-[10px] font-mono flex items-center space-x-1.5">
                                    <Paperclip className="w-3 h-3 text-amber-600" />
                                    <span className="truncate max-w-[120px]">{att.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] space-y-1.5 ${isAdmin ? 'text-right' : 'text-left'}`}>
                            
                            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 px-1">
                              <span className="font-bold text-slate-700">{msg.senderName || (isAdmin ? 'KAVA Support' : selectedTicket.user)}</span>
                              <span>•</span>
                              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-3xs whitespace-pre-wrap ${
                              isAdmin 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                            }`}>
                              <p>{msg.text}</p>

                              {/* Message Attachments */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200/30 space-y-2">
                                  {msg.attachments.map((att, attIdx) => (
                                    <div key={attIdx} className="flex items-center space-x-2">
                                      {att.type?.startsWith('image/') || att.url?.startsWith('data:image') || att.url?.endsWith('.png') || att.url?.endsWith('.jpg') ? (
                                        <div className="space-y-1">
                                          <img 
                                            src={att.url} 
                                            alt={att.name}
                                            onClick={() => setSelectedImageModalUrl(att.url)}
                                            className="max-h-40 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-200" 
                                          />
                                          <span className="text-[9px] font-mono block opacity-70">{att.name} ({att.size || 'Attachment'})</span>
                                        </div>
                                      ) : (
                                        <a
                                          href={att.url || '#'}
                                          download={att.name}
                                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-colors ${
                                            isAdmin ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                          }`}
                                        >
                                          <Paperclip className="w-3.5 h-3.5" />
                                          <span className="truncate max-w-[150px]">{att.name}</span>
                                          {att.size && <span className="opacity-60">({att.size})</span>}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}

                  </div>

                  {/* Quick Reply Templates Toolbar */}
                  <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200/80 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 uppercase tracking-wider">Quick Templates:</span>
                    {QUICK_REPLY_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInsertTemplate(tpl.text)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-semibold shrink-0 text-[11px] cursor-pointer shadow-3xs"
                      >
                        + {tpl.title}
                      </button>
                    ))}
                  </div>

                  {/* Reply Composer Box */}
                  <div className={`p-4 border-t border-slate-200 bg-white space-y-3 ${replyMode === 'internal' ? 'bg-amber-50/50' : ''}`}>
                    
                    {/* Toggle Mode Bar */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setReplyMode('reply')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            replyMode === 'reply' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Public Customer Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyMode('internal')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                            replyMode === 'internal' ? 'bg-amber-400 text-amber-950 shadow-3xs' : 'text-slate-500 hover:text-amber-900'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          <span>Internal Staff Note</span>
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {replyMode === 'reply' ? 'Visible to workspace host' : 'Staff only • Hidden from host'}
                      </span>
                    </div>

                    {/* Text Input Area */}
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        replyMode === 'reply' 
                          ? `Compose official response to ${selectedTicket.user}...` 
                          : 'Write an internal note for engineers or support specialists...'
                      }
                      className={`w-full border rounded-2xl p-3 text-xs font-medium focus:outline-none ${
                        replyMode === 'internal' 
                          ? 'bg-amber-50 border-amber-300 text-amber-950 focus:border-amber-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                      }`}
                    />

                    {/* Pending Attachments chips */}
                    {replyAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {replyAttachments.map((att, i) => (
                          <div key={i} className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-mono flex items-center space-x-2">
                            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate max-w-[140px]">{att.name}</span>
                            <button
                              type="button"
                              onClick={() => setReplyAttachments(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Controls Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          multiple
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1.5"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Attach Files</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleSendReply}
                        disabled={!replyText.trim() && replyAttachments.length === 0}
                        className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 shadow-sm cursor-pointer disabled:opacity-40 ${
                          replyMode === 'internal' 
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{replyMode === 'internal' ? 'Save Internal Note' : 'Send Public Reply'}</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* Info & Metadata Right Sidebar (4 cols) */}
                <div className="md:col-span-4 p-4 space-y-4 overflow-y-auto max-h-[600px] bg-white">
                  
                  {/* Right Tab Selector */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold text-slate-600">
                    <button
                      onClick={() => setActiveTabRight('details')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        activeTabRight === 'details' ? 'bg-white text-slate-900 shadow-3xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Context Details
                    </button>
                    <button
                      onClick={() => setActiveTabRight('audit')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        activeTabRight === 'audit' ? 'bg-white text-slate-900 shadow-3xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Audit Trail
                    </button>
                    {selectedTicket.systemDetails?.hasLogsAttached && (
                      <button
                        onClick={() => setActiveTabRight('logs')}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeTabRight === 'logs' ? 'bg-white text-slate-900 shadow-3xs' : 'hover:text-slate-900'
                        }`}
                      >
                        Console
                      </button>
                    )}
                  </div>

                  {activeTabRight === 'details' && (
                    <div className="space-y-4 text-xs">
                      
                      {/* Customer Info Card */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                        <h4 className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-400">Customer Metadata</h4>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{selectedTicket.user}</p>
                          <p className="text-slate-500 font-mono text-[11px]">{selectedTicket.userEmail || 'sofia.chen@weddingmail.com'}</p>
                          <p className="text-slate-600 font-medium">Workspace: <strong className="text-slate-800">{selectedTicket.workspaceName || 'Rodriguez-Chen Wedding'}</strong></p>
                        </div>
                      </div>

                      {/* System Environment */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 font-mono text-[11px]">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Environmental Trace</h4>
                        <div className="space-y-1 text-slate-700">
                          <p><strong className="text-slate-900">App Version:</strong> {selectedTicket.systemDetails?.appVersion || 'v2.4.1-prod'}</p>
                          <p><strong className="text-slate-900">Device:</strong> {selectedTicket.systemDetails?.device || 'MacBook Pro'}</p>
                          <p className="truncate"><strong className="text-slate-900">Browser:</strong> {selectedTicket.systemDetails?.browser || 'Safari 17.4'}</p>
                          <p><strong className="text-slate-900">Logs Attached:</strong> {selectedTicket.systemDetails?.hasLogsAttached ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      {/* Satisfaction Rating Module */}
                      {selectedTicket.satisfactionRating && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5 text-emerald-950">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase font-mono tracking-wider text-emerald-700">Customer Satisfaction</span>
                            <div className="flex items-center space-x-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-black text-xs text-emerald-950">{selectedTicket.satisfactionRating.score} / 5</span>
                            </div>
                          </div>
                          {selectedTicket.satisfactionRating.feedback && (
                            <p className="text-[11px] italic text-emerald-800 font-medium">"{selectedTicket.satisfactionRating.feedback}"</p>
                          )}
                        </div>
                      )}

                      {/* Overall Ticket Attachments */}
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-400">Ticket File Attachments</h4>
                          <div className="space-y-1">
                            {selectedTicket.attachments.map((att, attI) => (
                              <a
                                key={attI}
                                href={att.url || '#'}
                                download={att.name}
                                className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors"
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  <Paperclip className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="font-bold text-slate-800 truncate text-[11px]">{att.name}</span>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400 shrink-0">{att.size}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {activeTabRight === 'audit' && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-400">Timeline & Activity Logs</h4>
                      
                      {(!selectedTicket.auditLogs || selectedTicket.auditLogs.length === 0) ? (
                        <p className="text-slate-400 text-xs italic">No activity logs recorded yet.</p>
                      ) : (
                        <div className="relative pl-4 space-y-3 border-l border-slate-200 text-xs">
                          {selectedTicket.auditLogs.map((log) => (
                            <div key={log.id} className="relative space-y-0.5">
                              <div className="w-2 h-2 rounded-full bg-slate-900 absolute -left-[21px] top-1"></div>
                              <p className="font-bold text-slate-900">{log.action}</p>
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                <span>by {log.actor}</span>
                                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTabRight === 'logs' && selectedTicket.systemDetails?.systemLogs && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-400">Console Trace Output</h4>
                      <div className="bg-slate-950 text-emerald-400 p-3 rounded-2xl font-mono text-[10px] space-y-1 max-h-80 overflow-y-auto leading-relaxed border border-slate-800/40">
                        {selectedTicket.systemDetails.systemLogs.map((logStr, lIdx) => (
                          <div key={lIdx} className="break-all">{logStr}</div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-900">No Support Ticket Selected</h3>
              <p className="text-xs text-slate-500 max-w-xs">Select a support ticket from the left queue to respond, add internal staff notes, or change priority.</p>
            </div>
          )}

        </div>

      </div>

      {/* Image Preview Modal */}
      {selectedImageModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImageModalUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImageModalUrl} 
              alt="Attachment Full View" 
              className="max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-800/40" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
