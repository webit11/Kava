import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Archive, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  HardDrive, 
  Users, 
  Calendar, 
  User, 
  Building, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Settings, 
  Play, 
  Pause, 
  CheckCircle2, 
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { KavaEvent, KavaContribution } from '../types';
import EventCardContextMenu from './EventCardContextMenu';
import ContextualGuidanceCard from './ContextualGuidanceCard';

interface EventsCatalogTabProps {
  events: KavaEvent[];
  selectedEvent: KavaEvent;
  onSelectEvent: (event: KavaEvent) => void;
  onUpdateEventSettings: (eventId: string, updates: Partial<KavaEvent>) => void;
  setEvents?: React.Dispatch<React.SetStateAction<KavaEvent[]>>;
  contributions: KavaContribution[];
  onLaunchLive: () => void;
  workspaceBrandAccentColor: string;
  currentWorkspace: { id: string; name: string; host: string };
  setToast: (toast: { title: string; description: string; items: string[] } | null) => void;
  setActiveTab: (tab: any) => void;
  setIsEventLevel: (val: boolean) => void;
  onCreateEvent?: () => void;
}

type SortField = 'name' | 'createdDate' | 'lastActivity' | 'contributionCount' | 'storageBytes' | 'status';
type SortOrder = 'asc' | 'desc';

