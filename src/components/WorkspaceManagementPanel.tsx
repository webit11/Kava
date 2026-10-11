import React, { useState, useMemo } from 'react';
import { 
  HardDrive, Search, Filter, Layers, Table, LayoutGrid, Kanban, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Trash2, UserCheck, CheckCircle2, XCircle, Clock, Zap, AlertTriangle, 
  Download, RefreshCw, Eye, CreditCard, FileText, BarChart3, Globe, 
  Users, Check, X, ArrowUpDown, Sparkles, ExternalLink, ShieldAlert,
  SlidersHorizontal, ShieldCheck, Activity, Play, Pause, FolderPlus, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface WorkspaceItem {
  id: string;
  name: string;
  host: string;
  ownerEmail?: string;
  plan: 'Free' | 'Premium' | 'Enterprise';
  eventsCount: number;
  storageMB: number;
  maxStorageMB: number;
  status: 'Active' | 'Suspended' | 'Archived';
  region?: string;
  createdDate?: string;
  lastActive?: string;
  teamMembers?: number;
  assignedAdmin?: string;
  syncStatus?: 'Synced' | 'Syncing' | 'Failed' | 'Pending';
  billingStatus?: 'Paid' | 'Past Due' | 'Trial' | 'Expired';
  systemHealth?: 'Healthy' | 'Warning' | 'Critical';
  brandKit?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    typography?: string;
  };
}

interface WorkspaceManagementPanelProps {
  workspaces: WorkspaceItem[];
  onSaveWorkspaces: (updatedWorkspaces: WorkspaceItem[]) => void;
  onTriggerToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  onImpersonateUser: (userName: string, targetView: 'dashboard' | 'guest') => void;
}

type ViewMode = 'card' | 'table' | 'kanban';

