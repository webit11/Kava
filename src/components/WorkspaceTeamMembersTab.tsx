import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, UserPlus, Search, Filter, MoreHorizontal, Shield, 
  CheckCircle2, Clock, AlertCircle, Trash2, Edit3, Send, 
  UserCheck, UserX, X, Plus, Sparkles, ChevronDown, Check, 
  AlertTriangle, Lock, Mail, ExternalLink, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { getUserSubscription, getStoredPlans, DEFAULT_PLANS } from '../lib/billing';

export interface WorkspaceTeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Workspace Owner' | 'Admin' | 'Editor' | 'Moderator' | 'Viewer';
  status: 'Active' | 'Pending Invitation' | 'Suspended';
  lastActivity: string;
  invitedAt: string;
  permissions: {
    canManageEvents: boolean;
    canEditSettings: boolean;
    canManageTeam: boolean;
    canModerate: boolean;
    canViewAnalytics: boolean;
  };
}

const DEFAULT_ROLE_PERMISSIONS = {
  'Workspace Owner': {
    canManageEvents: true,
    canEditSettings: true,
    canManageTeam: true,
    canModerate: true,
    canViewAnalytics: true,
  },
  'Admin': {
    canManageEvents: true,
    canEditSettings: true,
    canManageTeam: true,
    canModerate: true,
    canViewAnalytics: true,
  },
  'Editor': {
    canManageEvents: true,
    canEditSettings: false,
    canManageTeam: false,
    canModerate: true,
    canViewAnalytics: true,
  },
  'Moderator': {
    canManageEvents: false,
    canEditSettings: false,
    canManageTeam: false,
    canModerate: true,
    canViewAnalytics: true,
  },
  'Viewer': {
    canManageEvents: false,
    canEditSettings: false,
    canManageTeam: false,
    canModerate: false,
    canViewAnalytics: true,
  }
};