export default function EventsCatalogTab({
  events,
  selectedEvent,
  onSelectEvent,
  onUpdateEventSettings,
  setEvents,
  contributions,
  onLaunchLive,
  workspaceBrandAccentColor,
  currentWorkspace,
  setToast,
  setActiveTab,
  setIsEventLevel,
  onCreateEvent
}: EventsCatalogTabProps) {
  // Views
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // Search & Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [ownerFilter, setOwnerFilter] = useState<string>('All');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('All');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('lastActivity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Active Dropdowns/Menus
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Popover States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Close menus & popovers on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setActiveMenuId(null);
      }
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper: map a raw event to include enriched professional metrics
  const getExtendedEventData = useMemo(() => {
    return (ev: KavaEvent) => {
      let owner = "Host Workspace";
      let workspaceName = currentWorkspace.name;
      let createdDate = "2026-07-01";
      let lastActivity = "2026-07-20T10:00:00Z";
      let storageUsage = "45 MB";
      let storageBytes = 45 * 1024 * 1024;
      
      if (ev.id === 'evt-1') {
        owner = "Sophia Chen";
        workspaceName = "Rodriguez-Chen Wedding";
        createdDate = "2026-03-10";
        lastActivity = "2026-07-20T19:30:00Z";
        storageUsage = "1.2 GB";
        storageBytes = 1.2 * 1024 * 1024 * 1024;
      } else if (ev.id === 'evt-2') {
        owner = "Devon Webb";
        workspaceName = "Webb Corp Conferences";
        createdDate = "2026-05-15";
        lastActivity = "2026-07-19T14:15:00Z";
        storageUsage = "340 MB";
        storageBytes = 340 * 1024 * 1024;
      } else if (ev.id === 'evt-3') {
        owner = "Arthur Dent";
        workspaceName = "Marcus Birthday Lounge";
        createdDate = "2026-01-20";
        lastActivity = "2026-05-14T23:00:00Z";
        storageUsage = "2.1 GB";
        storageBytes = 2.1 * 1024 * 1024 * 1024;
      } else {
        // Enriched values for custom created events
        owner = currentWorkspace.host;
        workspaceName = currentWorkspace.name;
        createdDate = ev.date || "2026-07-20";
        lastActivity = "2026-07-20T20:00:00Z";
        storageUsage = "50 MB";
        storageBytes = 50 * 1024 * 1024;
      }

      const contributionCount = contributions.filter(c => c.eventId === ev.id).length || 
        (ev.id === 'evt-1' ? 84 : ev.id === 'evt-2' ? 42 : ev.id === 'evt-3' ? 31 : 0);

      const guestCount = ev.guestCount || (ev.id === 'evt-1' ? 84 : ev.id === 'evt-2' ? 42 : ev.id === 'evt-3' ? 31 : 0);
      const visibility = ev.settings?.requireApproval ? "Private" : "Public";

      // Normalize event status (default to active if missing)
      const statusValue = ev.status || 'active';

      return {
        ...ev,
        status: statusValue,
        owner,
        workspaceName,
        createdDate,
        lastActivity,
        storageUsage,
        storageBytes,
        contributionCount,
        guestCount,
        visibility
      };
    };
  }, [contributions, currentWorkspace]);

  // Compute all enriched events list
  const enrichedEvents = useMemo(() => {
    return events.map(getExtendedEventData);
  }, [events, getExtendedEventData]);

  // Unique filter lists compiled dynamically
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(enrichedEvents.map(e => e.type)));
  }, [enrichedEvents]);

  const uniqueOwners = useMemo(() => {
    return Array.from(new Set(enrichedEvents.map(e => e.owner)));
  }, [enrichedEvents]);

  const uniqueWorkspaces = useMemo(() => {
    return Array.from(new Set(enrichedEvents.map(e => e.workspaceName)));
  }, [enrichedEvents]);

  // Filter & Search Logic
  const filteredEvents = useMemo(() => {
    return enrichedEvents.filter(ev => {
      // Search query
      const matchQuery = 
        ev.name.toLowerCase().includes(search.toLowerCase()) ||
        ev.type.toLowerCase().includes(search.toLowerCase()) ||
        ev.location.toLowerCase().includes(search.toLowerCase()) ||
        ev.code.toLowerCase().includes(search.toLowerCase()) ||
        ev.owner.toLowerCase().includes(search.toLowerCase());
      
      // Status
      const matchStatus = statusFilter === 'All' || ev.status.toLowerCase() === statusFilter.toLowerCase();
      
      // Experience Mode
      const evMode = ev.experienceMode || ev.settings?.experienceMode || 'memory_capsule';
      const matchMode = modeFilter === 'All' || evMode === modeFilter;

      // Type
      const matchType = typeFilter === 'All' || ev.type === typeFilter;
      
      // Owner
      const matchOwner = ownerFilter === 'All' || ev.owner === ownerFilter;

      // Workspace
      const matchWorkspace = workspaceFilter === 'All' || ev.workspaceName === workspaceFilter;

      // Date Filters
      let matchDate = true;
      if (dateFilter !== 'All') {
        const todayStr = new Date().toISOString().split('T')[0];
        const eventDate = ev.date;
        if (dateFilter === 'Past') {
          matchDate = eventDate < todayStr;
        } else if (dateFilter === 'Upcoming') {
          matchDate = eventDate >= todayStr;
        } else if (dateFilter === 'Today') {
          matchDate = eventDate === todayStr;
        } else if (dateFilter === 'This Month') {
          const currentMonth = todayStr.substring(0, 7); // YYYY-MM
          matchDate = eventDate.startsWith(currentMonth);
        }
      }

      return matchQuery && matchStatus && matchMode && matchType && matchOwner && matchWorkspace && matchDate;
    });
  }, [enrichedEvents, search, statusFilter, modeFilter, typeFilter, dateFilter, ownerFilter, workspaceFilter]);

  // Sorting Logic
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        // Numbers
        return sortOrder === 'asc' 
          ? (valA || 0) - (valB || 0) 
          : (valB || 0) - (valA || 0);
      }
    });
    return list;
  }, [filteredEvents, sortField, sortOrder]);

  // Paginated list
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedEvents.slice(start, start + itemsPerPage);
  }, [sortedEvents, currentPage]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  // Sync / Action handlers
  const handleStatusChange = (eventId: string, newStatus: 'active' | 'inactive' | 'archived' | 'draft') => {
    onUpdateEventSettings(eventId, { status: newStatus });
    setToast({
      title: 'Status Updated',
      description: `Event status changed to "${newStatus.toUpperCase()}" successfully.`,
      items: ['Propagated instantly to Guest room, Live walls and Admins.']
    });
  };

  const handleDuplicate = (ev: KavaEvent) => {
    if (!setEvents) return;
    const newId = `evt-${Date.now()}`;
    const newCode = `${ev.code}-COPY-${Math.floor(100 + Math.random() * 900)}`;
    const duplicated: KavaEvent = {
      ...ev,
      id: newId,
      name: `${ev.name} (Copy)`,
      code: newCode,
      status: 'draft',
      guestCount: 0,
      settings: {
        ...ev.settings
      }
    };

    setEvents(prev => [duplicated, ...prev]);
    setToast({
      title: 'Event Duplicated',
      description: `Created a brand-new draft template of "${ev.name}".`,
      items: [`Assigned code: ${newCode}`]
    });
  };

  const handleDelete = (eventId: string) => {
    if (!setEvents) return;
    if (confirm('Are you sure you want to permanently delete this memory capsule? This action cannot be undone.')) {
      setEvents(prev => {
        const updated = prev.filter(e => e.id !== eventId);
        
        // If the deleted event was selected, automatically switch to another active one
        if (selectedEvent.id === eventId) {
          if (updated.length > 0) {
            // Select first available
            setTimeout(() => onSelectEvent(updated[0]), 50);
          }
        }
        return updated;
      });

      // Clear from selected ids
      setSelectedIds(prev => prev.filter(id => id !== eventId));

      setToast({
        title: 'Capsule Deleted',
        description: 'Memory capsule database records cleared securely.',
        items: ['All guest uploads and media links are deactivated immediately.']
      });
    }
  };

  const handleShare = (ev: KavaEvent) => {
    const url = `${window.location.origin}/guest?code=${ev.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast({
        title: 'Link Copied',
        description: 'Guest invitation space link copied to clipboard.',
        items: [url]
      });
    }).catch(() => {
      setToast({
        title: 'Share Link',
        description: 'Here is your private guest link:',
        items: [url]
      });
    });
  };

  const handleExport = (ev: KavaEvent) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ev, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kava_capsule_${ev.id}_settings.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setToast({
        title: 'Configuration Exported',
        description: `Successfully downloaded JSON file for "${ev.name}"`,
        items: ['Includes active settings and presentation parameters']
      });
    } catch (err) {
      setToast({
        title: 'Export Failed',
        description: 'An error occurred while generating JSON configuration file.',
        items: []
      });
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: 'active' | 'inactive' | 'archived' | 'draft') => {
    if (!setEvents) return;
    setEvents(prev => prev.map(e => selectedIds.includes(e.id) ? { ...e, status: newStatus } : e));
    setSelectedIds([]);
    setToast({
      title: 'Bulk Update Successful',
      description: `Updated status to "${newStatus.toUpperCase()}" for ${selectedIds.length} selected capsules.`,
      items: ['Synchronized successfully across live terminals']
    });
  };

  const handleBulkDelete = () => {
    if (!setEvents) return;
    if (confirm(`Are you sure you want to delete the ${selectedIds.length} selected capsules permanently?`)) {
      setEvents(prev => {
        const updated = prev.filter(e => !selectedIds.includes(e.id));
        // Verify selection
        if (selectedIds.includes(selectedEvent.id)) {
          if (updated.length > 0) {
            setTimeout(() => onSelectEvent(updated[0]), 50);
          }
        }
        return updated;
      });
      setSelectedIds([]);
      setToast({
        title: 'Bulk Deletion Complete',
        description: 'Selected records have been removed from local database storage.',
        items: []
      });
    }
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedEvents.map(e => e.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'All') count++;
    if (modeFilter !== 'All') count++;
    if (typeFilter !== 'All') count++;
    if (ownerFilter !== 'All') count++;
    if (workspaceFilter !== 'All') count++;
    if (dateFilter !== 'All') count++;
    return count;
  }, [statusFilter, modeFilter, typeFilter, ownerFilter, workspaceFilter, dateFilter]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Events & Capsules Catalog</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Coordinate, audit, and configure collaborative guest media spaces.</p>
        </div>
      </div>

      {/* COMPACT FILTER TOOLBAR (Apple-inspired, similar to Notion/Linear/Vercel) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-50/60">
        
        {/* Left Side: Search, Filter, Sort */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          {/* Search field */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, code, owner..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50/50 hover:bg-slate-50/80 border border-transparent rounded-xl pl-9 pr-4 h-9 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 transition-all duration-150"
            />
          </div>

          {/* Filter button with popover */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center justify-center space-x-1.5 px-3.5 h-9 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 select-none ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-50/50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className={`inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[9px] font-extrabold ${
                  isFilterOpen || activeFiltersCount > 0
                    ? 'bg-white text-slate-900' 
                    : 'bg-slate-900 text-white'
                }`}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Filter Popover */}
            {isFilterOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/50 z-40 p-4 space-y-4 animate-fade-in text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800">Refine List</span>
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={() => {
                        setStatusFilter('All');
                        setModeFilter('All');
                        setTypeFilter('All');
                        setOwnerFilter('All');
                        setWorkspaceFilter('All');
                        setDateFilter('All');
                        setCurrentPage(1);
                      }}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Experience Mode Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Experience Mode</label>
                    <select
                      value={modeFilter}
                      onChange={(e) => { setModeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Modes</option>
                      <option value="memory_capsule">✨ Memory Capsule</option>
                      <option value="photo_collection">📷 Photo Collection</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Archived">Archived</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  {/* Event Type Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Event Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Types</option>
                      {uniqueTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Owner Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Owner</label>
                    <select
                      value={ownerFilter}
                      onChange={(e) => { setOwnerFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Owners</option>
                      {uniqueOwners.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Workspace Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Workspace</label>
                    <select
                      value={workspaceFilter}
                      onChange={(e) => { setWorkspaceFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Workspaces</option>
                      {uniqueWorkspaces.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* Time Frame Filter */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Time Frame</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="All">All Dates</option>
                      <option value="Past">Past Events</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Today">Today</option>
                      <option value="This Month">This Month</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort button with popover */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className={`flex items-center justify-center space-x-1.5 px-3.5 h-9 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 select-none ${
                isSortOpen 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-50/50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="capitalize">Sort: {sortField === 'contributionCount' ? 'Contributions' : sortField === 'storageBytes' ? 'Storage' : sortField === 'createdDate' ? 'Created' : sortField === 'lastActivity' ? 'Activity' : sortField}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Sort Popover */}
            {isSortOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/50 z-40 p-4 space-y-4 animate-fade-in text-slate-700">
                <div className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-2">
                  Sort Options
                </div>

                <div className="space-y-3">
                  {/* Sort Field Selector */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sort Column</label>
                    <select
                      value={sortField}
                      onChange={(e) => handleSort(e.target.value as SortField)}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="name">Event Name</option>
                      <option value="createdDate">Created Date</option>
                      <option value="lastActivity">Last Activity</option>
                      <option value="contributionCount">Contributions</option>
                      <option value="storageBytes">Storage Usage</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  {/* Sort Order Button Toggles */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Direction</label>
                    <div className="flex bg-slate-50 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSortOrder('asc')}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                          sortOrder === 'asc' 
                            ? 'bg-white text-slate-900 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Ascending
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortOrder('desc')}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                          sortOrder === 'desc' 
                            ? 'bg-white text-slate-900 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Descending
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: View Toggles & Create Button */}
        <div className="flex items-center gap-2 mt-2 md:mt-0 justify-end">
          {/* View Toggles */}
          <div className="flex bg-slate-50 p-0.5 rounded-xl h-9">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === 'card' 
                  ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 rounded-lg transition-all duration-150 cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Create CTA */}
          <button
            onClick={() => {
              if (onCreateEvent) {
                onCreateEvent();
              } else {
                window.location.href = '/create-capsule/step/1';
              }
            }}
            className="flex items-center justify-center space-x-1.5 text-white px-4 h-9 rounded-xl text-xs font-bold cursor-pointer hover:opacity-95 active:scale-98 transition-all bg-gradient-to-r from-[#111111] to-[#2B2B2B] shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.24)]"
            id="btn-catalog-create-capsule"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Capsule</span>
          </button>
        </div>

      </div>

      {/* BULK SELECTION ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-md">
          <div className="flex items-center space-x-3">
            <span className="bg-white/20 text-white px-2.5 py-1 rounded-md text-[10px] font-bold font-mono">
              {selectedIds.length} Selected
            </span>
            <p className="text-xs font-medium text-slate-300">Perform multi-action on selected capsules:</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkStatusChange('archived')}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
            >
              Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white px-2 py-1 text-xs font-medium cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* ZERO STATE */}
      {sortedEvents.length === 0 && (
        <ContextualGuidanceCard
          title="No Memory Capsules Found"
          description="Memory Capsules store all guest photos, live videos, audio wishes, and guest stats for weddings, galas, and celebrations."
          icon={<Calendar className="w-6 h-6 text-slate-900" />}
          steps={[
            { number: 1, title: 'Create Capsule', description: 'Define event name, date, cover theme, and media upload rules.' },
            { number: 2, title: 'Setup Guest Studio', description: 'Generate custom QR codes and luxury table stand cards.' },
            { number: 3, title: 'Launch Live Screen', description: 'Display real-time guest photo streams on venue projectors.' }
          ]}
          primaryCtaLabel={onCreateEvent ? "Create First Capsule" : undefined}
          onPrimaryCta={onCreateEvent}
          secondaryCtaLabel="Reset Filters & Search"
          onSecondaryCta={() => {
            setSearch('');
            setStatusFilter('All');
            setTypeFilter('All');
            setDateFilter('All');
            setOwnerFilter('All');
            setWorkspaceFilter('All');
          }}
        />
      )}

      {/* RENDER VIEWMODES */}
      {sortedEvents.length > 0 && (
        <>
          {viewMode === 'card' ? (
            /* CARD VIEW MODE */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {paginatedEvents.map((ev) => {
                const isSelected = selectedEvent.id === ev.id;
                const isBulkChecked = selectedIds.includes(ev.id);

                return (
                  <div 
                    key={ev.id}
                    onClick={() => {
                      onSelectEvent(ev);
                      setIsEventLevel?.(true);
                      setActiveTab?.('overview');
                    }}
                    className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative group flex flex-col justify-between cursor-pointer"
                    style={{ 
                      boxShadow: isSelected 
                        ? '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 0 0 1.5px #CBD5E1' 
                        : '0 4px 20px -4px rgba(0, 0, 0, 0.04), 0 0 0 1px #E8ECF2',
                    }}
                    id={`card-event-item-${ev.id}`}
                  >
                    
                    {/* Header Image Block */}
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img 
                        src={ev.coverUrl} 
                        alt={ev.name} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                      
                      {/* Dark gradient overlay for upper badges readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

                      {/* Bulk Selector Checkbox */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowSelect(ev.id);
                        }}
                        className="absolute top-4 left-4 z-10 cursor-pointer h-5 w-5 bg-white/95 rounded-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      >
                        {isBulkChecked ? (
                          <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: workspaceBrandAccentColor }} />
                        ) : null}
                      </div>

                      {/* Type & Experience Mode Badge */}
                      <div className="absolute top-4 left-11 flex items-center space-x-1.5 z-10">
                        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                          {ev.type}
                        </div>
                        {(ev.experienceMode === 'photo_collection' || ev.settings?.experienceMode === 'photo_collection') ? (
                          <div className="bg-slate-900/90 text-white backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center space-x-1">
                            <span>📷</span>
                            <span>Photos</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Three dot button overlay using portal */}
                      <div className="absolute top-4 right-4 z-20">
                        <EventCardContextMenu
                          ev={ev}
                          onSelectEvent={onSelectEvent}
                          setIsEventLevel={setIsEventLevel}
                          setActiveTab={setActiveTab}
                          handleDuplicate={handleDuplicate}
                          handleShare={handleShare}
                          handleExport={handleExport}
                          handleStatusChange={handleStatusChange}
                          handleDelete={handleDelete}
                          isOpen={activeMenuId === ev.id}
                          onToggle={(open) => setActiveMenuId(open ? ev.id : null)}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      {/* Top Meta info */}
                      <div className="space-y-2.5">
                        
                        {/* Title & Location */}
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-sm leading-snug text-slate-800 group-hover:text-slate-950 transition-colors">
                            {ev.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {ev.location} • {ev.date}
                          </p>
                        </div>

                        {/* Owner & Workspace Details */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center space-x-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            <User className="w-2.5 h-2.5 text-slate-400" />
                            <span>{ev.owner}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            <Building className="w-2.5 h-2.5 text-slate-400" />
                            <span>{ev.workspaceName}</span>
                          </span>
                        </div>
                      </div>

                      {/* Quick Status Select & Visibility Badge */}
                      <div className="flex items-center justify-between">
                        {/* Quick Status selector dropdown */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={ev.status}
                            onChange={(e) => handleStatusChange(ev.id, e.target.value as any)}
                            className={`px-2 py-1 text-[10px] font-extrabold font-mono tracking-wider uppercase rounded-lg focus:outline-none cursor-pointer transition-colors ${
                              ev.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                              ev.status === 'inactive' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-700' // Draft / Archived
                            }`}
                          >
                            <option value="active">🟢 Active</option>
                            <option value="inactive">🟡 Inactive</option>
                            <option value="archived">⚫ Archived</option>
                            <option value="draft">⚪ Draft</option>
                          </select>
                        </div>

                        {/* Visibility Badge */}
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          ev.visibility === 'Public' 
                            ? 'bg-blue-50/70 text-blue-700' 
                            : 'bg-rose-50/70 text-rose-700'
                        }`}>
                          {ev.visibility} Space
                        </span>
                      </div>

                      <div className="h-[1px] bg-slate-100/50"></div>

                      {/* Core Metrics row */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-slate-50/40 p-2 rounded-xl flex flex-col text-left">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">CONTRIBUTIONS</span>
                          <span className="font-bold text-slate-800 mt-0.5">{ev.contributionCount} uploads</span>
                        </div>
                        <div className="bg-slate-50/40 p-2 rounded-xl flex flex-col text-left">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">STORAGE</span>
                          <span className="font-bold text-slate-800 mt-0.5">{ev.storageUsage}</span>
                        </div>
                      </div>

                      {/* Footer Timestamps */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium font-mono pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>Activity: {new Date(ev.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </span>
                        <span>Created: {new Date(ev.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Quick Create Card always styled nicely at the end */}
              <div 
                onClick={() => {
                  if (onCreateEvent) {
                    onCreateEvent();
                  } else {
                    window.location.href = '/create-capsule/step/1';
                  }
                }}
                className="bg-slate-50/30 hover:bg-slate-50/70 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4 min-h-[350px] cursor-pointer transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
                id="card-create-event-dashboard"
              >
                <div className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-slate-800">Create New Capsule</h4>
                  <p className="text-[11px] text-slate-400 font-medium max-w-xs leading-relaxed">Launch another world-class cooperative space for weddings, reunions, birthdays, or company milestones.</p>
                </div>
              </div>

            </div>
          ) : (
            /* TABLE VIEW MODE */
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden border border-slate-50/60">
              <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
                <table className="w-full text-xs text-left border-collapse relative">
                  <thead>
                    <tr className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100/60 text-slate-500 font-mono text-[10px] font-semibold uppercase tracking-wider select-none">
                      
                      {/* Checkbox Header */}
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={paginatedEvents.every(e => selectedIds.includes(e.id))}
                          onChange={toggleSelectAll}
                          className="h-3.5 w-3.5 border-slate-300 rounded-md cursor-pointer accent-slate-900"
                        />
                      </th>

                      {/* Sortable Column Headers */}
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('name')}>
                        <div className="flex items-center space-x-1">
                          <span>Event Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4">Mode</th>
                      
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4">Type</th>
                      
                      <th className="py-3.5 px-4">Owner</th>
                      
                      <th className="py-3.5 px-4">Guests</th>

                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('contributionCount')}>
                        <div className="flex items-center space-x-1">
                          <span>Contributions</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('storageBytes')}>
                        <div className="flex items-center space-x-1">
                          <span>Storage</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('createdDate')}>
                        <div className="flex items-center space-x-1">
                          <span>Created Date</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort('lastActivity')}>
                        <div className="flex items-center space-x-1">
                          <span>Last Activity</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      <th className="py-3.5 px-4">Visibility</th>

                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-700 divide-y divide-slate-100/50">
                    {paginatedEvents.map((ev) => {
                      const isSelected = selectedEvent.id === ev.id;
                      const isBulkChecked = selectedIds.includes(ev.id);

                      return (
                        <tr 
                          key={ev.id} 
                          onClick={() => {
                            onSelectEvent(ev);
                            setIsEventLevel?.(true);
                            setActiveTab?.('overview');
                          }}
                          className={`hover:bg-slate-50/40 cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-slate-50/60' : ''}`}
                        >
                          {/* Row Checkbox */}
                          <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isBulkChecked}
                              onChange={() => handleRowSelect(ev.id)}
                              className="h-3.5 w-3.5 border-slate-300 rounded-md cursor-pointer accent-slate-900"
                            />
                          </td>

                          {/* Event Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img src={ev.coverUrl} alt={ev.name} className="w-8 h-8 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <p className="font-semibold text-slate-800 text-xs">{ev.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium font-mono">{ev.location} • {ev.code}</p>
                              </div>
                            </div>
                          </td>

                          {/* Mode */}
                          <td className="py-3 px-4">
                            {(ev.experienceMode === 'photo_collection' || ev.settings?.experienceMode === 'photo_collection') ? (
                              <span className="inline-flex items-center space-x-1 bg-slate-900 text-white px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase">
                                <span>📷</span>
                                <span>Photos</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase">
                                <span>✨</span>
                                <span>Capsule</span>
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={ev.status}
                              onChange={(e) => handleStatusChange(ev.id, e.target.value as any)}
                              className={`px-2 py-0.5 text-[9px] font-extrabold font-mono uppercase tracking-wider rounded-lg focus:outline-none cursor-pointer transition-colors ${
                                ev.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                ev.status === 'inactive' ? 'bg-amber-50 text-amber-700' :
                                ev.status === 'archived' ? 'bg-slate-100 text-slate-600' :
                                'bg-slate-100 text-slate-800' // Draft
                              }`}
                            >
                              <option value="active">🟢 Active</option>
                              <option value="inactive">🟡 Inactive</option>
                              <option value="archived">⚫ Archived</option>
                              <option value="draft">🟣 Draft</option>
                            </select>
                          </td>

                          {/* Type */}
                          <td className="py-3 px-4">
                            <span className="bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {ev.type}
                            </span>
                          </td>

                          {/* Owner */}
                          <td className="py-3 px-4">
                            <span className="text-slate-700 font-semibold">{ev.owner}</span>
                          </td>

                          {/* Guests count */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {ev.guestCount}
                          </td>

                          {/* Contribution count */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {ev.contributionCount}
                          </td>

                          {/* Storage */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {ev.storageUsage}
                          </td>

                          {/* Created Date */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-400">
                            {ev.createdDate}
                          </td>

                          {/* Last Activity */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-400">
                            {new Date(ev.lastActivity).toLocaleDateString()}
                          </td>

                          {/* Visibility */}
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              ev.visibility === 'Public' 
                                ? 'bg-blue-50/70 text-blue-700' 
                                : 'bg-rose-50/70 text-rose-700'
                            }`}>
                              {ev.visibility}
                            </span>
                          </td>

                          {/* Actions dot menu */}
                          <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-center">
                              <EventCardContextMenu
                                ev={ev}
                                onSelectEvent={onSelectEvent}
                                setIsEventLevel={setIsEventLevel}
                                setActiveTab={setActiveTab}
                                handleDuplicate={handleDuplicate}
                                handleShare={handleShare}
                                handleExport={handleExport}
                                handleStatusChange={handleStatusChange}
                                handleDelete={handleDelete}
                                buttonClassName="h-7 w-7 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-xs bg-white border border-slate-100 active:scale-95"
                                iconClassName="w-3.5 h-3.5"
                                isOpen={activeMenuId === ev.id}
                                onToggle={(open) => setActiveMenuId(open ? ev.id : null)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGINATION INTERFACE */}
          {totalPages > 1 && (
            <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs font-mono text-xs">
              <span className="text-slate-500 font-bold">
                Showing <strong className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-slate-900">
                  {Math.min(currentPage * itemsPerPage, sortedEvents.length)}
                </strong>{' '}
                of <strong className="text-slate-900">{sortedEvents.length}</strong> entries
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all font-bold"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold border transition-all cursor-pointer ${
                      currentPage === page 
                        ? 'text-white border-transparent' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    style={{ backgroundColor: currentPage === page ? workspaceBrandAccentColor : undefined }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