export default function WorkspaceManagementPanel({
  workspaces,
  onSaveWorkspaces,
  onTriggerToast,
  onImpersonateUser
}: WorkspaceManagementPanelProps) {
  // Enriched workspaces with full defaulted attributes
  const enrichedWorkspaces = useMemo(() => {
    return workspaces.map((ws, idx) => {
      const storagePct = (ws.storageMB / (ws.maxStorageMB || 1024)) * 100;
      let defaultHealth: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
      if (storagePct > 90 || ws.status === 'Suspended') defaultHealth = 'Critical';
      else if (storagePct > 75 || ws.plan === 'Free') defaultHealth = 'Warning';

      return {
        ...ws,
        ownerEmail: ws.ownerEmail || `${ws.host.toLowerCase().replace(/\s+/g, '.')}@kavamedia.io`,
        region: ws.region || (idx % 2 === 0 ? 'us-east-1 (N. Virginia)' : idx % 3 === 0 ? 'eu-central-1 (Frankfurt)' : 'us-west-2 (Oregon)'),
        createdDate: ws.createdDate || `2026-0${(idx % 6) + 1}-12`,
        lastActive: ws.lastActive || `2026-07-${28 - idx}T14:30:00Z`,
        teamMembers: ws.teamMembers ?? ((idx % 5) + 1),
        assignedAdmin: ws.assignedAdmin || (idx % 2 === 0 ? 'Sophia Chen' : 'Aris Thorne'),
        syncStatus: ws.syncStatus || (storagePct > 95 ? 'Failed' : idx % 4 === 0 ? 'Syncing' : 'Synced'),
        billingStatus: ws.billingStatus || (ws.status === 'Suspended' ? 'Past Due' : ws.plan === 'Free' ? 'Trial' : 'Paid'),
        systemHealth: ws.systemHealth || defaultHealth,
      };
    });
  }, [workspaces]);

  // View Switcher & Layout State
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedWsIdForDrawer, setSelectedWsIdForDrawer] = useState<string | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [storageFilter, setStorageFilter] = useState<string>('ALL');
  const [activityFilter, setActivityFilter] = useState<string>('ALL');
  const [activePreset, setActivePreset] = useState<string>('ALL');

  // Sorting State (Multi-column / single toggle)
  const [sortField, setSortField] = useState<keyof WorkspaceItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Modal States for Specific Quick Actions
  const [activeModal, setActiveModal] = useState<'assignAdmin' | 'billing' | 'audit' | 'analytics' | 'createWorkspace' | null>(null);
  const [targetWsForModal, setTargetWsForModal] = useState<WorkspaceItem | null>(null);
  const [newAdminName, setNewAdminName] = useState('');

  // New Workspace Modal Form
  const [newWsForm, setNewWsForm] = useState({
    name: '',
    host: '',
    plan: 'Free' as 'Free' | 'Premium' | 'Enterprise',
    maxStorageMB: 5120
  });

  // Calculate Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = enrichedWorkspaces.length;
    const active = enrichedWorkspaces.filter(w => w.status === 'Active').length;
    const suspended = enrichedWorkspaces.filter(w => w.status === 'Suspended').length;
    const archived = enrichedWorkspaces.filter(w => w.status === 'Archived').length;
    
    const usedMB = enrichedWorkspaces.reduce((acc, w) => acc + w.storageMB, 0);
    const maxMB = enrichedWorkspaces.reduce((acc, w) => acc + w.maxStorageMB, 0);
    const usedGB = (usedMB / 1024).toFixed(1);
    const maxGB = (maxMB / 1024).toFixed(1);
    const storagePct = maxMB > 0 ? ((usedMB / maxMB) * 100).toFixed(1) : '0';

    const premium = enrichedWorkspaces.filter(w => w.plan === 'Premium' || w.plan === 'Enterprise').length;
    const free = enrichedWorkspaces.filter(w => w.plan === 'Free').length;
    const recentlyCreated = enrichedWorkspaces.filter(w => new Date(w.createdDate || '').getTime() > Date.now() - 30 * 86400 * 1000).length;

    return { total, active, suspended, archived, usedGB, maxGB, storagePct, premium, free, recentlyCreated };
  }, [enrichedWorkspaces]);

  // Apply Filter Presets
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setCurrentPage(1);
    if (presetKey === 'ALL') {
      setStatusFilter('ALL');
      setPlanFilter('ALL');
      setRegionFilter('ALL');
      setStorageFilter('ALL');
      setActivityFilter('ALL');
      setSearchQuery('');
    } else if (presetKey === 'CAPACITY_WARNING') {
      setStatusFilter('ALL');
      setStorageFilter('NEAR_CAPACITY');
    } else if (presetKey === 'SUSPENDED') {
      setStatusFilter('Suspended');
      setStorageFilter('ALL');
    } else if (presetKey === 'ENTERPRISE') {
      setPlanFilter('Enterprise');
      setStatusFilter('ALL');
    } else if (presetKey === 'INACTIVE') {
      setActivityFilter('INACTIVE_30D');
    } else if (presetKey === 'SYNC_FAILURES') {
      setStatusFilter('ALL');
      setSearchQuery('Failed');
    }
  };

  // Filter & Search Logic
  const filteredWorkspaces = useMemo(() => {
    return enrichedWorkspaces.filter(ws => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = 
          ws.name.toLowerCase().includes(q) ||
          ws.id.toLowerCase().includes(q) ||
          ws.host.toLowerCase().includes(q) ||
          (ws.ownerEmail && ws.ownerEmail.toLowerCase().includes(q)) ||
          (ws.assignedAdmin && ws.assignedAdmin.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && ws.status !== statusFilter) return false;

      // Plan
      if (planFilter !== 'ALL' && ws.plan !== planFilter) return false;

      // Region
      if (regionFilter !== 'ALL' && !(ws.region && ws.region.includes(regionFilter))) return false;

      // Storage
      if (storageFilter !== 'ALL') {
        const pct = (ws.storageMB / ws.maxStorageMB) * 100;
        if (storageFilter === 'NEAR_CAPACITY' && pct < 80) return false;
        if (storageFilter === 'MODERATE' && (pct < 50 || pct >= 80)) return false;
        if (storageFilter === 'LOW' && pct >= 50) return false;
      }

      // Activity
      if (activityFilter !== 'ALL') {
        const daysAgo = (Date.now() - new Date(ws.lastActive || '').getTime()) / (1000 * 3600 * 24);
        if (activityFilter === 'RECENT' && daysAgo > 7) return false;
        if (activityFilter === 'INACTIVE_30D' && daysAgo <= 30) return false;
      }

      return true;
    });
  }, [enrichedWorkspaces, searchQuery, statusFilter, planFilter, regionFilter, storageFilter, activityFilter]);

  // Sorting Logic
  const sortedWorkspaces = useMemo(() => {
    return [...filteredWorkspaces].sort((a, b) => {
      let valA: any = a[sortField] ?? '';
      let valB: any = b[sortField] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredWorkspaces, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedWorkspaces.length / pageSize) || 1;
  const paginatedWorkspaces = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedWorkspaces.slice(start, start + pageSize);
  }, [sortedWorkspaces, currentPage, pageSize]);

  // Toggle Header Sorting
  const handleHeaderSort = (field: keyof WorkspaceItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection Handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedWorkspaces.map(w => w.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectId = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // State Mutation Helpers
  const updateSingleWorkspace = (id: string, mutator: (ws: WorkspaceItem) => WorkspaceItem) => {
    const nextList = enrichedWorkspaces.map(ws => ws.id === id ? mutator(ws) : ws);
    onSaveWorkspaces(nextList);
  };

  // Quick Action Handlers
  const handleToggleStatus = (id: string) => {
    updateSingleWorkspace(id, ws => {
      const nextStatus = ws.status === 'Active' ? 'Suspended' : 'Active';
      onTriggerToast(
        nextStatus === 'Active' ? 'Workspace Activated' : 'Workspace Suspended',
        `Updated "${ws.name}" status to ${nextStatus}.`,
        nextStatus === 'Active' ? 'success' : 'info'
      );
      return { ...ws, status: nextStatus };
    });
  };

  const handleArchiveWorkspace = (id: string) => {
    updateSingleWorkspace(id, ws => {
      onTriggerToast('Workspace Archived', `Moved "${ws.name}" into archived state.`, 'info');
      return { ...ws, status: 'Archived' };
    });
  };

  const handleDeleteWorkspace = (id: string) => {
    const ws = enrichedWorkspaces.find(w => w.id === id);
    if (!ws) return;
    if (confirm(`Are you sure you want to permanently delete workspace "${ws.name}" (${ws.id})? This cannot be undone.`)) {
      const nextList = enrichedWorkspaces.filter(w => w.id !== id);
      onSaveWorkspaces(nextList);
      setSelectedIds(prev => prev.filter(i => i !== id));
      if (selectedWsIdForDrawer === id) setSelectedWsIdForDrawer(null);
      onTriggerToast('Workspace Deleted', `Purged workspace "${ws.name}".`, 'error');
    }
  };

  const handleResetStorage = (id: string) => {
    updateSingleWorkspace(id, ws => {
      onTriggerToast('Storage Reset', `Cleared cached storage allocations for "${ws.name}".`, 'success');
      return { ...ws, storageMB: 0, syncStatus: 'Synced' };
    });
  };

  const handleUpgradePlan = (id: string, newPlan: 'Free' | 'Premium' | 'Enterprise') => {
    updateSingleWorkspace(id, ws => {
      const newMax = newPlan === 'Enterprise' ? 20480 : newPlan === 'Premium' ? 5120 : 500;
      onTriggerToast('Plan Upgraded', `Upgraded "${ws.name}" to ${newPlan} tier (${newMax / 1024} GB Storage).`, 'success');
      return { ...ws, plan: newPlan, maxStorageMB: newMax, billingStatus: 'Paid' };
    });
  };

  // Bulk Operations
  const handleBulkStatusChange = (status: 'Active' | 'Suspended' | 'Archived') => {
    if (selectedIds.length === 0) return;
    const nextList = enrichedWorkspaces.map(ws => selectedIds.includes(ws.id) ? { ...ws, status } : ws);
    onSaveWorkspaces(nextList);
    onTriggerToast('Bulk Action Executed', `Set ${selectedIds.length} workspaces to ${status}.`, 'success');
  };

  const handleBulkUpgradePlan = () => {
    if (selectedIds.length === 0) return;
    const nextList = enrichedWorkspaces.map(ws => selectedIds.includes(ws.id) ? { ...ws, plan: 'Premium', maxStorageMB: 5120, billingStatus: 'Paid' } : ws);
    onSaveWorkspaces(nextList);
    onTriggerToast('Bulk Upgrade', `Upgraded ${selectedIds.length} workspaces to Premium.`, 'success');
  };

  const handleBulkResetStorage = () => {
    if (selectedIds.length === 0) return;
    const nextList = enrichedWorkspaces.map(ws => selectedIds.includes(ws.id) ? { ...ws, storageMB: 0 } : ws);
    onSaveWorkspaces(nextList);
    onTriggerToast('Bulk Reset', `Reset storage for ${selectedIds.length} workspaces.`, 'info');
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected workspaces?`)) {
      const nextList = enrichedWorkspaces.filter(ws => !selectedIds.includes(ws.id));
      onSaveWorkspaces(nextList);
      setSelectedIds([]);
      onTriggerToast('Bulk Delete', `Deleted ${selectedIds.length} workspaces.`, 'error');
    }
  };

  const handleExportCSV = () => {
    const targets = selectedIds.length > 0 ? enrichedWorkspaces.filter(w => selectedIds.includes(w.id)) : enrichedWorkspaces;
    const headers = ['Workspace ID', 'Name', 'Host', 'Email', 'Plan', 'Status', 'Storage Used (MB)', 'Storage Max (MB)', 'Events Count', 'Region', 'Created Date'];
    const rows = targets.map(w => [
      w.id, `"${w.name}"`, `"${w.host}"`, `"${w.ownerEmail}"`, w.plan, w.status, w.storageMB, w.maxStorageMB, w.eventsCount, `"${w.region}"`, w.createdDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kava_workspaces_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast('CSV Exported', `Exported ${targets.length} workspace records.`, 'success');
  };

  // Create Workspace Form Submit
  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsForm.name || !newWsForm.host) {
      onTriggerToast('Form Incomplete', 'Please provide a workspace name and host.', 'error');
      return;
    }
    const newWs: WorkspaceItem = {
      id: `ws-${Date.now().toString().slice(-4)}`,
      name: newWsForm.name,
      host: newWsForm.host,
      ownerEmail: `${newWsForm.host.toLowerCase().replace(/\s+/g, '.')}@kavamedia.io`,
      plan: newWsForm.plan,
      eventsCount: 1,
      storageMB: 24,
      maxStorageMB: newWsForm.maxStorageMB,
      status: 'Active',
      region: 'us-east-1 (N. Virginia)',
      createdDate: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toISOString(),
      teamMembers: 1,
      syncStatus: 'Synced',
      billingStatus: 'Paid',
      systemHealth: 'Healthy'
    };
    onSaveWorkspaces([newWs, ...enrichedWorkspaces]);
    setActiveModal(null);
    setNewWsForm({ name: '', host: '', plan: 'Free', maxStorageMB: 5120 });
    onTriggerToast('Workspace Provisioned', `Created workspace "${newWs.name}" for ${newWs.host}.`, 'success');
  };

  // Get active drawer workspace
  const selectedWsForDrawer = useMemo(() => {
    return enrichedWorkspaces.find(w => w.id === selectedWsIdForDrawer) || null;
  }, [enrichedWorkspaces, selectedWsIdForDrawer]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. TOP DASHBOARD SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total & Active */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Workspaces</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{summaryMetrics.total}</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">({summaryMetrics.active} Active)</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{summaryMetrics.recentlyCreated} created in last 30d</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        {/* Suspended & Archived */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Suspended / Archived</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-amber-600 font-mono">{summaryMetrics.suspended}</span>
              <span className="text-xs font-bold text-slate-400 font-mono">/ {summaryMetrics.archived} Archived</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Isolated node clusters</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Global Storage Allocation */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex-1 mr-3">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Storage Allocation</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{summaryMetrics.usedGB}</span>
              <span className="text-xs font-bold text-slate-500 font-mono">/ {summaryMetrics.maxGB} GB</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full ${
                  parseFloat(summaryMetrics.storagePct) > 85 ? 'bg-rose-500' : 'bg-slate-900'
                }`}
                style={{ width: `${Math.min(100, parseFloat(summaryMetrics.storagePct))}%` }}
              />
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Plans Distribution */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Tier Subscriptions</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{summaryMetrics.premium}</span>
              <span className="text-xs font-bold text-slate-700 uppercase">Paid Tiers</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{summaryMetrics.free} Free Community Workspaces</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. SEARCH, SAVED PRESETS, FILTERS & VIEW SWITCHER STRIP */}
      <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm space-y-4">
        
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by workspace name, ID, host, email, or admin..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
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

          {/* Action Toolbar & View Switcher */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            
            {/* Create Workspace Button */}
            <button
              onClick={() => setActiveModal('createWorkspace')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>New Workspace</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* View Switcher Controls */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Compact Table View"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>

              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Kanban Status View"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>

          </div>

        </div>

        {/* Filter Dropdowns Bar */}
        <div className="flex items-center space-x-2 flex-wrap gap-2 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filters:</span>
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Status: All</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended Only</option>
            <option value="Archived">Archived Only</option>
          </select>

          {/* Subscription Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Plan: All Tiers</option>
            <option value="Free">Free Plan</option>
            <option value="Premium">Premium Plan</option>
            <option value="Enterprise">Enterprise Plan</option>
          </select>

          {/* Storage Filter */}
          <select
            value={storageFilter}
            onChange={(e) => setStorageFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Storage: All Usage</option>
            <option value="NEAR_CAPACITY">Near Capacity (&gt;80%)</option>
            <option value="MODERATE">Moderate (50%-80%)</option>
            <option value="LOW">Low (&lt;50%)</option>
          </select>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Region: All</option>
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-central-1">EU Central (Frankfurt)</option>
          </select>

          {/* Activity Filter */}
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Activity: All</option>
            <option value="RECENT">Active Recently (&lt;7d)</option>
            <option value="INACTIVE_30D">Inactive (&gt;30d)</option>
          </select>

          {(statusFilter !== 'ALL' || planFilter !== 'ALL' || storageFilter !== 'ALL' || regionFilter !== 'ALL' || activityFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => applyPreset('ALL')}
              className="px-2.5 py-1.5 text-xs text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Saved Filter Presets Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-2 flex-shrink-0">Presets:</span>
          {[
            { id: 'ALL', label: 'All Workspaces' },
            { id: 'CAPACITY_WARNING', label: '⚠️ Near Storage Limit (>80%)' },
            { id: 'SUSPENDED', label: '🛑 Suspended Workspaces' },
            { id: 'ENTERPRISE', label: '👑 Enterprise Accounts' },
            { id: 'INACTIVE', label: '💤 Inactive (>30 Days)' },
            { id: 'SYNC_FAILURES', label: '⚡ Sync Issues' }
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

      </div>

      {/* 3. BULK OPERATIONS ACTION BAR (When selection > 0) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 text-white p-4 rounded-[24px] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800"
          >
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-mono font-extrabold text-xs flex items-center justify-center border border-slate-700">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold">Workspaces Selected</span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Deselect All
              </button>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <button
                onClick={() => handleBulkStatusChange('Active')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Activate All
              </button>

              <button
                onClick={() => handleBulkStatusChange('Suspended')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Suspend All
              </button>

              <button
                onClick={() => handleBulkStatusChange('Archived')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
              >
                Archive All
              </button>

              <button
                onClick={handleBulkUpgradePlan}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
              >
                Upgrade to Premium
              </button>

              <button
                onClick={handleBulkResetStorage}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
              >
                Reset Storage
              </button>

              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MAIN CONTENT VIEW: TABLE / CARDS / KANBAN */}

      {/* VIEW 1: COMPACT TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 border-b border-slate-100 select-none">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedWorkspaces.length > 0 && paginatedWorkspaces.every(w => selectedIds.includes(w.id))}
                      onChange={handleSelectAllOnPage}
                      className="rounded border-slate-300 accent-slate-900 cursor-pointer"
                    />
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('name')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Workspace Name & ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('host')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Host / Owner</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('status')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('plan')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Plan</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('eventsCount')} 
                    className="px-4 py-3.5 text-center cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Capsules</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('storageMB')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Storage Usage</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleHeaderSort('createdDate')} 
                    className="px-4 py-3.5 cursor-pointer hover:text-slate-900 transition-colors hidden md:table-cell"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    </div>
                  </th>

                  <th className="px-4 py-3.5 hidden lg:table-cell">Health & Sync</th>

                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {paginatedWorkspaces.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No workspaces found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedWorkspaces.map(ws => {
                    const storagePct = (ws.storageMB / ws.maxStorageMB) * 100;
                    const isSelected = selectedIds.includes(ws.id);

                    return (
                      <tr 
                        key={ws.id} 
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-100/80' : ''
                        }`}
                        onClick={() => setSelectedWsIdForDrawer(ws.id)}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectId(ws.id)}
                            className="rounded border-slate-300 accent-slate-900 cursor-pointer"
                          />
                        </td>

                        {/* Name & ID */}
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-extrabold text-slate-900">{ws.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono font-bold">
                                {ws.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Host */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-bold text-slate-900">{ws.host}</p>
                            <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[140px]">
                              {ws.ownerEmail}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            ws.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            ws.status === 'Suspended' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {ws.status}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                            ws.plan === 'Enterprise' ? 'bg-slate-900 text-white' :
                            ws.plan === 'Premium' ? 'bg-slate-200 text-slate-900 border border-slate-300' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {ws.plan}
                          </span>
                        </td>

                        {/* Memory Capsules */}
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          {ws.eventsCount}
                        </td>

                        {/* Storage Usage */}
                        <td className="px-4 py-3 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500 font-bold">{ws.storageMB} MB</span>
                              <span className="text-slate-400">/ {ws.maxStorageMB} MB</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  storagePct > 85 ? 'bg-rose-500' : 'bg-slate-900'
                                }`}
                                style={{ width: `${Math.min(100, storagePct)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500 hidden md:table-cell">
                          {ws.createdDate}
                        </td>

                        {/* Health & Sync */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              ws.systemHealth === 'Healthy' ? 'bg-emerald-500' :
                              ws.systemHealth === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span className="text-[10px] font-bold text-slate-700">{ws.syncStatus}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            
                            {/* Impersonate */}
                            <button
                              onClick={() => onImpersonateUser(ws.host, 'dashboard')}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Impersonate Host"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Toggle */}
                            <button
                              onClick={() => handleToggleStatus(ws.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                ws.status === 'Active' 
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={ws.status === 'Active' ? 'Suspend' : 'Activate'}
                            >
                              {ws.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>

                            {/* View Details Drawer */}
                            <button
                              onClick={() => setSelectedWsIdForDrawer(ws.id)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Details Drawer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteWorkspace(ws.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Workspace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-slate-400">
                Showing {sortedWorkspaces.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedWorkspaces.length)} of {sortedWorkspaces.length}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 font-mono font-bold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CARD GRID VIEW */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedWorkspaces.map(ws => {
            const storagePct = (ws.storageMB / ws.maxStorageMB) * 100;
            const isSelected = selectedIds.includes(ws.id);

            return (
              <div 
                key={ws.id} 
                className={`bg-white border rounded-[28px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all ${
                  isSelected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectId(ws.id)}
                        className="rounded border-slate-300 accent-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">{ws.id}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                        ws.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                        ws.status === 'Suspended' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ws.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-slate-100 text-slate-700">
                        {ws.plan}
                      </span>
                    </div>
                  </div>

                  <h4 
                    onClick={() => setSelectedWsIdForDrawer(ws.id)}
                    className="text-base font-extrabold text-slate-900 line-clamp-1 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {ws.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Host: {ws.host}</p>

                  {/* Metrics */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Memory Capsules</span>
                      <span className="font-bold text-slate-700">{ws.eventsCount} Active</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Storage Allocation</span>
                      <span className="font-bold text-slate-700">{ws.storageMB} MB / {ws.maxStorageMB} MB</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${storagePct > 85 ? 'bg-rose-500' : 'bg-slate-900'}`} 
                        style={{ width: `${Math.min(100, storagePct)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Brand Kit Details */}
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">Brand Kit</span>
                    <div className="flex items-center space-x-2">
                      {ws.brandKit?.logoUrl ? (
                        <img src={ws.brandKit.logoUrl} alt="Logo" className="h-4 max-w-[48px] object-contain rounded" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[8px] text-slate-400 font-mono font-bold">Default KAVA</span>
                      )}
                      <div className="flex space-x-1">
                        <span className="w-3 h-3 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: ws.brandKit?.primaryColor || '#0F172A' }} />
                        <span className="w-3 h-3 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: ws.brandKit?.accentColor || '#334155' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Quick Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onImpersonateUser(ws.host, 'dashboard')}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Impersonate</span>
                  </button>

                  <button
                    onClick={() => setSelectedWsIdForDrawer(ws.id)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(ws.id)}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer border ${
                      ws.status === 'Suspended' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                    title={ws.status === 'Suspended' ? 'Activate' : 'Suspend'}
                  >
                    {ws.status === 'Suspended' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: KANBAN STATUS VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Active', 'Suspended', 'Archived'] as const).map(colStatus => {
            const itemsInCol = enrichedWorkspaces.filter(w => w.status === colStatus);

            return (
              <div key={colStatus} className="bg-slate-50 border border-slate-200 rounded-[28px] p-4 flex flex-col space-y-4">
                
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      colStatus === 'Active' ? 'bg-emerald-500' :
                      colStatus === 'Suspended' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    <h3 className="text-sm font-extrabold text-slate-900">{colStatus} Workspaces</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                    {itemsInCol.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-3 min-h-[300px]">
                  {itemsInCol.map(ws => (
                    <div 
                      key={ws.id}
                      onClick={() => setSelectedWsIdForDrawer(ws.id)}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{ws.id}</span>
                        <span className="text-[9px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {ws.plan}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{ws.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Host: {ws.host}</p>
                      </div>

                      {/* Quick Status Move Dropdown */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400 font-bold">Move to:</span>
                        <div className="flex space-x-1">
                          {colStatus !== 'Active' && (
                            <button
                              onClick={() => handleToggleStatus(ws.id)}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-md"
                            >
                              Active
                            </button>
                          )}
                          {colStatus !== 'Suspended' && (
                            <button
                              onClick={() => handleToggleStatus(ws.id)}
                              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[9px] font-bold rounded-md"
                            >
                              Suspended
                            </button>
                          )}
                          {colStatus !== 'Archived' && (
                            <button
                              onClick={() => handleArchiveWorkspace(ws.id)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold rounded-md"
                            >
                              Archived
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. COLLAPSIBLE WORKSPACE DETAILS DRAWER */}
      <AnimatePresence>
        {selectedWsForDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                
                {/* Drawer Header */}
                <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                      Workspace Details Panel
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">{selectedWsForDrawer.name}</h3>
                    <p className="text-xs text-slate-300 font-medium">ID: {selectedWsForDrawer.id} • Host: {selectedWsForDrawer.host}</p>
                  </div>
                  <button
                    onClick={() => setSelectedWsIdForDrawer(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* LIVE WORKSPACE HEALTH INDICATOR BOX */}
                  <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-slate-700" />
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Live Workspace Health</h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedWsForDrawer.systemHealth === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                        selectedWsForDrawer.systemHealth === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedWsForDrawer.systemHealth} Status
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block">Storage Quota Used</span>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5 font-mono">
                          {((selectedWsForDrawer.storageMB / selectedWsForDrawer.maxStorageMB) * 100).toFixed(1)}%
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block">Active Events</span>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5 font-mono">
                          {selectedWsForDrawer.eventsCount} Capsules
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block">Cloud Sync Status</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${selectedWsForDrawer.syncStatus === 'Synced' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {selectedWsForDrawer.syncStatus}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block">Billing Status</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          {selectedWsForDrawer.billingStatus}
                        </p>
                      </div>
                    </div>

                    {/* Contextual Warnings */}
                    {(selectedWsForDrawer.storageMB / selectedWsForDrawer.maxStorageMB) > 0.85 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span><strong>Storage Warning:</strong> Usage is over 85% of allocated quota limit. Consider upgrading storage allocation.</span>
                      </div>
                    )}
                  </div>

                  {/* OVERVIEW METRICS */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Workspace Profile & Configuration</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Host / Owner:</span>
                        <p className="font-bold text-slate-900">{selectedWsForDrawer.host}</p>
                        <p className="text-[11px] text-slate-500">{selectedWsForDrawer.ownerEmail}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium">Assigned Admin:</span>
                        <p className="font-bold text-slate-900">{selectedWsForDrawer.assignedAdmin}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium">Cloud Region:</span>
                        <p className="font-bold text-slate-900">{selectedWsForDrawer.region}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium">Created Date:</span>
                        <p className="font-bold text-slate-900 font-mono">{selectedWsForDrawer.createdDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* SUBSCRIPTION & QUOTA ADJUSTER */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quota & Tier Adjuster</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold">Plan Tier:</span>
                        <div className="flex space-x-1">
                          {(['Free', 'Premium', 'Enterprise'] as const).map(tier => (
                            <button
                              key={tier}
                              onClick={() => handleUpgradePlan(selectedWsForDrawer.id, tier)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                selectedWsForDrawer.plan === tier
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {tier}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold">Storage Reset:</span>
                        <button
                          onClick={() => handleResetStorage(selectedWsForDrawer.id)}
                          className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 cursor-pointer"
                        >
                          Clear Cached Storage
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACTIONS TOOLBAR (Complete 12 Quick Actions) */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Actions Console</h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      
                      {/* 1. Open Workspace */}
                      <button
                        onClick={() => {
                          onTriggerToast('Opening Workspace', `Opening studio view for ${selectedWsForDrawer.name}`, 'info');
                          onImpersonateUser(selectedWsForDrawer.host, 'dashboard');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-700" />
                        <span>Open Workspace</span>
                      </button>

                      {/* 2. Impersonate Host */}
                      <button
                        onClick={() => onImpersonateUser(selectedWsForDrawer.host, 'dashboard')}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-slate-700" />
                        <span>Impersonate Host</span>
                      </button>

                      {/* 3. Suspend / Activate */}
                      <button
                        onClick={() => handleToggleStatus(selectedWsForDrawer.id)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        {selectedWsForDrawer.status === 'Active' ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
                        <span>{selectedWsForDrawer.status === 'Active' ? 'Suspend Node' : 'Activate Node'}</span>
                      </button>

                      {/* 4. Archive */}
                      <button
                        onClick={() => handleArchiveWorkspace(selectedWsForDrawer.id)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span>Archive Workspace</span>
                      </button>

                      {/* 5. Assign Workspace Admin */}
                      <button
                        onClick={() => {
                          setTargetWsForModal(selectedWsForDrawer);
                          setActiveModal('assignAdmin');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-slate-700" />
                        <span>Assign Admin</span>
                      </button>

                      {/* 6. View Billing */}
                      <button
                        onClick={() => {
                          setTargetWsForModal(selectedWsForDrawer);
                          setActiveModal('billing');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>View Billing</span>
                      </button>

                      {/* 7. View Audit Log */}
                      <button
                        onClick={() => {
                          setTargetWsForModal(selectedWsForDrawer);
                          setActiveModal('audit');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>View Audit Log</span>
                      </button>

                      {/* 8. Open Analytics */}
                      <button
                        onClick={() => {
                          setTargetWsForModal(selectedWsForDrawer);
                          setActiveModal('analytics');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-800 font-bold flex items-center space-x-2 text-left cursor-pointer"
                      >
                        <BarChart3 className="w-4 h-4 text-slate-700" />
                        <span>Open Analytics</span>
                      </button>

                    </div>
                  </div>

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => handleDeleteWorkspace(selectedWsForDrawer.id)}
                  className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Workspace</span>
                </button>

                <button
                  onClick={() => setSelectedWsIdForDrawer(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODALS FOR QUICK ACTIONS */}

      {/* MODAL 1: ASSIGN WORKSPACE ADMIN */}
      {activeModal === 'assignAdmin' && targetWsForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Assign Workspace Admin</h3>
            <p className="text-xs text-slate-500 font-medium">
              Specify a dedicated Workspace Admin producer to manage event capsules and team permissions for "{targetWsForModal.name}".
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Name / Email</label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="e.g. Sophia Chen"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => { setActiveModal(null); setNewAdminName(''); }}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newAdminName.trim()) {
                    updateSingleWorkspace(targetWsForModal.id, ws => ({ ...ws, assignedAdmin: newAdminName.trim() }));
                    onTriggerToast('Admin Assigned', `Assigned ${newAdminName} to ${targetWsForModal.name}.`, 'success');
                  }
                  setActiveModal(null);
                  setNewAdminName('');
                }}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BILLING OVERVIEW */}
      {activeModal === 'billing' && targetWsForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Billing & Subscriptions</h3>
                <p className="text-xs text-slate-500">{targetWsForModal.name} ({targetWsForModal.id})</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block font-bold">Current Tier</span>
                  <span className="text-sm font-black text-slate-900">{targetWsForModal.plan} Plan</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  {targetWsForModal.billingStatus}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-extrabold text-slate-900 block">Recent Payment Invoices</span>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span>INV-2026-0701 • Monthly Subscription</span>
                  <span className="font-mono font-bold">$149.00 (Paid)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span>INV-2026-0601 • Monthly Subscription</span>
                  <span className="font-mono font-bold">$149.00 (Paid)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AUDIT LOG */}
      {activeModal === 'audit' && targetWsForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Workspace Audit Logs</h3>
                <p className="text-xs text-slate-500">{targetWsForModal.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">2026-07-28 14:32:10 UTC</span>
                <p className="font-bold text-slate-800 mt-0.5">SuperAdmin updated storage quota to {targetWsForModal.maxStorageMB} MB</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">2026-07-25 09:12:00 UTC</span>
                <p className="font-bold text-slate-800 mt-0.5">Host logged into studio console</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">2026-07-20 18:45:00 UTC</span>
                <p className="font-bold text-slate-800 mt-0.5">Cloud sync status verified (OK)</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ANALYTICS OVERVIEW */}
      {activeModal === 'analytics' && targetWsForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Workspace Analytics</h3>
                <p className="text-xs text-slate-500">{targetWsForModal.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-700 uppercase">Active Capsules</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{targetWsForModal.eventsCount}</p>
              </div>

              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-700 uppercase">Team Members</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{targetWsForModal.teamMembers}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PROVISION NEW WORKSPACE */}
      {activeModal === 'createWorkspace' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateWorkspaceSubmit} className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Provision New Workspace</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workspace Name</label>
                <input
                  type="text"
                  required
                  value={newWsForm.name}
                  onChange={(e) => setNewWsForm({ ...newWsForm, name: e.target.value })}
                  placeholder="e.g. Sunset Boulevard Studio"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Host / Owner Name</label>
                <input
                  type="text"
                  required
                  value={newWsForm.host}
                  onChange={(e) => setNewWsForm({ ...newWsForm, host: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plan Tier</label>
                  <select
                    value={newWsForm.plan}
                    onChange={(e) => setNewWsForm({ ...newWsForm, plan: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Storage Allocation</label>
                  <select
                    value={newWsForm.maxStorageMB}
                    onChange={(e) => setNewWsForm({ ...newWsForm, maxStorageMB: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value={500}>500 MB (Free)</option>
                    <option value={5120}>5 GB (Premium)</option>
                    <option value={10240}>10 GB (Pro)</option>
                    <option value={20480}>20 GB (Enterprise)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Provision
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