interface WorkspaceTeamMembersTabProps {
  currentWorkspace: { id: string; name: string; host: string };
  currentUser: any;
  setToast: (toast: { title: string; description: string; items: string[] } | null) => void;
  onOpenCheckout?: (planId: string, reason?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export default function WorkspaceTeamMembersTab({
  currentWorkspace,
  currentUser,
  setToast,
  onOpenCheckout,
  setActiveTab
}: WorkspaceTeamMembersTabProps) {
  const wsId = currentWorkspace.id;
  const subscription = getUserSubscription();
  const plans = getStoredPlans();
  const activePlan = plans.find(p => p.id === subscription.planId) || DEFAULT_PLANS[0];
  const maxTeamMembers = activePlan.teamMembersCount || 1;

  // Members state
  const [members, setMembers] = useState<WorkspaceTeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Active Dropdown Row ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Workspace Owner' | 'Admin' | 'Editor' | 'Moderator' | 'Viewer'>('Editor');
  const [invitePermissions, setInvitePermissions] = useState(DEFAULT_ROLE_PERMISSIONS['Editor']);

  // Edit Role Modal State
  const [editingMember, setEditingMember] = useState<WorkspaceTeamMember | null>(null);
  const [editRole, setEditRole] = useState<'Workspace Owner' | 'Admin' | 'Editor' | 'Moderator' | 'Viewer'>('Editor');
  const [editPermissions, setEditPermissions] = useState(DEFAULT_ROLE_PERMISSIONS['Editor']);

  // Remove Modal State
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceTeamMember | null>(null);

  // Load initial team members
  useEffect(() => {
    const storageKey = `kava_ws_team_${wsId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved team members", e);
        loadDefaultMembers();
      }
    } else {
      loadDefaultMembers();
    }
  }, [wsId]);

  const loadDefaultMembers = () => {
    const defaultList: WorkspaceTeamMember[] = [
      {
        id: 'mbr-owner',
        name: currentUser.name || currentWorkspace.host || 'Workspace Owner',
        email: currentUser.email || 'owner@kava.app',
        role: 'Workspace Owner',
        status: 'Active',
        lastActivity: 'Active now',
        invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: DEFAULT_ROLE_PERMISSIONS['Workspace Owner']
      },
      {
        id: 'mbr-sarah',
        name: 'Sarah Connor',
        email: 'sarah@kava.co',
        role: 'Admin',
        status: 'Active',
        lastActivity: '2 hours ago',
        invitedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: DEFAULT_ROLE_PERMISSIONS['Admin']
      },
      {
        id: 'mbr-alex',
        name: 'Alex Chen',
        email: 'alex@kava.co',
        role: 'Moderator',
        status: 'Pending Invitation',
        lastActivity: 'Invited Jul 28',
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: DEFAULT_ROLE_PERMISSIONS['Moderator']
      }
    ];
    setMembers(defaultList);
    saveMembers(defaultList);
  };

  const saveMembers = (newList: WorkspaceTeamMember[]) => {
    setMembers(newList);
    localStorage.setItem(`kava_ws_team_${wsId}`, JSON.stringify(newList));
    // Dispatch storage event so Super Admin & header sync instantly
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('kava_team_updated', { detail: { workspaceId: wsId, members: newList } }));
  };

  // Sync role defaults when invite role changes
  useEffect(() => {
    setInvitePermissions(DEFAULT_ROLE_PERMISSIONS[inviteRole]);
  }, [inviteRole]);

  // Sync role defaults when edit role changes
  useEffect(() => {
    if (editingMember) {
      setEditPermissions(DEFAULT_ROLE_PERMISSIONS[editRole]);
    }
  }, [editRole]);

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeMemberCount = members.filter(m => m.status === 'Active' || m.status === 'Pending Invitation').length;
  const isLimitReached = activeMemberCount >= maxTeamMembers;

  // Actions
  const handleOpenInviteModal = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteRole('Editor');
    setInvitePermissions(DEFAULT_ROLE_PERMISSIONS['Editor']);
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    if (isLimitReached) {
      setToast({
        title: "Subscription Limit Reached",
        description: `Your ${activePlan.name} plan allows up to ${maxTeamMembers} team members. Upgrade your plan to invite more collaborators.`,
        items: [`Current plan limit: ${maxTeamMembers} members`, `Active & Pending: ${activeMemberCount}`]
      });
      return;
    }

    const newMember: WorkspaceTeamMember = {
      id: `mbr-${Date.now()}`,
      name: inviteName.trim() || inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Pending Invitation',
      lastActivity: 'Invited just now',
      invitedAt: new Date().toISOString(),
      permissions: invitePermissions
    };

    const updated = [...members, newMember];
    saveMembers(updated);
    setIsInviteModalOpen(false);

    setToast({
      title: "Invitation Sent",
      description: `An official workspace invitation email has been dispatched to ${newMember.email}.`,
      items: [`Role assigned: ${newMember.role}`, `Status: Pending Acceptance`]
    });
  };

  const handleAcceptInviteSimulated = (memberId: string) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: 'Active' as const,
          lastActivity: 'Active now'
        };
      }
      return m;
    });
    saveMembers(updated);
    setActiveMenuId(null);

    const target = members.find(m => m.id === memberId);
    setToast({
      title: "Invitation Accepted",
      description: `${target?.name || 'Member'} has accepted the invitation and is now an Active collaborator.`,
      items: [`Role: ${target?.role}`, `Permissions synchronized`]
    });
  };

  const handleResendInvite = (member: WorkspaceTeamMember) => {
    setActiveMenuId(null);
    setToast({
      title: "Invitation Resent",
      description: `Re-sent workspace access invitation email to ${member.email}.`,
      items: [`Invited timestamp updated`, `Role: ${member.role}`]
    });
  };

  const handleToggleSuspend = (member: WorkspaceTeamMember) => {
    setActiveMenuId(null);
    const newStatus = member.status === 'Suspended' ? 'Active' : 'Suspended';
    const updated = members.map(m => {
      if (m.id === member.id) {
        return {
          ...m,
          status: newStatus as any,
          lastActivity: newStatus === 'Active' ? 'Active now' : 'Suspended'
        };
      }
      return m;
    });
    saveMembers(updated);

    setToast({
      title: newStatus === 'Suspended' ? "Member Suspended" : "Member Reactivated",
      description: `${member.name} (${member.email}) has been ${newStatus.toLowerCase()}.`,
      items: [newStatus === 'Suspended' ? "Access revoked immediately" : "Workspace access restored"]
    });
  };

  const handleSaveEditedRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const updated = members.map(m => {
      if (m.id === editingMember.id) {
        return {
          ...m,
          role: editRole,
          permissions: editPermissions
        };
      }
      return m;
    });
    saveMembers(updated);
    setEditingMember(null);

    setToast({
      title: "Role Updated",
      description: `Updated role for ${editingMember.name} to ${editRole}.`,
      items: [`Permissions synchronized across Host Dashboard & Super Admin`]
    });
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;
    const updated = members.filter(m => m.id !== memberToRemove.id);
    saveMembers(updated);
    setMemberToRemove(null);

    setToast({
      title: "Member Removed",
      description: `${memberToRemove.name} has been removed from ${currentWorkspace.name}.`,
      items: [`Seat freed for new invite`]
    });
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Workspace Owner':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Admin':
        return 'bg-slate-900 text-white border-slate-800';
      case 'Editor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderator':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Viewer':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Invitation':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'Suspended':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Workspace Team Members</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${isLimitReached ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {activeMemberCount} / {maxTeamMembers === 9999 ? 'Unlimited' : maxTeamMembers} Members
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage collaborators, assign granular role permissions, and track active team invitations.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {isLimitReached && (
            <button
              type="button"
              onClick={() => {
                if (onOpenCheckout) {
                  onOpenCheckout('Premium', `Team member limit (${maxTeamMembers}) reached on ${activePlan.name} plan. Upgrade to invite more members.`);
                } else if (setActiveTab) {
                  setActiveTab('billing');
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Upgrade Capacity</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenInviteModal}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            id="btn-invite-team-member"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Subscription Limit Warning Banner if Limit Exceeded */}
      {isLimitReached && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Team Member Subscription Capacity Limit Reached</p>
              <p className="text-[11px] text-amber-700 font-medium">
                Your workspace is utilizing all {maxTeamMembers} seats available on the {activePlan.name} plan. Upgrade to Pro Studio or Enterprise to invite additional team members.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenCheckout) {
                onOpenCheckout('Premium', 'Upgrade workspace plan to add more team seats.');
              } else if (setActiveTab) {
                setActiveTab('billing');
              }
            }}
            className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer"
          >
            Upgrade Plan Now
          </button>
        </div>
      )}

      {/* Search & Filters Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team member by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/10 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Workspace Owner">Workspace Owner</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Moderator">Moderator</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Invitation">Pending Invitation</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {(roleFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('All');
                setStatusFilter('All');
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Team Members List Table */}
      <div className="bg-white border border-slate-200/80 rounded-[32px] shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No team members match your criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting search terms or filters to find team collaborators.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Member</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Last Activity</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const isOwner = member.role === 'Workspace Owner';

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Avatar, Name, Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center uppercase shrink-0 ring-2 ring-slate-100 shadow-2xs">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              member.name.substring(0, 2)
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                              {isOwner && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold font-mono px-1.5 py-0.2 rounded-md uppercase">
                                  Owner
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-mono truncate">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadgeStyle(member.role)}`}>
                          <Shield className="w-3 h-3" />
                          <span>{member.role}</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${getStatusBadgeStyle(member.status)}`}>
                          <span>{member.status}</span>
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {member.lastActivity}
                      </td>

                      {/* Actions Menu */}
                      <td className="px-6 py-4 text-right relative">
                        {isOwner ? (
                          <span className="text-[10px] font-mono text-slate-400 font-semibold px-2 py-1">Primary Owner</span>
                        ) : (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Actions Menu"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {activeMenuId === member.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-30 space-y-0.5 text-left text-xs animate-fade-in">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setEditingMember(member);
                                    setEditRole(member.role);
                                    setEditPermissions(member.permissions || DEFAULT_ROLE_PERMISSIONS[member.role]);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit Role & Permissions</span>
                                </button>

                                {member.status === 'Pending Invitation' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleAcceptInviteSimulated(member.id)}
                                      className="w-full text-left px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
                                    >
                                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Simulate Accept Invite</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleResendInvite(member)}
                                      className="w-full text-left px-3 py-2 rounded-xl text-slate-900 hover:bg-slate-100 font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
                                    >
                                      <Send className="w-3.5 h-3.5 text-slate-800" />
                                      <span>Resend Invitation</span>
                                    </button>
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleToggleSuspend(member)}
                                  className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
                                    member.status === 'Suspended' 
                                      ? 'text-emerald-700 hover:bg-emerald-50' 
                                      : 'text-amber-700 hover:bg-amber-50'
                                  }`}
                                >
                                  {member.status === 'Suspended' ? (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Reactivate Member</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Suspend Access</span>
                                    </>
                                  )}
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setMemberToRemove(member);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Remove Member</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INVITE MEMBER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-left animate-fade-in space-y-6">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Invite Team Member</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Grant workspace access to a colleague. They will receive an email invitation to collaborate.
              </p>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-5">
              {/* Name (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Full Name (Optional)</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200/10 font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200/10 font-medium"
                  />
                </div>
              </div>

              {/* Select Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Workspace Role *</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-200/10 cursor-pointer"
                >
                  <option value="Admin">Admin (Full Workspace Management)</option>
                  <option value="Editor">Editor (Events, Studio & Content)</option>
                  <option value="Moderator">Moderator (Contributions & Guests)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                </select>
              </div>

              {/* Configurable Permissions Checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Permissions Checklist for {inviteRole}
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canManageEvents}
                      onChange={(e) => setInvitePermissions({ ...invitePermissions, canManageEvents: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Create & Manage Capsule Events</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canEditSettings}
                      onChange={(e) => setInvitePermissions({ ...invitePermissions, canEditSettings: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Edit Workspace Settings & Domain</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canManageTeam}
                      onChange={(e) => setInvitePermissions({ ...invitePermissions, canManageTeam: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Invite & Manage Team Members</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canModerate}
                      onChange={(e) => setInvitePermissions({ ...invitePermissions, canModerate: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Moderate Contributions & Guest Submissions</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canViewAnalytics}
                      onChange={(e) => setInvitePermissions({ ...invitePermissions, canViewAnalytics: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">View Analytics & Download Archives</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-left animate-fade-in space-y-6">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Edit Role: {editingMember.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Update member permissions for {editingMember.email}.
              </p>
            </div>

            <form onSubmit={handleSaveEditedRole} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Workspace Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-200/10 cursor-pointer"
                >
                  <option value="Admin">Admin (Full Workspace Management)</option>
                  <option value="Editor">Editor (Events, Studio & Content)</option>
                  <option value="Moderator">Moderator (Contributions & Guests)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                </select>
              </div>

              {/* Checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Permissions Matrix
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canManageEvents}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canManageEvents: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Create & Manage Capsule Events</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canEditSettings}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canEditSettings: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Edit Workspace Settings & Domain</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canManageTeam}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canManageTeam: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Invite & Manage Team Members</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canModerate}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canModerate: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">Moderate Contributions & Guest Submissions</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canViewAnalytics}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canViewAnalytics: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-slate-800 font-semibold">View Analytics & Download Archives</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Permission Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM REMOVE MODAL */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative text-left animate-fade-in space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Remove {memberToRemove.name}?</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                This will immediately revoke access for <span className="font-bold text-slate-800">{memberToRemove.email}</span> to all event capsules and settings in {currentWorkspace.name}.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
