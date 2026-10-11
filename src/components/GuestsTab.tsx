import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, Trash2, ShieldAlert, Copy, MoreHorizontal, 
  User, Smartphone, Laptop, Calendar, FolderHeart, CheckCircle2, X, 
  ChevronLeft, ChevronRight, UserX, UserCheck, Image as ImageIcon, Video, Mic, 
  Heart, Clock, Activity, Check, RefreshCw, FileSpreadsheet, Plus, ExternalLink, Share2
} from 'lucide-react';
import { KavaGuest, KavaEvent, KavaContribution } from '../types';

interface GuestsTabProps {
  selectedEvent: KavaEvent;
  guests: KavaGuest[];
  contributions: KavaContribution[];
  setGuests?: React.Dispatch<React.SetStateAction<KavaGuest[]>>;
  setToast: (msg: string) => void;
  setActiveTab: (tab: any) => void;
}

export default function GuestsTab({
  selectedEvent,
  guests,
  contributions,
  setGuests,
  setToast,
  setActiveTab,
}: GuestsTabProps) {
  // 1. Data Merging & Real Database Guests Only
  const eventGuestsRaw = useMemo(() => {
    return guests.filter(g => g.eventId === selectedEvent.id);
  }, [guests, selectedEvent.id]);

  // Compute live contribution stats for each real guest directly from contributions state
  const allEventGuests = useMemo<KavaGuest[]>(() => {
    return eventGuestsRaw.map(guest => {
      // Live count of actual uploaded assets in the database for this specific guest
      const realContributions = contributions.filter(c => 
        c.eventId === selectedEvent.id && 
        (
          (c.metadata?.guestId && c.metadata.guestId === guest.id) || 
          (c.contributorName && c.contributorName.trim().toLowerCase() === guest.name.trim().toLowerCase())
        )
      );
      
      const contributionsCount = realContributions.length;

      // Calculate last activity timestamp from real contributions or joinedAt
      let lastActivity = guest.lastActivity || guest.joinedAt;
      if (realContributions.length > 0) {
        const timestamps = realContributions.map(c => new Date(c.timestamp).getTime());
        const latestTime = Math.max(...timestamps, new Date(guest.joinedAt).getTime());
        lastActivity = new Date(latestTime).toISOString();
      }

      return {
        ...guest,
        contributionsCount,
        lastActivity,
      };
    });
  }, [eventGuestsRaw, contributions, selectedEvent.id]);

  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'left' | 'blocked'>('all');
  const [contribFilter, setContribFilter] = useState<'all' | 'no_upload' | 'uploaded'>('all');
  const [joinDateFilter, setJoinDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // 3. Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 4. Multi-Select & Drawer State
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [activeGuestDrawer, setActiveGuestDrawer] = useState<KavaGuest | null>(null);
  const [openActionDropdownId, setOpenActionDropdownId] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkBlockConfirmOpen, setBulkBlockConfirmOpen] = useState(false);

  // Filtered Guests computation
  const filteredGuests = useMemo(() => {
    return allEventGuests.filter(guest => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = guest.name.toLowerCase().includes(q);
        const matchesId = guest.id.toLowerCase().includes(q);
        const matchesEmail = guest.email ? guest.email.toLowerCase().includes(q) : false;
        const matchesPhone = guest.phone ? guest.phone.includes(q) : false;

        if (!matchesName && !matchesId && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      // Status
      const currentStatus = guest.status || 'active';
      if (statusFilter !== 'all' && currentStatus !== statusFilter) {
        return false;
      }

      // Contributions
      if (contribFilter === 'no_upload' && guest.contributionsCount > 0) return false;
      if (contribFilter === 'uploaded' && guest.contributionsCount === 0) return false;

      // Join Date Filter
      if (joinDateFilter !== 'all') {
        const guestJoin = new Date(guest.joinedAt).getTime();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (joinDateFilter === 'today' && (now - guestJoin) > oneDay) return false;
        if (joinDateFilter === '7days' && (now - guestJoin) > 7 * oneDay) return false;
        if (joinDateFilter === '30days' && (now - guestJoin) > 30 * oneDay) return false;
      }

      return true;
    });
  }, [allEventGuests, searchQuery, statusFilter, contribFilter, joinDateFilter]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, contribFilter, joinDateFilter, pageSize]);

  // Paginated Slice
  const totalItems = filteredGuests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageEndIndex = Math.min(totalItems, pageStartIndex + pageSize);
  const paginatedGuests = filteredGuests.slice(pageStartIndex, pageEndIndex);

  // Select All on Current Page logic
  const isPageAllSelected = paginatedGuests.length > 0 && paginatedGuests.every(g => selectedGuestIds.includes(g.id));
  const isAllFilteredSelected = filteredGuests.length > 0 && filteredGuests.every(g => selectedGuestIds.includes(g.id));

  const handleToggleSelectAll = () => {
    if (isPageAllSelected) {
      setSelectedGuestIds(prev => prev.filter(id => !paginatedGuests.some(g => g.id === id)));
    } else {
      const pageIds = paginatedGuests.map(g => g.id);
      setSelectedGuestIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedGuestIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Row Action Handlers
  const handleCopyGuestLink = (guest: KavaGuest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const guestUrl = `${window.location.origin}/?event=${selectedEvent.id}&guest=${guest.id}`;
    navigator.clipboard.writeText(guestUrl);
    setToast(`Copied guest link for ${guest.name}`);
    setOpenActionDropdownId(null);
  };

  const handleToggleBlockGuest = (guest: KavaGuest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = guest.status === 'blocked' ? 'active' : 'blocked';
    
    if (setGuests) {
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status: newStatus } : g));
    }
    
    // Also update drawer if open
    if (activeGuestDrawer && activeGuestDrawer.id === guest.id) {
      setActiveGuestDrawer(prev => prev ? { ...prev, status: newStatus } : null);
    }

    setToast(newStatus === 'blocked' ? `Blocked ${guest.name}` : `Unblocked ${guest.name}`);
    setOpenActionDropdownId(null);
  };

  const handleRemoveGuest = (guest: KavaGuest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Remove ${guest.name} from this event?`)) {
      if (setGuests) {
        setGuests(prev => prev.filter(g => g.id !== guest.id));
      }
      setSelectedGuestIds(prev => prev.filter(id => id !== guest.id));
      if (activeGuestDrawer?.id === guest.id) {
        setActiveGuestDrawer(null);
      }
      setToast(`Removed ${guest.name} from event.`);
      setOpenActionDropdownId(null);
    }
  };

  // Bulk Actions
  const handleExportSelected = () => {
    const selected = allEventGuests.filter(g => selectedGuestIds.includes(g.id));
    if (selected.length === 0) return;

    const headers = ['Guest ID', 'Name', 'Email', 'Phone', 'Contributions', 'Joined At', 'Last Activity', 'Status', 'Device'];
    const rows = selected.map(g => [
      g.id,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`,
      g.contributionsCount,
      g.joinedAt,
      g.lastActivity || g.joinedAt,
      g.status || 'active',
      g.device || 'Mobile'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedEvent.name.replace(/[^a-z0-9]/gi, '_')}_Guests_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast(`Exported ${selected.length} guest records.`);
  };

  const handleBulkBlock = () => {
    if (setGuests) {
      setGuests(prev => prev.map(g => selectedGuestIds.includes(g.id) ? { ...g, status: 'blocked' } : g));
    }
    setToast(`Blocked ${selectedGuestIds.length} guests.`);
    setBulkBlockConfirmOpen(false);
  };

  const handleBulkRemove = () => {
    if (setGuests) {
      setGuests(prev => prev.filter(g => !selectedGuestIds.includes(g.id)));
    }
    setToast(`Removed ${selectedGuestIds.length} guests.`);
    setSelectedGuestIds([]);
    setBulkDeleteConfirmOpen(false);
  };

  // Contributions for Guest Drawer
  const guestContributions = useMemo(() => {
    if (!activeGuestDrawer) return [];
    return contributions.filter(c => 
      c.eventId === selectedEvent.id && 
      (c.contributorName?.toLowerCase() === activeGuestDrawer.name.toLowerCase() || c.id.includes(activeGuestDrawer.id))
    );
  }, [activeGuestDrawer, contributions, selectedEvent.id]);

  // Generate pagination range array e.g. [1, 2, 3, '...', 10]
  const paginationRange = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6 text-left selection:bg-slate-900 selection:text-white">
      
      {/* HEADER CARD */}
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Guest Circle Management</h3>
              <span className="bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {allEventGuests.length} Total Guests
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Monitor guest attendance, manage access permissions, inspect media submissions, and export guest data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportSelected}
              disabled={selectedGuestIds.length === 0}
              className={`flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                selectedGuestIds.length > 0 
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs cursor-pointer' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
              id="btn-export-guests-top"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({selectedGuestIds.length})</span>
            </button>

            <button
              onClick={() => {
                const url = `${window.location.origin}/?event=${selectedEvent.id}`;
                navigator.clipboard.writeText(url);
                setToast('Copied event guest portal link!');
              }}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              id="btn-copy-portal-link"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Guest Portal Link</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between bg-slate-50/80 p-3.5 rounded-[20px] border border-slate-200/60">
          
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, guest ID, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 text-slate-800 placeholder:text-slate-400 shadow-2xs"
              id="input-guest-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
                id="select-status-filter"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="left">Left</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Contributions Filter */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Uploads:</span>
              <select
                value={contribFilter}
                onChange={(e) => setContribFilter(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
                id="select-contrib-filter"
              >
                <option value="all">All Guests</option>
                <option value="uploaded">Uploaded Media</option>
                <option value="no_upload">No Uploads</option>
              </select>
            </div>

            {/* Join Date Filter */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Joined:</span>
              <select
                value={joinDateFilter}
                onChange={(e) => setJoinDateFilter(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
                id="select-joindate-filter"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || statusFilter !== 'all' || contribFilter !== 'all' || joinDateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setContribFilter('all');
                  setJoinDateFilter('all');
                }}
                className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
                title="Reset Filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* BULK ACTIONS FLOATING/TOP BAR */}
        {selectedGuestIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 text-white p-3.5 px-5 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold tracking-wide">
                {selectedGuestIds.length} guest{selectedGuestIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportSelected}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setBulkBlockConfirmOpen(true)}
                className="flex items-center space-x-1.5 bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Block Selected</span>
              </button>

              <button
                onClick={() => setBulkDeleteConfirmOpen(true)}
                className="flex items-center space-x-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Selected</span>
              </button>

              <button
                onClick={() => setSelectedGuestIds([])}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* DATA TABLE OR EMPTY STATE */}
        {allEventGuests.length === 0 ? (
          <div className="text-center py-16 px-6 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200/80 space-y-4 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
              <UserX className="w-7 h-7 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-slate-900">No guests have joined this event yet</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once guests scan your QR code or visit your guest portal link, they will appear here in real time with their device info and contribution stats.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/?event=${selectedEvent.id}`;
                  navigator.clipboard.writeText(url);
                  setToast('Copied Guest Portal Link to clipboard!');
                }}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                id="btn-empty-copy-portal"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Guest Portal Link</span>
              </button>

              <button
                onClick={() => {
                  const url = `${window.location.origin}/?event=${selectedEvent.id}`;
                  if (navigator.share) {
                    navigator.share({
                      title: selectedEvent.name,
                      text: `Join ${selectedEvent.name} and share your photos and memories!`,
                      url: url,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(url);
                    setToast('Invitation link copied to clipboard!');
                  }
                }}
                className="flex items-center space-x-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                id="btn-empty-share-invitation"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Invitation</span>
              </button>
            </div>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <User className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
            <p className="text-sm font-extrabold text-slate-700">No guests found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching guests found for your search or filter criteria. Try resetting search filters.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD LIST (≤768px) */}
            <div className="md:hidden space-y-3">
              {paginatedGuests.map((guest) => {
                const isSelected = selectedGuestIds.includes(guest.id);
                const isBlocked = guest.status === 'blocked';
                const isLeft = guest.status === 'left';
                const isDesktop = guest.device === 'Desktop';

                return (
                  <div
                    key={guest.id}
                    onClick={() => setActiveGuestDrawer(guest)}
                    className={`bg-white border rounded-2xl p-4 shadow-xs space-y-3 transition-all cursor-pointer ${
                      isSelected ? 'border-slate-300 ring-1 ring-slate-200 bg-slate-50/50' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleSelectRow(guest.id);
                          }}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-200 cursor-pointer h-5 w-5 shrink-0"
                        />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 border ${
                          isBlocked ? 'bg-rose-100 text-rose-700 border-rose-200' :
                          isLeft ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          'bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-800 border-slate-200/80'
                        }`}>
                          {guest.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="font-extrabold text-sm text-slate-900 truncate">{guest.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{guest.email || guest.phone || 'Joined via QR Scan'}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      {isBlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-[10px] uppercase">Blocked</span>
                      ) : isLeft ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-extrabold text-[10px] uppercase">Left</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] uppercase">Active</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          <FolderHeart className="w-3 h-3" />
                          <span>{guest.contributionsCount} upload{guest.contributionsCount === 1 ? '' : 's'}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]">
                          {isDesktop ? <Laptop className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                          <span>{guest.device || 'Mobile'}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleCopyGuestLink(guest, e)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleBlockGuest(guest, e)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isBlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>768px) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 shadow-2xs bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono font-bold uppercase tracking-wider select-none">
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isPageAllSelected}
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-200 cursor-pointer h-4 w-4"
                        title="Select all on this page"
                      />
                    </th>
                    <th className="py-3.5 px-4 font-extrabold">Guest</th>
                    <th className="py-3.5 px-4 font-extrabold">Joined At</th>
                    <th className="py-3.5 px-4 font-extrabold">Contributions</th>
                    <th className="py-3.5 px-4 font-extrabold">Last Activity</th>
                    <th className="py-3.5 px-4 font-extrabold">Device</th>
                    <th className="py-3.5 px-4 font-extrabold">Status</th>
                    <th className="py-3.5 px-4 text-right font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {paginatedGuests.map((guest) => {
                    const isSelected = selectedGuestIds.includes(guest.id);
                    const isBlocked = guest.status === 'blocked';
                    const isLeft = guest.status === 'left';
                    const isDesktop = guest.device === 'Desktop';

                    return (
                      <tr 
                        key={guest.id} 
                        onClick={() => setActiveGuestDrawer(guest)}
                        className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-100/90 hover:bg-slate-100' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectRow(guest.id)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-200 cursor-pointer h-4 w-4"
                          />
                        </td>

                        {/* Guest Info */}
                        <td className="py-4 px-4 min-w-[200px]">
                          <div className="flex items-center space-x-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 border shadow-2xs ${
                              isBlocked ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              isLeft ? 'bg-slate-100 text-slate-500 border-slate-200' :
                              'bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-800 border-slate-200/80'
                            }`}>
                              {guest.name.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-extrabold text-slate-900 truncate hover:text-slate-700 transition-colors" title={guest.name}>
                                  {guest.name}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded uppercase">
                                  {guest.id.substring(0, 8)}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate font-normal mt-0.5" title={guest.email || guest.phone || 'No contact provided'}>
                                {guest.email || guest.phone || 'Joined via Poster Scan'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Joined At */}
                        <td className="py-4 px-4 text-slate-600 font-normal whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {new Date(guest.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {new Date(guest.joinedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>

                        {/* Contributions */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {guest.contributionsCount > 0 ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-[10px]">
                              <FolderHeart className="w-3 h-3 text-slate-700" />
                              <span>{guest.contributionsCount} upload{guest.contributionsCount > 1 ? 's' : ''}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 font-medium text-[10px]">
                              <span>0 uploads</span>
                            </span>
                          )}
                        </td>

                        {/* Last Activity */}
                        <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-normal">
                          {guest.lastActivity ? (
                            <div>
                              <span className="text-slate-700 font-medium">
                                {new Date(guest.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                                {new Date(guest.lastActivity).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Device */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-[10px]">
                            {isDesktop ? <Laptop className="w-3 h-3 text-slate-500" /> : <Smartphone className="w-3 h-3 text-slate-500" />}
                            <span>{guest.device || 'Mobile'}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isBlocked ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-[10px] uppercase tracking-wider">
                              <UserX className="w-3 h-3 text-rose-600" />
                              <span>Blocked</span>
                            </span>
                          ) : isLeft ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-extrabold text-[10px] uppercase tracking-wider">
                              <span>Left Event</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>

                        {/* Actions Dropdown */}
                        <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setOpenActionDropdownId(openActionDropdownId === guest.id ? null : guest.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="More Actions"
                            id={`btn-guest-actions-${guest.id}`}
                          >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Action Menu */}
                        {openActionDropdownId === guest.id && (
                          <div className="absolute right-4 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => {
                                setActiveGuestDrawer(guest);
                                setOpenActionDropdownId(null);
                              }}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveGuestDrawer(guest);
                                setOpenActionDropdownId(null);
                              }}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <FolderHeart className="w-3.5 h-3.5 text-slate-700" />
                              <span>View Contributions ({guest.contributionsCount})</span>
                            </button>

                            <button
                              onClick={(e) => handleCopyGuestLink(guest, e)}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Guest Link</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={(e) => handleToggleBlockGuest(guest, e)}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                              <span>{guest.status === 'blocked' ? 'Unblock Guest' : 'Block Guest'}</span>
                            </button>

                            <button
                              onClick={(e) => handleRemoveGuest(guest, e)}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Remove from Event</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

        {/* PAGINATION FOOTER */}
        {filteredGuests.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            
            {/* Showing Indicator */}
            <div className="font-medium text-slate-600">
              Showing <span className="font-extrabold text-slate-900">{pageStartIndex + 1}–{pageEndIndex}</span> of <span className="font-extrabold text-slate-900">{totalItems}</span> guests
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-3">
              
              {/* Rows Per Page Selector */}
              <div className="flex items-center space-x-2 mr-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
                  id="select-rows-per-page"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Page Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                    currentPage === 1 
                      ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
                  }`}
                  title="Previous Page"
                  id="btn-pagination-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {paginationRange.map((p, idx) => {
                  if (p === '...') {
                    return <span key={`dots-${idx}`} className="px-2 text-slate-400 font-mono">...</span>;
                  }
                  const pageNum = p as number;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 min-w-8 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                    currentPage === totalPages 
                      ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
                  }`}
                  title="Next Page"
                  id="btn-pagination-next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GUEST DETAIL DRAWER (SLIDE-OVER) */}
      {activeGuestDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden text-left">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setActiveGuestDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Guest Dossier
                  </span>
                  <button
                    onClick={() => setActiveGuestDrawer(null)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-md flex items-center justify-center font-black text-slate-800 text-lg uppercase">
                    {activeGuestDrawer.name.substring(0, 2)}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-slate-900 truncate">{activeGuestDrawer.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {activeGuestDrawer.id}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        activeGuestDrawer.status === 'blocked' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        activeGuestDrawer.status === 'left' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {activeGuestDrawer.status || 'Active'}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-semibold flex items-center space-x-1">
                        {activeGuestDrawer.device === 'Desktop' ? <Laptop className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        <span>{activeGuestDrawer.device || 'Mobile'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
                
                {/* Profile Overview Details */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] font-mono text-slate-400">
                    Contact & Session Metadata
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Email Address</p>
                      <p className="font-bold text-slate-800 truncate" title={activeGuestDrawer.email || 'N/A'}>
                        {activeGuestDrawer.email || 'None registered'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Phone Number</p>
                      <p className="font-bold text-slate-800 truncate" title={activeGuestDrawer.phone || 'N/A'}>
                        {activeGuestDrawer.phone || 'None registered'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Join Timestamp</p>
                      <p className="font-bold text-slate-800">
                        {new Date(activeGuestDrawer.joinedAt).toLocaleDateString()} {new Date(activeGuestDrawer.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Last Active</p>
                      <p className="font-bold text-slate-800">
                        {activeGuestDrawer.lastActivity 
                          ? `${new Date(activeGuestDrawer.lastActivity).toLocaleDateString()} ${new Date(activeGuestDrawer.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'Just Joined'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload History & Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">Submitted Contributions</h4>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {guestContributions.length} Items
                    </span>
                  </div>

                  {guestContributions.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
                      <FolderHeart className="w-6 h-6 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-500">No media uploaded yet</p>
                      <p className="text-[10px] text-slate-400">Guest has joined the event but hasn't submitted photos or wishes.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {guestContributions.map((con) => (
                        <div key={con.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between space-x-3 shadow-2xs">
                          <div className="flex items-center space-x-3 min-w-0">
                            {con.type === 'photo' && (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                {con.mediaUrl ? (
                                  <img src={con.mediaUrl} alt="Photo" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-slate-700" />
                                )}
                              </div>
                            )}
                            {con.type === 'video' && (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <Video className="w-5 h-5 text-slate-700" />
                              </div>
                            )}
                            {con.type === 'voice' && (
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Mic className="w-5 h-5 text-emerald-600" />
                              </div>
                            )}
                            {con.type === 'wish' && (
                              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                <Heart className="w-5 h-5 text-amber-600" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900 capitalize truncate">{con.type} Submission</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {new Date(con.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {con.type === 'voice' ? (
                                <p className="text-[11px] text-emerald-600 font-medium line-clamp-1 mt-0.5">Voice recording ({con.audioDuration || '0:30'})</p>
                              ) : con.text ? (
                                <p className="text-[11px] text-slate-600 line-clamp-1 italic mt-0.5">"{con.text}"</p>
                              ) : null}
                            </div>
                          </div>

                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                            {con.status || 'Approved'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Timeline Stream */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">Activity Timeline</h4>
                  <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-1">
                    
                    {/* Event 1 */}
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <p className="font-bold text-slate-800">Scanned Poster & Joined Circle</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(activeGuestDrawer.joinedAt).toLocaleDateString()} at {new Date(activeGuestDrawer.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Event 2 if contributions exist */}
                    {activeGuestDrawer.contributionsCount > 0 && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                        <p className="font-bold text-slate-800">Submitted {activeGuestDrawer.contributionsCount} media contribution(s)</p>
                        <p className="text-[10px] text-slate-400 font-mono">Captured on {activeGuestDrawer.device || 'Mobile'}</p>
                      </div>
                    )}

                    {/* Event 3 status */}
                    {activeGuestDrawer.status === 'blocked' && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white" />
                        <p className="font-bold text-rose-700">Guest permissions blocked by host</p>
                        <p className="text-[10px] text-slate-400 font-mono">Access restricted</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => handleCopyGuestLink(activeGuestDrawer, e)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Guest Link</span>
                </button>

                <button
                  onClick={(e) => handleToggleBlockGuest(activeGuestDrawer, e)}
                  className={`flex-1 flex items-center justify-center space-x-2 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                    activeGuestDrawer.status === 'blocked'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{activeGuestDrawer.status === 'blocked' ? 'Unblock' : 'Block Guest'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* BULK REMOVE CONFIRM DIALOG */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">Remove Selected Guests?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong className="text-slate-800">{selectedGuestIds.length}</strong> guest(s) from this event? They will no longer be able to contribute.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkRemove}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK BLOCK CONFIRM DIALOG */}
      {bulkBlockConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">Block Selected Guests?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to block <strong className="text-slate-800">{selectedGuestIds.length}</strong> guest(s)? Their media uploads will be suspended.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setBulkBlockConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkBlock}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Yes, Block
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
