import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, Plus, Search, Filter, ArrowUp, ArrowDown, Edit2, Copy, 
  Trash2, Eye, History, Check, X, Sparkles, Monitor, Tablet, Smartphone, 
  ThumbsUp, ThumbsDown, ExternalLink, Calendar, Tag, Globe, Clock, 
  Code, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Play, FileText, CheckCircle2, AlertCircle, RefreshCw, BarChart2, TrendingUp,
  MessageSquare, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem, FAQVersion, UnansweredSearchTerm } from '../types';
import { INITIAL_FAQ_ITEMS, INITIAL_UNANSWERED_TERMS } from '../data';

interface FaqManagementPanelProps {
  onTriggerToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

type SubTabMode = 'directory' | 'preview' | 'analytics';
type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';

const CATEGORY_PRESETS = [
  'Guest Experience',
  'Media & Audio',
  'Live Display & Broadcast',
  'Pricing & Plans',
  'Security & Privacy',
  'Technical & Hardware'
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Bahasa'
];

export default function FaqManagementPanel({ onTriggerToast }: FaqManagementPanelProps) {
  // 1. Storage & State Initialization
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const local = localStorage.getItem('kava_admin_faqs');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error("Failed to load FAQs from localStorage", e);
    }
    return INITIAL_FAQ_ITEMS;
  });

  const [unansweredTerms, setUnansweredTerms] = useState<UnansweredSearchTerm[]>(() => {
    try {
      const local = localStorage.getItem('kava_unanswered_search_terms');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error("Failed to load unanswered terms", e);
    }
    return INITIAL_UNANSWERED_TERMS;
  });

  // Save changes to localStorage & trigger global sync event
  const saveFaqs = (updated: FAQItem[]) => {
    setFaqs(updated);
    localStorage.setItem('kava_admin_faqs', JSON.stringify(updated));
    window.dispatchEvent(new Event('kava_faqs_updated'));
  };

  const saveUnansweredTerms = (updated: UnansweredSearchTerm[]) => {
    setUnansweredTerms(updated);
    localStorage.setItem('kava_unanswered_search_terms', JSON.stringify(updated));
    window.dispatchEvent(new Event('kava_faqs_updated'));
  };

  // Listen to external storage updates (e.g. from landing page feedback)
  useEffect(() => {
    const handleSync = () => {
      try {
        const localFaqs = localStorage.getItem('kava_admin_faqs');
        if (localFaqs) setFaqs(JSON.parse(localFaqs));

        const localTerms = localStorage.getItem('kava_unanswered_search_terms');
        if (localTerms) setUnansweredTerms(JSON.parse(localTerms));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('kava_faqs_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('kava_faqs_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // 2. Navigation / Filtering / Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<SubTabMode>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState('ALL');

  // Preview Mode States
  const [previewDevice, setPreviewDevice] = useState<DevicePreviewMode>('desktop');
  const [previewCategory, setPreviewCategory] = useState('ALL');
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewActiveAccordion, setPreviewActiveAccordion] = useState<number | null>(null);
  const [previewShowDrafts, setPreviewShowDrafts] = useState(false);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // Version History Modal State
  const [historyFaq, setHistoryFaq] = useState<FAQItem | null>(null);

  // 3. Computed Summary Stats
  const summary = useMemo(() => {
    const total = faqs.length;
    const published = faqs.filter(f => f.status === 'Published').length;
    const drafts = faqs.filter(f => f.status === 'Draft').length;
    const languages = Array.from(new Set(faqs.map(f => f.language || 'English'))).length;
    
    const totalViews = faqs.reduce((acc, f) => acc + (f.analytics?.views || 0), 0);
    const totalExpansions = faqs.reduce((acc, f) => acc + (f.analytics?.expansions || 0), 0);
    const totalYes = faqs.reduce((acc, f) => acc + (f.analytics?.helpfulYes || 0), 0);
    const totalNo = faqs.reduce((acc, f) => acc + (f.analytics?.helpfulNo || 0), 0);
    const helpfulRatio = (totalYes + totalNo) > 0 ? Math.round((totalYes / (totalYes + totalNo)) * 100) : 98;

    return { total, published, drafts, languages, totalViews, totalExpansions, helpfulRatio, unansweredCount: unansweredTerms.length };
  }, [faqs, unansweredTerms]);

  // Categories list derived from current items
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    CATEGORY_PRESETS.forEach(c => cats.add(c));
    faqs.forEach(f => { if (f.category) cats.add(f.category); });
    return Array.from(cats);
  }, [faqs]);

  // Filtered FAQ Items
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = faq.question.toLowerCase().includes(q) ||
                      faq.answer.toLowerCase().includes(q) ||
                      (faq.category && faq.category.toLowerCase().includes(q)) ||
                      faq.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (categoryFilter !== 'ALL' && faq.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && faq.status !== statusFilter) return false;
      if (languageFilter !== 'ALL' && (faq.language || 'English') !== languageFilter) return false;
      if (visibilityFilter !== 'ALL' && faq.visibility !== visibilityFilter) return false;

      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [faqs, searchQuery, categoryFilter, statusFilter, languageFilter, visibilityFilter]);

  // 4. CRUD & Reordering Actions
  const handleOpenCreateModal = (initialQuestion: string = '') => {
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.displayOrder)) + 1 : 1;
    setEditingFaq({
      id: `faq-${Date.now().toString().slice(-4)}`,
      question: initialQuestion,
      answer: '',
      category: 'Guest Experience',
      displayOrder: nextOrder,
      language: 'English',
      visibility: 'Public',
      status: 'Published',
      versionHistory: []
    });
    setIsEditorOpen(true);
  };

  const handleEditFaq = (faq: FAQItem) => {
    setEditingFaq({ ...faq });
    setIsEditorOpen(true);
  };

  const handleDuplicateFaq = (faq: FAQItem) => {
    const nextOrder = Math.max(...faqs.map(f => f.displayOrder)) + 1;
    const duplicated: FAQItem = {
      ...faq,
      id: `faq-${Date.now().toString().slice(-4)}`,
      question: `${faq.question} (Copy)`,
      displayOrder: nextOrder,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analytics: { views: 0, expansions: 0, helpfulYes: 0, helpfulNo: 0 },
      versionHistory: [
        {
          version: 1,
          question: `${faq.question} (Copy)`,
          answer: faq.answer,
          category: faq.category,
          modifiedAt: new Date().toISOString(),
          modifiedBy: 'SuperAdmin (Duplicate)'
        }
      ]
    };
    saveFaqs([...faqs, duplicated]);
    onTriggerToast('FAQ Duplicated', `Created draft copy of "${faq.question}".`, 'success');
  };

  const handleToggleStatus = (id: string) => {
    const updated = faqs.map(f => {
      if (f.id === id) {
        const nextStatus = f.status === 'Published' ? 'Draft' : 'Published';
        onTriggerToast(
          nextStatus === 'Published' ? 'FAQ Published' : 'FAQ Moved to Draft',
          `"${f.question}" is now ${nextStatus.toLowerCase()}.`,
          nextStatus === 'Published' ? 'success' : 'info'
        );
        return { ...f, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    saveFaqs(updated);
  };

  const handleDeleteFaq = (id: string) => {
    const target = faqs.find(f => f.id === id);
    if (!target) return;
    if (confirm(`Are you sure you want to delete FAQ item "${target.question}"?`)) {
      const updated = faqs.filter(f => f.id !== id);
      saveFaqs(updated);
      onTriggerToast('FAQ Deleted', `Removed "${target.question}".`, 'error');
    }
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === filteredFaqs.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = filteredFaqs[index];
    const targetItem = filteredFaqs[targetIndex];

    const updated = faqs.map(f => {
      if (f.id === currentItem.id) return { ...f, displayOrder: targetItem.displayOrder };
      if (f.id === targetItem.id) return { ...f, displayOrder: currentItem.displayOrder };
      return f;
    });

    saveFaqs(updated);
    onTriggerToast('Reordered', `Updated display order for FAQ items.`, 'info');
  };

  const handleSaveEditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) {
      onTriggerToast('Missing Fields', 'Question and answer are required.', 'error');
      return;
    }

    const existingIndex = faqs.findIndex(f => f.id === editingFaq.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Existing edit - update version history
      const existing = faqs[existingIndex];
      const prevHistory = existing.versionHistory || [];
      const newVersionNum = prevHistory.length + 1;

      const newHistoryEntry: FAQVersion = {
        version: newVersionNum,
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category,
        modifiedAt: now,
        modifiedBy: 'SuperAdmin'
      };

      const updatedItem: FAQItem = {
        ...existing,
        ...editingFaq,
        updatedAt: now,
        versionHistory: [newHistoryEntry, ...prevHistory]
      } as FAQItem;

      const nextList = [...faqs];
      nextList[existingIndex] = updatedItem;
      saveFaqs(nextList);
      onTriggerToast('FAQ Updated', `Saved changes to "${updatedItem.question}".`, 'success');
    } else {
      // New item creation
      const newItem: FAQItem = {
        id: editingFaq.id || `faq-${Date.now().toString().slice(-4)}`,
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category || 'Guest Experience',
        displayOrder: editingFaq.displayOrder || faqs.length + 1,
        language: editingFaq.language || 'English',
        visibility: (editingFaq.visibility as any) || 'Public',
        status: (editingFaq.status as any) || 'Published',
        scheduledPublishDate: editingFaq.scheduledPublishDate,
        createdAt: now,
        updatedAt: now,
        analytics: { views: 0, expansions: 0, helpfulYes: 0, helpfulNo: 0 },
        versionHistory: [
          {
            version: 1,
            question: editingFaq.question,
            answer: editingFaq.answer,
            category: editingFaq.category,
            modifiedAt: now,
            modifiedBy: 'SuperAdmin'
          }
        ]
      };
      saveFaqs([...faqs, newItem]);
      onTriggerToast('FAQ Created', `Published new FAQ item "${newItem.question}".`, 'success');
    }

    setIsEditorOpen(false);
    setEditingFaq(null);
  };

  const handleRestoreVersion = (faqId: string, ver: FAQVersion) => {
    const updated = faqs.map(f => {
      if (f.id === faqId) {
        return {
          ...f,
          question: ver.question,
          answer: ver.answer,
          category: ver.category || f.category,
          updatedAt: new Date().toISOString()
        };
      }
      return f;
    });
    saveFaqs(updated);
    setHistoryFaq(null);
    onTriggerToast('Version Restored', `Restored revision v${ver.version}.`, 'success');
  };

  const handleDismissUnansweredTerm = (id: string) => {
    const updated = unansweredTerms.filter(t => t.id !== id);
    saveUnansweredTerms(updated);
    onTriggerToast('Term Dismissed', 'Removed unanswered search record.', 'info');
  };

  // 5. Text Formatter Toolbar Injector
  const injectFormat = (tagType: 'bold' | 'italic' | 'list' | 'numbered' | 'link' | 'image' | 'video' | 'code') => {
    if (!editingFaq) return;
    const current = editingFaq.answer || '';
    let snippet = '';

    switch (tagType) {
      case 'bold': snippet = '**bold text**'; break;
      case 'italic': snippet = '*italic text*'; break;
      case 'list': snippet = '\n- Bullet point item 1\n- Bullet point item 2'; break;
      case 'numbered': snippet = '\n1. First step\n2. Second step'; break;
      case 'link': snippet = ' [Link Title](https://kavamedia.io) '; break;
      case 'image': snippet = '\n![Image Alt Text](https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80)\n'; break;
      case 'video': snippet = ' [Video Demo](https://kavamedia.io/video-demo) '; break;
      case 'code': snippet = '\n```\nAudio Format: AAC 320kbps\n```\n'; break;
    }

    setEditingFaq({ ...editingFaq, answer: current + snippet });
  };

  // 6. Formatted Rich Answer Renderer Helper
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;

    // Split paragraphs
    const paragraphs = text.split('\n\n');

    return (
      <div className="space-y-3 font-normal leading-relaxed text-slate-700 text-xs sm:text-sm">
        {paragraphs.map((p, pIdx) => {
          // Code block check
          if (p.startsWith('```') && p.endsWith('```')) {
            const codeLines = p.replace(/^```/, '').replace(/```$/, '').trim();
            return (
              <pre key={pIdx} className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                <code>{codeLines}</code>
              </pre>
            );
          }

          // Image markdown check ![alt](url)
          const imgMatch = p.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            return (
              <div key={pIdx} className="my-2">
                <img 
                  src={imgMatch[2]} 
                  alt={imgMatch[1]} 
                  className="rounded-xl border border-slate-200 max-h-48 object-cover w-full"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-slate-400 italic block mt-1">{imgMatch[1]}</span>
              </div>
            );
          }

          // Lists check
          if (p.includes('\n- ') || p.startsWith('- ')) {
            const items = p.split('\n- ').map(i => i.replace(/^- /, '')).filter(Boolean);
            return (
              <ul key={pIdx} className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>{formatInlineTags(item)}</li>
                ))}
              </ul>
            );
          }

          return <p key={pIdx}>{formatInlineTags(p)}</p>;
        })}
      </div>
    );
  };

  // Inline formatting parse helper (bold, links)
  const formatInlineTags = (str: string) => {
    // Simple inline parser for **bold** and [text](url)
    const parts = str.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a 
            key={idx} 
            href={linkMatch[2]} 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-900 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* 1. TOP SUMMARY METRICS & MANAGEMENT SUB-HEADER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total FAQs</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{summary.total}</span>
            <span className="text-[10px] font-bold text-emerald-600 font-mono">({summary.published} Live)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Drafts / Scheduled</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-amber-600 font-mono">{summary.drafts}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Unpublished</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Languages</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{summary.languages}</span>
            <span className="text-[10px] text-slate-600 font-bold uppercase">Supported</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Views</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{summary.totalViews}</span>
            <span className="text-[10px] text-slate-500 font-medium">Impressions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Helpful Score</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">{summary.helpfulRatio}%</span>
            <span className="text-[10px] text-emerald-700 font-bold">Positive</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[22px] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Unanswered Terms</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-rose-600 font-mono">{summary.unansweredCount}</span>
            <span className="text-[10px] text-rose-700 font-bold">Logged</span>
          </div>
        </div>

      </div>

      {/* 2. SUB-TAB SWITCHER & PRIMARY ACTION STRIP */}
      <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center space-x-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === 'directory' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Items Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('preview')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === 'preview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Device Preview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === 'analytics' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics & Search Insights</span>
            {summary.unansweredCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Create FAQ Primary Button */}
        <button
          onClick={() => handleOpenCreateModal()}
          className="w-full md:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create FAQ Item</span>
        </button>

      </div>

      {/* TAB 1: FAQ ITEMS DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-5">
          
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ question or answer..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Category: All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Status: All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Drafts Only</option>
              </select>

              {/* Language */}
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Language: All Languages</option>
                {LANGUAGE_OPTIONS.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              {/* Visibility */}
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Visibility: All</option>
                <option value="Public">Public</option>
                <option value="Restricted">Restricted</option>
                <option value="Admin Only">Admin Only</option>
              </select>

            </div>
          </div>

          {/* FAQ Items List Card Cards */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[28px] p-12 text-center text-slate-400 font-medium">
                No FAQ items found matching your filters.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div 
                  key={faq.id}
                  className={`bg-white border rounded-[24px] p-5 shadow-sm transition-all hover:border-slate-300 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                    faq.status === 'Draft' ? 'border-dashed border-slate-300 bg-slate-50/50' : 'border-slate-200'
                  }`}
                >
                  
                  {/* Order Handle & Content */}
                  <div className="flex items-start space-x-3 flex-1">
                    
                    {/* Reorder Up/Down Buttons */}
                    <div className="flex flex-col items-center justify-center space-y-1 bg-slate-100 p-1.5 rounded-2xl flex-shrink-0">
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[10px] font-black text-slate-700">#{faq.displayOrder}</span>
                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filteredFaqs.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Question & Rich Answer */}
                    <div className="space-y-2 flex-1">
                      
                      {/* Meta Tags Pill Row */}
                      <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                        
                        {/* Status */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          faq.status === 'Published' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {faq.status}
                        </span>

                        {/* Category */}
                        {faq.category && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-extrabold flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-slate-600" />
                            <span>{faq.category}</span>
                          </span>
                        )}

                        {/* Language */}
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{faq.language || 'English'}</span>
                        </span>

                        {/* Visibility */}
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold">
                          {faq.visibility}
                        </span>

                        {/* Stats views */}
                        <span className="text-[10px] text-slate-400 font-mono font-semibold ml-auto">
                          {faq.analytics?.views || 0} views • {faq.analytics?.expansions || 0} expansions
                        </span>

                      </div>

                      {/* Question */}
                      <h4 className="text-base font-extrabold text-slate-900">{faq.question}</h4>

                      {/* Rendered Formatted Answer */}
                      <div className="pt-1">
                        {renderFormattedAnswer(faq.answer)}
                      </div>

                    </div>

                  </div>

                  {/* Quick Action Toolbar */}
                  <div className="flex md:flex-col items-center justify-end space-x-1 md:space-x-0 md:space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 flex-shrink-0">
                    
                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(faq.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer w-full text-center ${
                        faq.status === 'Published'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {faq.status === 'Published' ? 'Unpublish' : 'Publish Now'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEditFaq(faq)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer w-full flex items-center justify-center space-x-1"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold hidden md:inline">Edit</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicateFaq(faq)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer w-full flex items-center justify-center space-x-1"
                      title="Duplicate Item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold hidden md:inline">Clone</span>
                    </button>

                    {/* Version History */}
                    <button
                      onClick={() => setHistoryFaq(faq)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer w-full flex items-center justify-center space-x-1"
                      title="Version History"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold hidden md:inline">History ({faq.versionHistory?.length || 1})</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteFaq(faq)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer w-full flex items-center justify-center space-x-1"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold hidden md:inline">Delete</span>
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: LIVE DEVICE PREVIEW */}
      {activeSubTab === 'preview' && (
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-6">
          
          {/* Controls Bar for Device Frame & Test Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Device Viewport:</span>
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop (100%)</span>
                </button>

                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet (768px)</span>
                </button>

                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (375px)</span>
                </button>
              </div>
            </div>

            {/* Include Drafts Toggle */}
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={previewShowDrafts}
                onChange={(e) => setPreviewShowDrafts(e.target.checked)}
                className="rounded border-slate-300 accent-slate-900 cursor-pointer"
              />
              <span>Include Unsaved Drafts in Preview</span>
            </label>

          </div>

          {/* Live Render Frame Box */}
          <div className="bg-slate-100 p-6 rounded-[28px] flex justify-center overflow-x-auto min-h-[500px]">
            <div 
              className={`bg-white rounded-[24px] shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden flex flex-col ${
                previewDevice === 'desktop' ? 'w-full max-w-4xl' :
                previewDevice === 'tablet' ? 'w-[768px]' : 'w-[375px]'
              }`}
            >
              
              {/* Fake Browser Header */}
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 text-slate-400">kavamedia.io/#faq</span>
                </div>
                <span className="text-slate-300 font-bold uppercase">LIVE PREVIEW</span>
              </div>

              {/* Landing Page FAQ Accordion Section Preview */}
              <div className="p-8 space-y-8 bg-white flex-1">
                
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Frequently Asked Questions</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Got a question?</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">Everything you need to know about setting up your KAVA memory capsule.</p>
                </div>

                {/* Preview Search */}
                <div className="max-w-md mx-auto relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Preview Category Pills */}
                <div className="flex items-center justify-center space-x-1.5 overflow-x-auto pb-2">
                  <button
                    onClick={() => setPreviewCategory('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      previewCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Topics
                  </button>
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPreviewCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                        previewCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Accordion Preview Items */}
                <div className="space-y-3">
                  {faqs
                    .filter(f => (previewShowDrafts ? true : f.status === 'Published'))
                    .filter(f => previewCategory === 'ALL' || f.category === previewCategory)
                    .filter(f => !previewSearch || f.question.toLowerCase().includes(previewSearch.toLowerCase()) || f.answer.toLowerCase().includes(previewSearch.toLowerCase()))
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((faq, index) => (
                      <div 
                        key={faq.id} 
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                      >
                        <button
                          onClick={() => setPreviewActiveAccordion(previewActiveAccordion === index ? null : index)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer text-slate-900"
                        >
                          <span>{faq.question}</span>
                          <span className="text-slate-900 text-lg font-mono">
                            {previewActiveAccordion === index ? '−' : '+'}
                          </span>
                        </button>
                        
                        {previewActiveAccordion === index && (
                          <div className="px-5 pb-5 text-left border-t border-slate-50 pt-3">
                            {renderFormattedAnswer(faq.answer)}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ANALYTICS & UNANSWERED SEARCH TERMS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top Rankings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Most Viewed FAQs */}
            <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-extrabold text-slate-900">Most Viewed FAQ Questions</h3>
              </div>
              <div className="space-y-3">
                {[...faqs]
                  .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
                  .slice(0, 5)
                  .map((f, i) => (
                    <div key={f.id} className="p-3 bg-slate-50 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900 line-clamp-1">#{i + 1}. {f.question}</span>
                        <span className="font-mono text-slate-900">{f.analytics?.views || 0} views</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-slate-900 h-full rounded-full" 
                          style={{ width: `${Math.min(100, ((f.analytics?.views || 0) / (summary.totalViews || 1)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Most Expanded FAQs */}
            <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-extrabold text-slate-900">Most Expanded FAQ Items</h3>
              </div>
              <div className="space-y-3">
                {[...faqs]
                  .sort((a, b) => (b.analytics?.expansions || 0) - (a.analytics?.expansions || 0))
                  .slice(0, 5)
                  .map((f, i) => (
                    <div key={f.id} className="p-3 bg-slate-50 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900 line-clamp-1">#{i + 1}. {f.question}</span>
                        <span className="font-mono text-slate-900">{f.analytics?.expansions || 0} expansions</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-slate-900 h-full rounded-full" 
                          style={{ width: `${Math.min(100, ((f.analytics?.expansions || 0) / (summary.totalExpansions || 1)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          {/* Unanswered Search Terms Log Table */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Unanswered Landing Page Search Terms</h3>
                <p className="text-xs text-slate-500">Queries typed by visitors that yielded zero matching FAQ items. Click "Create FAQ" to address user demand immediately.</p>
              </div>
              {unansweredTerms.length > 0 && (
                <button
                  onClick={() => saveUnansweredTerms([])}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Clear All Logs
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Search Query Term</th>
                    <th className="px-4 py-3 text-center">Unmatched Count</th>
                    <th className="px-4 py-3">Last Searched</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {unansweredTerms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">
                        No unanswered search terms logged. All user search queries matched published FAQs!
                      </td>
                    </tr>
                  ) : (
                    unansweredTerms.map(term => (
                      <tr key={term.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          "{term.term}"
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-rose-600">
                          {term.count} times
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-[10px]">
                          {new Date(term.lastSearched).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                handleOpenCreateModal(term.term);
                                handleDismissUnansweredTerm(term.id);
                              }}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-extrabold transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Create FAQ</span>
                            </button>
                            <button
                              onClick={() => handleDismissUnansweredTerm(term.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Dismiss"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. MODAL: FAQ ITEM EDITOR & RICH FORMATTER */}
      <AnimatePresence>
        {isEditorOpen && editingFaq && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingFaq.id && faqs.some(f => f.id === editingFaq.id) ? 'Edit FAQ Item' : 'Create New FAQ Item'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditorSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Question */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    value={editingFaq.question || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    placeholder="e.g. Do guests need to download an app?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Category & Language Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                    <input
                      type="text"
                      list="category-suggestions"
                      value={editingFaq.category || ''}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      placeholder="e.g. Guest Experience"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    <datalist id="category-suggestions">
                      {availableCategories.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Language</label>
                    <select
                      value={editingFaq.language || 'English'}
                      onChange={(e) => setEditingFaq({ ...editingFaq, language: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                    >
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status, Visibility & Order Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={editingFaq.status || 'Published'}
                      onChange={(e) => setEditingFaq({ ...editingFaq, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Visibility</label>
                    <select
                      value={editingFaq.visibility || 'Public'}
                      onChange={(e) => setEditingFaq({ ...editingFaq, visibility: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                    >
                      <option value="Public">Public</option>
                      <option value="Restricted">Restricted</option>
                      <option value="Admin Only">Admin Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingFaq.displayOrder ?? 1}
                      onChange={(e) => setEditingFaq({ ...editingFaq, displayOrder: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rich Format Answer Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Answer Content *</label>
                    
                    {/* Toolbar Injector Buttons */}
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <button type="button" onClick={() => injectFormat('bold')} className="p-1 hover:bg-white rounded cursor-pointer" title="Bold">
                        <Bold className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('italic')} className="p-1 hover:bg-white rounded cursor-pointer" title="Italic">
                        <Italic className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('list')} className="p-1 hover:bg-white rounded cursor-pointer" title="Bullet List">
                        <List className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('numbered')} className="p-1 hover:bg-white rounded cursor-pointer" title="Numbered List">
                        <ListOrdered className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('link')} className="p-1 hover:bg-white rounded cursor-pointer" title="Insert Link">
                        <LinkIcon className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('image')} className="p-1 hover:bg-white rounded cursor-pointer" title="Insert Image">
                        <ImageIcon className="w-3 h-3 text-slate-700" />
                      </button>
                      <button type="button" onClick={() => injectFormat('code')} className="p-1 hover:bg-white rounded cursor-pointer" title="Insert Code Block">
                        <Code className="w-3 h-3 text-slate-700" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    required
                    rows={5}
                    value={editingFaq.answer || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    placeholder="Type answer content... Supports Markdown tags like **bold**, [Links](url), and image links."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Formatted Answer Live Preview Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Formatted Answer Live Preview</span>
                  <div className="pt-1">
                    {renderFormattedAnswer(editingFaq.answer || 'Type answer content above to preview formatted layout...')}
                  </div>
                </div>

                {/* Buttons Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Save FAQ Item
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: VERSION HISTORY */}
      <AnimatePresence>
        {historyFaq && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-slate-800" />
                  <h3 className="text-base font-extrabold text-slate-900">Version Audit History</h3>
                </div>
                <button
                  onClick={() => setHistoryFaq(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Showing historical versions for "{historyFaq.question}":
                </p>

                {(historyFaq.versionHistory && historyFaq.versionHistory.length > 0) ? (
                  historyFaq.versionHistory.map((ver) => (
                    <div key={ver.version} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900">Version v{ver.version}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(ver.modifiedAt).toLocaleString()} ({ver.modifiedBy})
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">{ver.question}</h5>
                      <div className="text-xs text-slate-600 font-normal">
                        {ver.answer}
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleRestoreVersion(historyFaq.id, ver)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Restore This Version
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No prior version history recorded for this FAQ item.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
