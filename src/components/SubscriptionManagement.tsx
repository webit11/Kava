import { useState, useEffect } from 'react';
import { 
  Plus, Copy, Archive, Check, X, Shield, Users, RefreshCw, Undo, Save, 
  HelpCircle, DollarSign, ListOrdered, ToggleLeft, ToggleRight, Settings, 
  Search, Award, Layers, Zap, Info, ArrowUp, ArrowDown, Database, Trash2,
  Tag, Megaphone, BarChart2, Gift, Sparkles, Percent, Eye, TrendingUp, Clock, Edit3,
  FileText, Printer, Building, Receipt, Mail, CreditCard, QrCode, Building2, 
  ShieldCheck, CheckCircle2, ExternalLink, Wallet
} from 'lucide-react';
import { SubscriptionPlan, PlanAuditLog, PromotionItem, OfferPopupConfig } from '../types';
import { 
  getStoredPromotions, saveStoredPromotions, 
  getStoredOfferPopups, saveStoredOfferPopups,
  getStoredReceiptSettings, saveStoredReceiptSettings,
  getStoredInvoices, saveStoredInvoices,
  getStoredBillingLogs, addBillingLog,
  getStoredComparisonCategories, saveStoredComparisonCategories,
  ComparisonCategory, ComparisonFeature, PlanFeatureValue, DEFAULT_COMPARISON_CATEGORIES,
  SUPPORTED_CURRENCIES, DEFAULT_PLANS,
  KavaInvoice, ReceiptTemplateSettings, BillingAuditLog
} from '../lib/billing';
import ReceiptModal from './ReceiptModal';

export { DEFAULT_PLANS };

interface SubscriptionManagementProps {
  triggerToast: (title: string, desc: string, type?: 'success' | 'info' | 'error') => void;
}

export default function SubscriptionManagement({ triggerToast }: SubscriptionManagementProps) {
  // Load initial state
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('kava_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    localStorage.setItem('kava_plans', JSON.stringify(DEFAULT_PLANS));
    return DEFAULT_PLANS;
  });

  const [auditLogs, setAuditLogs] = useState<PlanAuditLog[]>(() => {
    const saved = localStorage.getItem('kava_plan_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-seed-1',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        planId: 'Free',
        planName: 'Free Starter',
        actor: 'Artha Wibawa',
        action: 'create',
        description: 'Initialized Free Starter subscription plan catalog node.'
      },
      {
        id: 'log-seed-2',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        planId: 'Premium',
        planName: 'Pro Studio',
        actor: 'Artha Wibawa',
        action: 'create',
        description: 'Initialized Pro Studio subscription plan catalog node.'
      }
    ];
  });

  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('kava_admin_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [workspaces, setWorkspaces] = useState<any[]>(() => {
    const saved = localStorage.getItem('kava_admin_workspaces');
    return saved ? JSON.parse(saved) : [];
  });

  // Active sub-tab state inside plans tab
  const [plansSubTab, setPlansSubTab] = useState<'catalog' | 'midtrans' | 'comparison' | 'promotions' | 'popups' | 'receipts' | 'assign' | 'analytics' | 'audit'>('catalog');

  // Midtrans Transactions & Webhook Inspector state
  const [midtransTransactions, setMidtransTransactions] = useState<any[]>([]);
  const [midtransConfigInfo, setMidtransConfigInfo] = useState<any>(null);
  const [midtransSearch, setMidtransSearch] = useState<string>('');
  const [midtransStatusFilter, setMidtransStatusFilter] = useState<string>('all');
  const [selectedTxnForWebhookModal, setSelectedTxnForWebhookModal] = useState<any | null>(null);

  const fetchMidtransAdminData = () => {
    fetch('/api/midtrans/transactions')
      .then(res => res.json())
      .then(data => setMidtransTransactions(data.transactions || []))
      .catch(err => console.warn('Failed to load Midtrans txns:', err));

    fetch('/api/midtrans/config')
      .then(res => res.json())
      .then(data => setMidtransConfigInfo(data))
      .catch(err => console.warn('Failed to load Midtrans config info:', err));
  };

  useEffect(() => {
    fetchMidtransAdminData();
    const interval = setInterval(fetchMidtransAdminData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Promotions & Coupon Codes state
  const [promotions, setPromotions] = useState<PromotionItem[]>(getStoredPromotions);
  const [editingPromo, setEditingPromo] = useState<PromotionItem | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);

  // Offer Popups state
  const [offerPopups, setOfferPopups] = useState<OfferPopupConfig[]>(getStoredOfferPopups);
  const [editingPopup, setEditingPopup] = useState<OfferPopupConfig | null>(null);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState<boolean>(false);

  // Receipt & Invoice Manager states
  const [receiptSettings, setReceiptSettings] = useState<ReceiptTemplateSettings>(getStoredReceiptSettings);
  const [masterInvoices, setMasterInvoices] = useState<KavaInvoice[]>(getStoredInvoices);
  const [billingLogs, setBillingLogs] = useState<BillingAuditLog[]>(getStoredBillingLogs);
  const [selectedAdminInvoice, setSelectedAdminInvoice] = useState<KavaInvoice | null>(null);
  const [isAdminReceiptModalOpen, setIsAdminReceiptModalOpen] = useState<boolean>(false);
  const [adminInvoiceSearch, setAdminInvoiceSearch] = useState<string>('');
  const [adminInvoiceStatusFilter, setAdminInvoiceStatusFilter] = useState<'all' | 'Paid' | 'Pending' | 'Failed' | 'Refunded'>('all');

  // Feature Comparison Matrix State
  const [comparisonCategories, setComparisonCategories] = useState<ComparisonCategory[]>(getStoredComparisonCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  useEffect(() => {
    const syncBillingData = () => {
      setReceiptSettings(getStoredReceiptSettings());
      setMasterInvoices(getStoredInvoices());
      setBillingLogs(getStoredBillingLogs());
    };

    window.addEventListener('storage', syncBillingData);
    window.addEventListener('kava_invoices_updated' as any, syncBillingData);
    window.addEventListener('kava_receipt_settings_updated' as any, syncBillingData);
    return () => {
      window.removeEventListener('storage', syncBillingData);
      window.removeEventListener('kava_invoices_updated' as any, syncBillingData);
      window.removeEventListener('kava_receipt_settings_updated' as any, syncBillingData);
    };
  }, []);

  // Edit states
  const [selectedPlanId, setSelectedPlanId] = useState<string>('Free');
  const [editedPlan, setEditedPlan] = useState<SubscriptionPlan | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState<boolean>(false);

  // New Custom Flag inputs
  const [newFlagKey, setNewFlagKey] = useState<string>('');
  const [newFlagVal, setNewFlagVal] = useState<boolean>(true);

  // Assignment states
  const [assignSearch, setAssignSearch] = useState<string>('');
  const [assignTargetType, setAssignTargetType] = useState<'user' | 'workspace'>('user');
  const [selectedAssignTargetId, setSelectedAssignTargetId] = useState<string | null>(null);
  const [newAssignedPlanId, setNewAssignedPlanId] = useState<string>('Premium');
  const [assignmentOverrideStorage, setAssignmentOverrideStorage] = useState<number>(0);
  const [isLifetime, setIsLifetime] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kava_plans', JSON.stringify(plans));
    // Trigger dynamic storage events so that other components re-render
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('kava_plans_updated', { detail: plans }));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('kava_plan_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Load plan when selection changes
  useEffect(() => {
    const target = plans.find(p => p.id === selectedPlanId);
    if (target) {
      setEditedPlan(JSON.parse(JSON.stringify(target))); // deep clone
      setHasChanges(false);
    }
  }, [selectedPlanId, plans]);

  // Handle plan edit change
  const handleFieldChange = (key: keyof SubscriptionPlan, value: any) => {
    if (!editedPlan) return;
    const updated = { ...editedPlan, [key]: value };
    setEditedPlan(updated);
    setHasChanges(true);
  };

  const handleNestedFieldChange = (parentKey: 'overagePolicies', childKey: string, value: any) => {
    if (!editedPlan) return;
    const updated = {
      ...editedPlan,
      [parentKey]: {
        ...editedPlan[parentKey],
        [childKey]: value
      }
    };
    setEditedPlan(updated);
    setHasChanges(true);
  };

  const handleMediaTypeToggle = (type: 'photo' | 'video' | 'voice' | 'wish') => {
    if (!editedPlan) return;
    const current = editedPlan.allowedMediaTypes || [];
    const updatedTypes = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    handleFieldChange('allowedMediaTypes', updatedTypes);
  };

  const handleFlagToggle = (flagKey: string) => {
    if (!editedPlan) return;
    const currentFlags = { ...editedPlan.featureFlags };
    currentFlags[flagKey] = !currentFlags[flagKey];
    handleFieldChange('featureFlags', currentFlags);
  };

  const handleAddFlag = () => {
    if (!editedPlan || !newFlagKey.trim()) return;
    const key = newFlagKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const currentFlags = { ...editedPlan.featureFlags };
    currentFlags[key] = newFlagVal;
    
    setEditedPlan({
      ...editedPlan,
      featureFlags: currentFlags
    });
    setNewFlagKey('');
    setHasChanges(true);
    triggerToast('Feature Flag Added', `"${key}" added as experimental toggle.`, 'info');
  };

  const handleRemoveFlag = (flagKey: string) => {
    if (!editedPlan) return;
    const currentFlags = { ...editedPlan.featureFlags };
    delete currentFlags[flagKey];
    setEditedPlan({
      ...editedPlan,
      featureFlags: currentFlags
    });
    setHasChanges(true);
  };

  // Add/Edit regional pricing
  const handleRegionalPriceChange = (currency: string, field: 'monthly' | 'yearly' | 'perEvent', value: number) => {
    if (!editedPlan) return;
    const regional = [...(editedPlan.regionalPricing || [])];
    const index = regional.findIndex(r => r.currency === currency);
    if (index > -1) {
      regional[index] = {
        ...regional[index],
        [field]: value
      };
    } else {
      regional.push({
        currency,
        monthly: field === 'monthly' ? value : 0,
        yearly: field === 'yearly' ? value : 0,
        perEvent: field === 'perEvent' ? value : 0
      });
    }
    handleFieldChange('regionalPricing', regional);
  };

  // Duplicate plan
  const handleDuplicatePlan = (sourcePlan: SubscriptionPlan) => {
    const nextOrder = Math.max(...plans.map(p => p.displayOrder), 0) + 1;
    const newId = `plan-copy-${Date.now()}`;
    const duplicated: SubscriptionPlan = {
      ...JSON.parse(JSON.stringify(sourcePlan)),
      id: newId,
      name: `${sourcePlan.name} (Copy)`,
      displayOrder: nextOrder,
      active: false,
      version: 1,
      updatedAt: new Date().toISOString()
    };

    setPlans(prev => [...prev, duplicated]);
    setSelectedPlanId(newId);

    // Audit trail
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId: newId,
      planName: duplicated.name,
      actor: 'Artha Wibawa',
      action: 'duplicate',
      description: `Duplicated subscription plan "${sourcePlan.name}" to create "${duplicated.name}".`
    };
    setAuditLogs(prev => [log, ...prev]);
    triggerToast('Plan Duplicated', `"${duplicated.name}" has been created as draft.`, 'success');
  };

  // Reorder plans
  const handleReorder = (direction: 'up' | 'down', planId: string) => {
    const sorted = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = sorted.findIndex(p => p.id === planId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = sorted[index].displayOrder;
      sorted[index].displayOrder = sorted[index - 1].displayOrder;
      sorted[index - 1].displayOrder = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].displayOrder;
      sorted[index].displayOrder = sorted[index + 1].displayOrder;
      sorted[index + 1].displayOrder = temp;
    }

    setPlans(sorted);
    
    // Audit log
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId,
      planName: plans.find(p => p.id === planId)?.name || 'Plan',
      actor: 'Artha Wibawa',
      action: 'reorder',
      description: `Reordered plan priority sequence.`
    };
    setAuditLogs(prev => [log, ...prev]);
    triggerToast('Display Sequence Adjusted', 'Subscription catalog rendering order synchronized.', 'success');
  };

  // Create empty plan
  const handleCreatePlan = () => {
    const nextOrder = Math.max(...plans.map(p => p.displayOrder), 0) + 1;
    const newId = `plan-${Date.now()}`;
    const newPlan: SubscriptionPlan = {
      id: newId,
      name: 'New Custom Tier',
      monthlyPrice: 19,
      yearlyPrice: 190,
      perEventPrice: 29,
      freeTrialDays: 7,
      storageQuotaGb: 2,
      maxEvents: 3,
      maxGuestsPerEvent: 100,
      maxUploads: 500,
      allowedMediaTypes: ['photo', 'wish'],
      
      liveScreenAvailable: true,
      invitationDesigner: false,
      guestStudioCustomization: false,
      analytics: false,
      archiveDownloads: false,
      customBranding: false,
      watermarkRemoval: false,
      frameCustomization: false,
      musicUpload: false,
      videoGreeting: false,
      qrCustomization: false,
      apiAccess: false,
      teamMembersCount: 1,
      customDomain: false,
      prioritySupport: false,
      moderationTools: false,
      aiFeatures: false,

      featureFlags: {},

      exportQuality: '1080p',
      uploadSizeLimitMb: 50,
      retentionPeriodDays: 90,
      bandwidthLimitGb: 10,
      
      overagePolicies: {
        storageOveragePricePerGb: 4,
        uploadsOveragePricePerHundred: 1.5,
        allowOverages: false
      },
      upgradePaths: ['Premium', 'Enterprise'],
      downgradeRules: 'Grace period lock after 7 days',
      gracePeriodDays: 7,
      renewalBehavior: 'auto_renew',
      couponCompatibility: true,
      regionalPricing: [
        { currency: 'USD', monthly: 19, yearly: 190, perEvent: 29 }
      ],
      active: false,
      archived: false,
      displayOrder: nextOrder,
      version: 1,
      updatedAt: new Date().toISOString()
    };

    setPlans(prev => [...prev, newPlan]);
    setSelectedPlanId(newId);

    // Audit log
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId: newId,
      planName: newPlan.name,
      actor: 'Artha Wibawa',
      action: 'create',
      description: `Created a new draft subscription plan "${newPlan.name}".`
    };
    setAuditLogs(prev => [log, ...prev]);
    triggerToast('Draft Plan Created', `Draft "${newPlan.name}" initialized. Customize features below.`, 'success');
  };

  // Archive plan
  const handleArchivePlan = (planId: string) => {
    if (planId === 'Free' || planId === 'Premium') {
      triggerToast('Action Blocked', 'Core system plans cannot be deleted or archived.', 'error');
      return;
    }
    
    if (!confirm('Are you sure you want to archive this plan? New users will not be able to subscribe.')) return;

    setPlans(prev => prev.map(p => p.id === planId ? { ...p, archived: true, active: false } : p));
    if (selectedPlanId === planId) {
      setSelectedPlanId('Free');
    }

    // Audit log
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId,
      planName: plans.find(p => p.id === planId)?.name || 'Plan',
      actor: 'Artha Wibawa',
      action: 'archive',
      description: `Archived plan sequence and locked registration.`
    };
    setAuditLogs(prev => [log, ...prev]);
    triggerToast('Plan Archived', 'Plan retracted from public catalog listing.', 'info');
  };

  // Publish / Save Plan edits
  const handlePublishChanges = () => {
    if (!editedPlan) return;

    // Validation
    if (!editedPlan.name.trim()) {
      triggerToast('Validation Error', 'Plan Name is required.', 'error');
      return;
    }

    const previous = plans.find(p => p.id === editedPlan.id);
    const updatedPlans = plans.map(p => {
      if (p.id === editedPlan.id) {
        return {
          ...editedPlan,
          version: (p.version || 1) + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    setPlans(updatedPlans);
    setHasChanges(false);
    setShowConfirmPublish(false);

    // Audit log with previous state for rollback support!
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId: editedPlan.id,
      planName: editedPlan.name,
      actor: 'Artha Wibawa',
      action: 'update',
      description: `Published changes to "${editedPlan.name}" (v${(previous?.version || 1) + 1}).`,
      changeSummary: `Price: $${editedPlan.monthlyPrice}/mo, Storage: ${editedPlan.storageQuotaGb}GB, AI features: ${editedPlan.aiFeatures ? 'ON' : 'OFF'}`,
      previousState: JSON.stringify(previous)
    };
    setAuditLogs(prev => [log, ...prev]);

    // Force real-time synchronization in workspaces/users using the active plan
    // If we changed limits, we also update workspaces that are mapped to this plan
    const updatedWorkspaces = workspaces.map((ws: any) => {
      if (ws.plan === editedPlan.id || ws.plan === editedPlan.name) {
        return {
          ...ws,
          maxStorageMB: editedPlan.storageQuotaGb * 1024
        };
      }
      return ws;
    });
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem('kava_admin_workspaces', JSON.stringify(updatedWorkspaces));

    triggerToast('Changes Published Successfully', `Plan permissions synced across ${updatedWorkspaces.filter(w => w.plan === editedPlan.id).length} live workspaces.`, 'success');
  };

  // Rollback to previous state
  const handleRollback = (log: PlanAuditLog) => {
    if (!log.previousState) {
      triggerToast('Rollback Unavailable', 'No prior state snapshot recorded for this transaction.', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to rollback "${log.planName}" to its state prior to this action?`)) return;

    try {
      const restored = JSON.parse(log.previousState);
      setPlans(prev => prev.map(p => p.id === restored.id ? restored : p));
      setSelectedPlanId(restored.id);

      // Create new audit trail for rollback
      const newLog: PlanAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        planId: restored.id,
        planName: restored.name,
        actor: 'Artha Wibawa',
        action: 'rollback',
        description: `Executed system rollback on "${restored.name}" restoring v${restored.version}.`
      };
      setAuditLogs(prev => [newLog, ...prev]);
      triggerToast('Rollback Successful', `"${restored.name}" reverted and synchronized.`, 'success');
    } catch (err) {
      triggerToast('Rollback Failed', 'Deserialization matrix corruption.', 'error');
    }
  };

  // Discard edits
  const handleDiscardChanges = () => {
    const target = plans.find(p => p.id === selectedPlanId);
    if (target) {
      setEditedPlan(JSON.parse(JSON.stringify(target)));
      setHasChanges(false);
      triggerToast('Edits Discarded', 'Reverted modifications back to active configuration.', 'info');
    }
  };

  // Manual Assignment
  const handleAssignPlan = () => {
    if (!selectedAssignTargetId) {
      triggerToast('No Selection', 'Please select a host or workspace first.', 'error');
      return;
    }

    const planObj = plans.find(p => p.id === newAssignedPlanId);
    if (!planObj) return;

    if (assignTargetType === 'user') {
      const updatedUsers = users.map((u: any) => {
        if (u.id === selectedAssignTargetId || u.email === selectedAssignTargetId) {
          return {
            ...u,
            plan: planObj.id,
            isLifetime: isLifetime,
            customStorageGb: assignmentOverrideStorage > 0 ? assignmentOverrideStorage : undefined
          };
        }
        return u;
      });
      setUsers(updatedUsers);
      localStorage.setItem('kava_admin_users', JSON.stringify(updatedUsers));

      // Also auto-sync associated workspaces
      const matchedUser = users.find((u: any) => u.id === selectedAssignTargetId || u.email === selectedAssignTargetId);
      if (matchedUser) {
        const updatedWorkspaces = workspaces.map((ws: any) => {
          if (ws.host === matchedUser.name) {
            return {
              ...ws,
              plan: planObj.id,
              maxStorageMB: (assignmentOverrideStorage > 0 ? assignmentOverrideStorage : planObj.storageQuotaGb) * 1024
            };
          }
          return ws;
        });
        setWorkspaces(updatedWorkspaces);
        localStorage.setItem('kava_admin_workspaces', JSON.stringify(updatedWorkspaces));
      }

      triggerToast('User Plan Updated', `Assigned "${planObj.name}" to ${matchedUser?.name || 'user'}.`, 'success');
    } else {
      // Workspace assignment
      const updatedWorkspaces = workspaces.map((ws: any) => {
        if (ws.id === selectedAssignTargetId) {
          return {
            ...ws,
            plan: planObj.id,
            maxStorageMB: (assignmentOverrideStorage > 0 ? assignmentOverrideStorage : planObj.storageQuotaGb) * 1024,
            isLifetime: isLifetime
          };
        }
        return ws;
      });
      setWorkspaces(updatedWorkspaces);
      localStorage.setItem('kava_admin_workspaces', JSON.stringify(updatedWorkspaces));

      const matchedWs = workspaces.find((w: any) => w.id === selectedAssignTargetId);
      triggerToast('Workspace Plan Updated', `Workspace "${matchedWs?.name}" updated to "${planObj.name}".`, 'success');
    }

    // Append manual assignment audit log
    const log: PlanAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      planId: planObj.id,
      planName: planObj.name,
      actor: 'Artha Wibawa',
      action: 'manually_assigned',
      description: `Manually assigned ${planObj.name} to ${assignTargetType} (${selectedAssignTargetId}). Override Storage: ${assignmentOverrideStorage}GB, Lifetime: ${isLifetime ? 'YES' : 'NO'}.`
    };
    setAuditLogs(prev => [log, ...prev]);

    // Reset selection
    setSelectedAssignTargetId(null);
  };

  // Filter lists
  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(assignSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const filteredWorkspaces = workspaces.filter((ws: any) => 
    ws.name.toLowerCase().includes(assignSearch.toLowerCase()) || 
    ws.host.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const activePlans = plans.filter(p => !p.archived);

  return (
    <div className="space-y-6 text-left">
      {/* Header card */}
      <div className="bg-slate-900 text-white rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase tracking-wider">Live Config Engine</span>
          <h2 className="text-xl font-black mt-2">Subscription & Feature Matrix Management</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Fully dynamic monetization cockpit. Define pricing, enforce storage/event rate-limits, configure feature-flag toggles, and override subscriber plans in real-time.
          </p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={handleCreatePlan}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'catalog', label: 'Plan Configurator', icon: Settings },
          { id: 'midtrans', label: 'Midtrans Webhook & Txns', icon: ShieldCheck },
          { id: 'comparison', label: 'Live Comparison Preview', icon: Layers },
          { id: 'promotions', label: 'Promotions Manager', icon: Tag },
          { id: 'popups', label: 'Offer Pop-up Builder', icon: Megaphone },
          { id: 'receipts', label: 'Receipt & Invoice Manager', icon: FileText },
          { id: 'assign', label: 'Plan Assignment & Overrides', icon: Users },
          { id: 'analytics', label: 'Billing Analytics', icon: BarChart2 },
          { id: 'audit', label: 'Audit Trail & Version Control', icon: Undo }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              if (hasChanges) {
                if (!confirm('You have unsaved plan edits. Switching sections will discard unsaved changes. Proceed?')) return;
                setHasChanges(false);
              }
              setPlansSubTab(t.id as any);
            }}
            className={`px-5 py-3.5 border-b-2 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
              plansSubTab === t.id 
                ? 'border-slate-700 text-slate-900 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Unsaved changes top notification bar */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <p className="text-xs font-bold text-amber-800">
              Unsaved Changes: You are currently customizing "{editedPlan?.name}". Changes are not synced until you publish.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDiscardChanges}
              className="px-3 py-1.5 border border-amber-300 rounded-xl text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Discard Edits
            </button>
            <button
              onClick={() => setShowConfirmPublish(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 rounded-xl text-[10px] font-bold text-white flex items-center space-x-1 transition-all cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: PLAN CONFIGURATOR CATALOG */}
      {plansSubTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Plan catalog left rail (column span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Plan Catalog Drafts</h3>
              <p className="text-[10px] text-slate-400 font-medium">Reorder displaying prioritization or duplicate core tiers.</p>
              
              <div className="divide-y divide-slate-100">
                {[...plans].sort((a, b) => a.displayOrder - b.displayOrder).map((plan, idx) => (
                  <div 
                    key={plan.id}
                    className={`py-3 flex items-center justify-between group transition-all rounded-lg px-2 -mx-2 ${
                      selectedPlanId === plan.id ? 'bg-slate-100 border border-slate-300 shadow-xs' : ''
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (hasChanges) {
                          if (!confirm(`Switching to "${plan.name}" will discard unsaved edits on "${editedPlan?.name}". Continue?`)) return;
                        }
                        setSelectedPlanId(plan.id);
                      }}
                      className="text-left flex-1 cursor-pointer min-w-0 pr-2"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-extrabold text-slate-900 truncate block">{plan.name}</span>
                        {plan.archived && (
                          <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">Archived</span>
                        )}
                        {!plan.active && !plan.archived && (
                          <span className="bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">Draft</span>
                        )}
                        {plan.active && !plan.archived && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">Active</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">${plan.monthlyPrice}/mo • {plan.storageQuotaGb}GB</span>
                    </button>
                    
                    {/* Action buttons on hover */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleReorder('up', plan.id)}
                        disabled={idx === 0}
                        className="p-1 border border-slate-100 rounded hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleReorder('down', plan.id)}
                        disabled={idx === plans.length - 1}
                        className="p-1 border border-slate-100 rounded hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDuplicatePlan(plan)}
                        className="p-1 border border-slate-100 rounded hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                        title="Duplicate Plan"
                      >
                        <Copy className="w-3 h-3 text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleArchivePlan(plan.id)}
                        disabled={plan.archived}
                        className="p-1 border border-slate-100 rounded hover:border-red-200 hover:bg-red-50 disabled:opacity-30 cursor-pointer"
                        title="Archive Plan"
                      >
                        <Archive className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Matrix Right Board (column span 8) */}
          <div className="lg:col-span-8">
            {editedPlan ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Editing Resource Matrix v{editedPlan.version || 1}</span>
                    <h4 className="text-sm font-black text-slate-900 mt-1">{editedPlan.name} (id: <code className="font-mono text-slate-900">{editedPlan.id}</code>)</h4>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-600">Active Listing:</label>
                    <button
                      onClick={() => handleFieldChange('active', !editedPlan.active)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        editedPlan.active ? 'bg-slate-950' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        editedPlan.active ? 'translate-x-5.5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Section A: Name & Pricing */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Plan Core & Pricing</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name</label>
                        <input
                          type="text"
                          value={editedPlan.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Cost ($)</label>
                        <input
                          type="number"
                          value={editedPlan.monthlyPrice}
                          onChange={(e) => handleFieldChange('monthlyPrice', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Yearly Cost ($)</label>
                        <input
                          type="number"
                          value={editedPlan.yearlyPrice}
                          onChange={(e) => handleFieldChange('yearlyPrice', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Per Event Cost ($)</label>
                        <input
                          type="number"
                          value={editedPlan.perEventPrice}
                          onChange={(e) => handleFieldChange('perEventPrice', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Free Trial Days</label>
                        <input
                          type="number"
                          value={editedPlan.freeTrialDays}
                          onChange={(e) => handleFieldChange('freeTrialDays', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Grace Period (Days)</label>
                        <input
                          type="number"
                          value={editedPlan.gracePeriodDays}
                          onChange={(e) => handleFieldChange('gracePeriodDays', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Renewal Cycle Mode</label>
                        <select
                          value={editedPlan.renewalBehavior}
                          onChange={(e) => handleFieldChange('renewalBehavior', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-slate-400"
                        >
                          <option value="auto_renew">Auto Renew (Stripe Recur)</option>
                          <option value="expire">Expire & Freeze</option>
                          <option value="invoice">Postpaid Invoice Billing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Hard Resource Quotas */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Hard Quotas & Constraints</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Storage Quota (GB)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editedPlan.storageQuotaGb}
                          onChange={(e) => handleFieldChange('storageQuotaGb', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Max Event Capsules</label>
                        <input
                          type="number"
                          value={editedPlan.maxEvents}
                          onChange={(e) => handleFieldChange('maxEvents', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Max Guests per Event</label>
                        <input
                          type="number"
                          value={editedPlan.maxGuestsPerEvent}
                          onChange={(e) => handleFieldChange('maxGuestsPerEvent', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Max Upload Assets</label>
                        <input
                          type="number"
                          value={editedPlan.maxUploads}
                          onChange={(e) => handleFieldChange('maxUploads', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Single Upload limit (MB)</label>
                        <input
                          type="number"
                          value={editedPlan.uploadSizeLimitMb}
                          onChange={(e) => handleFieldChange('uploadSizeLimitMb', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Bandwidth Limit (GB/mo)</label>
                        <input
                          type="number"
                          value={editedPlan.bandwidthLimitGb}
                          onChange={(e) => handleFieldChange('bandwidthLimitGb', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Media Retention (Days)</label>
                        <input
                          type="number"
                          value={editedPlan.retentionPeriodDays}
                          onChange={(e) => handleFieldChange('retentionPeriodDays', parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-slate-400"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">-1 represents lifetime vaulting</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Export Resolution</label>
                        <select
                          value={editedPlan.exportQuality}
                          onChange={(e) => handleFieldChange('exportQuality', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-slate-400"
                        >
                          <option value="720p">720p High Def compressed</option>
                          <option value="1080p">1080p Premium raw</option>
                          <option value="4K raw">4K Ultra pristine raw archive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Overage Policies & Upgrades */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Overage Policies & Upgrade Paths</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Allow Overages</label>
                        <select
                          value={editedPlan.overagePolicies.allowOverages ? 'true' : 'false'}
                          onChange={(e) => handleNestedFieldChange('overagePolicies', 'allowOverages', e.target.value === 'true')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                        >
                          <option value="true">Enable Soft limits with pay-as-you-go</option>
                          <option value="false">Hard cap strict restrictions</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Storage Overage ($/GB)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editedPlan.overagePolicies.storageOveragePricePerGb}
                          onChange={(e) => handleNestedFieldChange('overagePolicies', 'storageOveragePricePerGb', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Upload Overage ($/100 assets)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editedPlan.overagePolicies.uploadsOveragePricePerHundred}
                          onChange={(e) => handleNestedFieldChange('overagePolicies', 'uploadsOveragePricePerHundred', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Allowed Media Upload Formats</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(['photo', 'video', 'voice', 'wish'] as const).map(type => {
                            const isSelected = editedPlan.allowedMediaTypes?.includes(type);
                            return (
                              <button
                                key={type}
                                onClick={() => handleMediaTypeToggle(type)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'bg-slate-950 border-slate-950 text-white shadow-sm' 
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Downgrade Auto-enforcement Action</label>
                        <input
                          type="text"
                          value={editedPlan.downgradeRules || ''}
                          onChange={(e) => handleFieldChange('downgradeRules', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          placeholder="e.g. Pause guest uploads"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section D: Feature Toggles Board (Matrix) */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Dedicated Feature Matrix</h5>
                    <p className="text-[10px] text-slate-400">Toggle capabilities on/off to package distinct premium product lines.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'liveScreenAvailable', label: 'Live Presentation Projector Wall', desc: 'Realtime projector stream overlays' },
                        { key: 'invitationDesigner', label: 'Invitation Designer Studio', desc: 'Custom QR invitation cards & prints' },
                        { key: 'guestStudioCustomization', label: 'Guest Room Customization', desc: 'CSS layouts & greeting headers' },
                        { key: 'analytics', label: 'Host Analytics Desk', desc: 'SaaS metrics, geolocation data tracking' },
                        { key: 'archiveDownloads', label: 'High Fidelity Raw Zip Downloads', desc: 'Raw, uncompressed asset archives' },
                        { key: 'customBranding', label: 'Custom Domain & Logo Branding', desc: 'Rebrand footers and page layouts' },
                        { key: 'watermarkRemoval', label: 'Watermark-free Frame Renders', desc: 'Eliminate official KAVA system credit' },
                        { key: 'frameCustomization', label: 'Custom Frame Designer', desc: 'Overlay PNG layers on raw guest photos' },
                        { key: 'musicUpload', label: 'Official Slideshow Background Music', desc: 'Allows custom MP3 BGM triggers' },
                        { key: 'videoGreeting', label: 'Video Guestbook & Playbacks', desc: 'Record/Upload raw guest video clips' },
                        { key: 'qrCustomization', label: 'Vector QR Placement Engine', desc: 'Reframe qr sizing and alignments' },
                        { key: 'apiAccess', label: 'Developer Webhooks & API rate-passes', desc: 'Sync contributions to external hooks' },
                        { key: 'customDomain', label: 'Fully Custom CNAME Mapping', desc: 'Mask host url with personal domain' },
                        { key: 'prioritySupport', label: 'Priority SLA Concierge', desc: 'Assigned immediately to Sarah Connor' },
                        { key: 'moderationTools', label: 'Advanced Live Queue Filters', desc: 'Manual host approvals, censor guards' },
                        { key: 'aiFeatures', label: 'Gemini AI Vision & Categorizations', desc: 'Automated transcription, smart tags' },
                      ].map((item) => {
                        const val = (editedPlan as any)[item.key];
                        return (
                          <div key={item.key} className="flex items-start space-x-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <button
                              onClick={() => handleFieldChange(item.key as any, !val)}
                              className="shrink-0 mt-0.5 cursor-pointer text-slate-900"
                            >
                              {val ? (
                                <ToggleRight className="w-9 h-6 text-slate-950" />
                              ) : (
                                <ToggleLeft className="w-9 h-6 text-slate-400" />
                              )}
                            </button>
                            <div className="text-left">
                              <p className="text-[11px] font-bold text-slate-900 leading-tight">{item.label}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Team members count */}
                      <div className="flex flex-col justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="text-left mb-1">
                          <p className="text-[11px] font-bold text-slate-900">Allowed Team Seats</p>
                          <p className="text-[9px] text-slate-400 leading-tight">Collaborators on workspace admin</p>
                        </div>
                        <input
                          type="number"
                          value={editedPlan.teamMembersCount}
                          onChange={(e) => handleFieldChange('teamMembersCount', parseInt(e.target.value) || 1)}
                          className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section E: Dynamic Feature Flags for the Future */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Custom Experimental Feature Flags</h5>
                    <p className="text-[10px] text-slate-400">Add arbitrary custom flags to build next-generation features on the fly. Key-value state is fully synchronized.</p>
                    
                    <div className="space-y-2">
                      {Object.entries(editedPlan.featureFlags || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between bg-slate-50 p-2 px-3 rounded-xl border border-slate-200 text-xs font-mono font-semibold">
                          <div className="flex items-center space-x-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                            <span className="text-slate-800">{key}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleFlagToggle(key)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                            >
                              {val ? 'ENABLED' : 'DISABLED'}
                            </button>
                            <button
                              onClick={() => handleRemoveFlag(key)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Custom Flag Form */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          value={newFlagKey}
                          onChange={(e) => setNewFlagKey(e.target.value)}
                          placeholder="e.g. live-chat-wall"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono flex-1 focus:outline-none"
                        />
                        <select
                          value={newFlagVal ? 'true' : 'false'}
                          onChange={(e) => setNewFlagVal(e.target.value === 'true')}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold"
                        >
                          <option value="true">ON</option>
                          <option value="false">OFF</option>
                        </select>
                        <button
                          onClick={handleAddFlag}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                        >
                          Add Toggle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section F: Regional Pricing Conversions */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Multi-Currency & Regional Pricing Overrides</h5>
                    <div className="space-y-2">
                      {SUPPORTED_CURRENCIES.map((curr) => {
                        const target = (editedPlan.regionalPricing || []).find(r => r.currency === curr.code) || { monthly: 0, yearly: 0, perEvent: 0 };
                        const paddingLeftClass = curr.symbol.length >= 3 ? 'pl-11' : curr.symbol.length === 2 ? 'pl-9' : 'pl-6';
                        return (
                          <div key={curr.code} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 font-mono">{curr.code} ({curr.symbol})</span>
                              <span className="text-[10px] text-slate-400 font-medium">{curr.name}</span>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Monthly Price</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-mono font-bold">{curr.symbol}</span>
                                <input
                                  type="number"
                                  value={target.monthly}
                                  onChange={(e) => handleRegionalPriceChange(curr.code, 'monthly', parseFloat(e.target.value) || 0)}
                                  className={`w-full bg-white border border-slate-200 rounded-lg ${paddingLeftClass} pr-2 py-1 text-xs font-mono font-bold text-slate-900`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Yearly Price</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-mono font-bold">{curr.symbol}</span>
                                <input
                                  type="number"
                                  value={target.yearly}
                                  onChange={(e) => handleRegionalPriceChange(curr.code, 'yearly', parseFloat(e.target.value) || 0)}
                                  className={`w-full bg-white border border-slate-200 rounded-lg ${paddingLeftClass} pr-2 py-1 text-xs font-mono font-bold text-slate-900`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Per Event Price</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-mono font-bold">{curr.symbol}</span>
                                <input
                                  type="number"
                                  value={target.perEvent}
                                  onChange={(e) => handleRegionalPriceChange(curr.code, 'perEvent', parseFloat(e.target.value) || 0)}
                                  className={`w-full bg-white border border-slate-200 rounded-lg ${paddingLeftClass} pr-2 py-1 text-xs font-mono font-bold text-slate-900`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold font-mono">Last updated: {new Date(editedPlan.updatedAt).toLocaleString()}</span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDiscardChanges}
                      disabled={!hasChanges}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => setShowConfirmPublish(true)}
                      disabled={!hasChanges}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black disabled:opacity-40 transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publish Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center text-slate-400 shadow-sm">
                <Settings className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-spin-slow" />
                <h4 className="text-sm font-bold text-slate-900">Select Plan Tier to Begin Editing</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">Choose a subscription catalog node to override dynamic values in real-time.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB MIDTRANS: REAL-TIME PAYMENT GATEWAY & WEBHOOK MONITOR */}
      {plansSubTab === 'midtrans' && (
        <div className="space-y-6">
          {/* Header Status Bar */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                    {midtransConfigInfo?.isProduction ? 'PRODUCTION MODE' : 'SANDBOX SIMULATOR'}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
                    CLIENT KEY: {midtransConfigInfo?.clientKey ? `${midtransConfigInfo.clientKey.slice(0, 12)}...` : 'SB-Mid-client'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">Midtrans Payment Engine & Webhook Real-Time Center</h3>
                <p className="text-xs text-slate-300">
                  Single source of truth for Indonesian Virtual Accounts (BCA, Mandiri, BNI, BRI, Permata), QRIS, E-Wallets, and Credit Cards.
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={fetchMidtransAdminData}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sync Transactions</span>
                </button>
              </div>
            </div>

            {/* Config metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Midtrans Orders</span>
                <span className="text-xl font-black text-white font-mono">{midtransTransactions.length}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Settled Payments</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {midtransTransactions.filter(t => t.transactionStatus === 'settlement' || t.transactionStatus === 'capture').length}
                </span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Pending VA / QRIS</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {midtransTransactions.filter(t => t.transactionStatus === 'pending').length}
                </span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Webhook Endpoint</span>
                <span className="text-[11px] font-mono text-slate-300 truncate block">/api/midtrans/notification</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={midtransSearch}
                onChange={(e) => setMidtransSearch(e.target.value)}
                placeholder="Search by Order ID, customer email, or payment method..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={midtransStatusFilter}
                onChange={(e) => setMidtransStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="settlement">Settlement (Paid)</option>
                <option value="pending">Pending</option>
                <option value="expire">Expired</option>
                <option value="cancel">Cancelled / Failed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer & Plan</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status & Signature</th>
                    <th className="p-4 text-right">Webhook Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {midtransTransactions
                    .filter(t => {
                      if (midtransStatusFilter !== 'all' && t.transactionStatus !== midtransStatusFilter) return false;
                      if (!midtransSearch.trim()) return true;
                      const q = midtransSearch.toLowerCase();
                      return (
                        (t.orderId && t.orderId.toLowerCase().includes(q)) ||
                        (t.customerEmail && t.customerEmail.toLowerCase().includes(q)) ||
                        (t.paymentType && t.paymentType.toLowerCase().includes(q))
                      );
                    })
                    .map((t) => {
                      const isSettled = t.transactionStatus === 'settlement' || t.transactionStatus === 'capture';
                      const isPending = t.transactionStatus === 'pending';
                      
                      return (
                        <tr key={t.orderId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-900 block">{t.orderId}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(t.createdAt).toLocaleString()}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-900 block">{t.customerName || 'KAVA Host'}</span>
                            <span className="text-[11px] text-slate-500">{t.customerEmail}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold inline-block mt-0.5">
                              {t.planName} ({t.billingCycle})
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-800 uppercase font-mono block">
                              {t.paymentType}
                            </span>
                            {t.vaNumber && (
                              <span className="text-[10px] text-slate-500 font-mono block">
                                VA: {t.vaNumber}
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="font-mono font-extrabold text-slate-900 block">
                              Rp {(t.grossAmountIdr || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              (${t.grossAmount})
                            </span>
                          </td>

                          <td className="p-4 space-y-1">
                            {isSettled ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>SETTLED (ACTIVE)</span>
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3 text-amber-600 animate-spin-slow" />
                                <span>PENDING</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                                <X className="w-3 h-3 text-rose-600" />
                                <span className="uppercase">{t.transactionStatus}</span>
                              </span>
                            )}

                            {t.signatureKeyVerified && (
                              <span className="text-[9px] text-slate-500 font-mono block">
                                ✓ SHA512 Verified
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedTxnForWebhookModal(t)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                            >
                              Inspect Payload
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  {midtransTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                        No Midtrans transactions recorded yet. Initiate a plan upgrade from the customer checkout frame to generate real transactions!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspect Webhook Modal */}
          {selectedTxnForWebhookModal && (
            <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-black font-mono text-amber-400">
                    Webhook Payload — {selectedTxnForWebhookModal.orderId}
                  </h4>
                  <button 
                    onClick={() => setSelectedTxnForWebhookModal(null)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 border border-slate-800">
                  {JSON.stringify(selectedTxnForWebhookModal.rawPayload || selectedTxnForWebhookModal, null, 2)}
                </pre>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                  <span>Signature Key Verified: {selectedTxnForWebhookModal.signatureKeyVerified ? 'TRUE' : 'FALSE'}</span>
                  <button
                    onClick={() => setSelectedTxnForWebhookModal(null)}
                    className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: DETAILED FEATURE COMPARISON MANAGEMENT MATRIX */}
      {plansSubTab === 'comparison' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8 overflow-hidden">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-black text-slate-900">Superadmin Feature Comparison Configurator</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure categories, features, visibility, and plan specific values for the public Pricing Page comparison table.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset feature comparison matrix to system default categories and features?')) {
                    setComparisonCategories(DEFAULT_COMPARISON_CATEGORIES);
                    saveStoredComparisonCategories(DEFAULT_COMPARISON_CATEGORIES);
                    addBillingLog({
                      action: 'Reset Comparison Matrix',
                      adminEmail: 'superadmin@kava.app',
                      workspaceName: 'System Core',
                      details: 'Comparison matrix restored to default categories.',
                      status: 'Success'
                    });
                    triggerToast('Comparison Reset', 'Restored default comparison matrix.', 'info');
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const catName = prompt('Enter new category name (e.g. "Storage & Media", "Security"):');
                  if (!catName || !catName.trim()) return;
                  const newCat: ComparisonCategory = {
                    id: `cat-${Date.now()}`,
                    name: catName.trim(),
                    description: 'Custom category configured in Superadmin.',
                    displayOrder: comparisonCategories.length + 1,
                    features: []
                  };
                  const updated = [...comparisonCategories, newCat];
                  setComparisonCategories(updated);
                  saveStoredComparisonCategories(updated);
                  triggerToast('Category Added', `Added "${catName.trim()}" category.`, 'success');
                }}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Category List & Feature Editor */}
          <div className="space-y-6">
            {comparisonCategories.map((cat, catIdx) => (
              <div key={cat.id} className="border border-slate-200/90 rounded-2xl bg-slate-50/50 p-5 space-y-4">
                
                {/* Category Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-2xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{catIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-950">{cat.name}</h4>
                      {cat.description && <p className="text-[11px] text-slate-400 font-medium">{cat.description}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Move Up/Down */}
                    <button
                      type="button"
                      disabled={catIdx === 0}
                      onClick={() => {
                        const updated = [...comparisonCategories];
                        const temp = updated[catIdx];
                        updated[catIdx] = updated[catIdx - 1];
                        updated[catIdx - 1] = temp;
                        setComparisonCategories(updated);
                        saveStoredComparisonCategories(updated);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Category Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={catIdx === comparisonCategories.length - 1}
                      onClick={() => {
                        const updated = [...comparisonCategories];
                        const temp = updated[catIdx];
                        updated[catIdx] = updated[catIdx + 1];
                        updated[catIdx + 1] = temp;
                        setComparisonCategories(updated);
                        saveStoredComparisonCategories(updated);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Category Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const featName = prompt(`Add new feature to "${cat.name}":`);
                        if (!featName || !featName.trim()) return;
                        
                        const newFeat: ComparisonFeature = {
                          id: `feat-${Date.now()}`,
                          name: featName.trim(),
                          description: 'Configured in Superadmin.',
                          visibleOnPublicTable: true,
                          displayOrder: (cat.features?.length || 0) + 1,
                          planValues: {
                            'Free': { status: 'not_available', value: 'Not Included' },
                            'Premium': { status: 'included', value: 'Included' },
                            'Enterprise': { status: 'unlimited', value: 'Unlimited' }
                          }
                        };

                        const updated = comparisonCategories.map(c => {
                          if (c.id === cat.id) {
                            return { ...c, features: [...(c.features || []), newFeat] };
                          }
                          return c;
                        });
                        setComparisonCategories(updated);
                        saveStoredComparisonCategories(updated);
                        triggerToast('Feature Added', `Added feature "${featName.trim()}".`, 'success');
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Add Feature</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}" and all its features?`)) {
                          const updated = comparisonCategories.filter(c => c.id !== cat.id);
                          setComparisonCategories(updated);
                          saveStoredComparisonCategories(updated);
                          triggerToast('Category Removed', `Deleted category "${cat.name}".`, 'info');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Features Table for Category */}
                <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase">
                        <th className="py-2.5 px-3">Feature Name</th>
                        <th className="py-2.5 px-3 text-center">Public Visibility</th>
                        {activePlans.map(p => (
                          <th key={p.id} className="py-2.5 px-3 text-center font-bold text-slate-900">{p.name} Value</th>
                        ))}
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cat.features?.map((feat, fIdx) => (
                        <tr key={feat.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-semibold text-slate-800 max-w-[200px]">
                            <input
                              type="text"
                              value={feat.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                const updated = comparisonCategories.map(c => {
                                  if (c.id === cat.id) {
                                    return {
                                      ...c,
                                      features: c.features.map(f => f.id === feat.id ? { ...f, name: newName } : f)
                                    };
                                  }
                                  return c;
                                });
                                setComparisonCategories(updated);
                                saveStoredComparisonCategories(updated);
                              }}
                              className="w-full px-2 py-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
                            />
                          </td>

                          {/* Public Visibility Toggle */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = comparisonCategories.map(c => {
                                  if (c.id === cat.id) {
                                    return {
                                      ...c,
                                      features: c.features.map(f => f.id === feat.id ? { ...f, visibleOnPublicTable: !f.visibleOnPublicTable } : f)
                                    };
                                  }
                                  return c;
                                });
                                setComparisonCategories(updated);
                                saveStoredComparisonCategories(updated);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                                feat.visibleOnPublicTable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {feat.visibleOnPublicTable ? 'VISIBLE' : 'HIDDEN'}
                            </button>
                          </td>

                          {/* Plan Values */}
                          {activePlans.map(p => {
                            const valObj = feat.planValues?.[p.id] || feat.planValues?.[p.name] || { status: 'not_available', value: '' };

                            return (
                              <td key={p.id} className="py-3 px-3 text-center min-w-[130px]">
                                <div className="space-y-1">
                                  <select
                                    value={valObj.status}
                                    onChange={(e) => {
                                      const newStatus = e.target.value as any;
                                      const updated = comparisonCategories.map(c => {
                                        if (c.id === cat.id) {
                                          return {
                                            ...c,
                                            features: c.features.map(f => {
                                              if (f.id === feat.id) {
                                                const currentVals = { ...(f.planValues || {}) };
                                                currentVals[p.id] = { ...valObj, status: newStatus };
                                                currentVals[p.name] = { ...valObj, status: newStatus };
                                                return { ...f, planValues: currentVals };
                                              }
                                              return f;
                                            })
                                          };
                                        }
                                        return c;
                                      });
                                      setComparisonCategories(updated);
                                      saveStoredComparisonCategories(updated);
                                    }}
                                    className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-1 w-full text-slate-800"
                                  >
                                    <option value="included">Included (Check)</option>
                                    <option value="unlimited">Unlimited (Badge)</option>
                                    <option value="custom">Custom Text</option>
                                    <option value="not_available">Not Available (Cross)</option>
                                  </select>

                                  <input
                                    type="text"
                                    placeholder="Label / Value..."
                                    value={valObj.value || ''}
                                    onChange={(e) => {
                                      const newVal = e.target.value;
                                      const updated = comparisonCategories.map(c => {
                                        if (c.id === cat.id) {
                                          return {
                                            ...c,
                                            features: c.features.map(f => {
                                              if (f.id === feat.id) {
                                                const currentVals = { ...(f.planValues || {}) };
                                                currentVals[p.id] = { ...valObj, value: newVal };
                                                currentVals[p.name] = { ...valObj, value: newVal };
                                                return { ...f, planValues: currentVals };
                                              }
                                              return f;
                                            })
                                          };
                                        }
                                        return c;
                                      });
                                      setComparisonCategories(updated);
                                      saveStoredComparisonCategories(updated);
                                    }}
                                    className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full text-slate-900"
                                  />
                                </div>
                              </td>
                            );
                          })}

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = comparisonCategories.map(c => {
                                  if (c.id === cat.id) {
                                    return { ...c, features: c.features.filter(f => f.id !== feat.id) };
                                  }
                                  return c;
                                });
                                setComparisonCategories(updated);
                                saveStoredComparisonCategories(updated);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete feature"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {(!cat.features || cat.features.length === 0) && (
                        <tr>
                          <td colSpan={activePlans.length + 3} className="py-4 text-center text-xs text-slate-400 italic">
                            No features in this category yet. Click "Add Feature" above to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB: PROMOTIONAL CAMPAIGNS MANAGER */}
      {plansSubTab === 'promotions' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Tag className="w-4 h-4 text-slate-900" />
                <span>Promotions & Coupon Manager</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure discount coupons, seasonal sales, welcome offers, and referral rewards that dynamically update Landing Page and Checkout.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPromo({
                  id: `promo-${Date.now()}`,
                  name: 'New Promotion Campaign',
                  code: 'PROMO' + Math.floor(100 + Math.random() * 900),
                  type: 'welcome',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  targetPlans: ['all'],
                  discountType: 'percentage',
                  discountValue: 20,
                  usageLimit: 100,
                  usedCount: 0,
                  ctaText: 'Claim Special Discount',
                  landingVisibility: true,
                  dashboardVisibility: true,
                  active: true,
                  badgeLabel: 'SPECIAL OFFER'
                });
                setIsPromoModalOpen(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          {/* Promotions list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {promo.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        const updated = promotions.map(p => p.id === promo.id ? { ...p, active: !p.active } : p);
                        setPromotions(updated);
                        saveStoredPromotions(updated);
                        triggerToast('Status Toggled', `"${promo.name}" is now ${!promo.active ? 'Active' : 'Inactive'}.`, 'info');
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono cursor-pointer ${
                        promo.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {promo.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">{promo.name}</h4>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                    <span className="font-black text-slate-900 tracking-wider">{promo.code}</span>
                    <span className="text-slate-700 font-bold">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 font-medium pt-1">
                    <p>• Applies To: <span className="font-bold text-slate-800">{promo.targetPlans.join(', ')}</span></p>
                    <p>• Usage: <span className="font-bold text-slate-800">{promo.usedCount} / {promo.usageLimit}</span> redemptions</p>
                    <p>• Validity: <span className="font-bold text-slate-800">{promo.startDate}</span> to <span className="font-bold text-slate-800">{promo.endDate}</span></p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Landing: {promo.landingVisibility ? 'ON' : 'OFF'}</span>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingPromo(promo);
                        setIsPromoModalOpen(true);
                      }}
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-xs font-bold cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete promotion "${promo.name}"?`)) {
                          const updated = promotions.filter(p => p.id !== promo.id);
                          setPromotions(updated);
                          saveStoredPromotions(updated);
                          triggerToast('Deleted', 'Campaign deleted.', 'info');
                        }
                      }}
                      className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: OFFER POP-UP BUILDER */}
      {plansSubTab === 'popups' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-slate-900" />
                <span>Offer Pop-up Builder & Display Engine</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Design targeted promotional pop-ups triggered by storage quotas (&gt;80%), trial expiry, or locked features.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPopup({
                  id: `popup-${Date.now()}`,
                  title: '⚡ Special Upgrade Opportunity!',
                  subtitle: 'Unlock 10GB cloud storage, live projector screen, and custom branding for your event.',
                  heroIllustration: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                  highlightedPlanId: 'Premium',
                  ctaButtonText: 'Upgrade to Pro Studio',
                  secondaryButtonText: 'Maybe Later',
                  promotionBadge: 'SPECIAL OFFER',
                  closeBehavior: 'dismiss_session',
                  displayRules: {
                    triggerOnFreePlanOnly: true,
                    triggerOnStorageNearFull: true,
                    customAudience: 'free_hosts'
                  },
                  frequency: 'once',
                  active: true
                });
                setIsPopupModalOpen(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Pop-up Config</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerPopups.map((popup) => (
              <div key={popup.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-32 relative overflow-hidden bg-slate-900">
                  <img src={popup.heroIllustration} alt={popup.title} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase">
                      {popup.promotionBadge}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black font-mono uppercase ${
                      popup.active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {popup.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900">{popup.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{popup.subtitle}</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 space-y-1 font-medium">
                    <p className="font-bold text-slate-900">Trigger Conditions:</p>
                    {popup.displayRules.triggerOnFirstLogin && <p>• Trigger on first login</p>}
                    {popup.displayRules.triggerOnFreePlanOnly && <p>• Show to Free Plan hosts only</p>}
                    {popup.displayRules.triggerOnStorageNearFull && <p>• Trigger when storage &gt; 80%</p>}
                    {popup.displayRules.triggerOnTrialEnding && <p>• Trigger when trial is ending</p>}
                    {popup.displayRules.triggerOnFeatureLocked && <p>• Trigger when user clicks locked feature</p>}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Target: {popup.highlightedPlanId}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const updated = offerPopups.map(p => p.id === popup.id ? { ...p, active: !p.active } : p);
                        setOfferPopups(updated);
                        saveStoredOfferPopups(updated);
                        triggerToast('Status Toggled', `Pop-up is now ${!popup.active ? 'Active' : 'Inactive'}.`, 'info');
                      }}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100"
                    >
                      {popup.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPopup(popup);
                        setIsPopupModalOpen(true);
                      }}
                      className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800"
                    >
                      Edit Config
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: RECEIPT & INVOICE SETTINGS MANAGER */}
      {plansSubTab === 'receipts' && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Sub-tab Intro Header */}
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-slate-900" />
                <h3 className="text-xl font-extrabold text-slate-900">Receipt & Invoice Manager</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Customize global business branding, tax formulas, invoice numbering sequences, and audit all workspace transactions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Template & Tax Settings */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-[28px] shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">Invoice Branding & Tax Rules</h4>
                <span className="bg-slate-100 text-slate-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">Template Engine</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={receiptSettings.companyName}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-sans text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="e.g. KAVA Memory Vaults, Inc."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Company Logo URL</label>
                  <input
                    type="text"
                    value={receiptSettings.companyLogoUrl}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, companyLogoUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-slate-400 text-[11px]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Business Address Line 1</label>
                  <input
                    type="text"
                    value={receiptSettings.companyAddressLine1}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, companyAddressLine1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="742 Market Street, Suite 800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Business Address Line 2</label>
                  <input
                    type="text"
                    value={receiptSettings.companyAddressLine2}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, companyAddressLine2: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="San Francisco, CA 94103, USA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Tax / VAT ID</label>
                    <input
                      type="text"
                      value={receiptSettings.taxIdNumber}
                      onChange={(e) => setReceiptSettings({ ...receiptSettings, taxIdNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-slate-400"
                      placeholder="US-EIN-98-3209142"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={receiptSettings.supportEmail}
                      onChange={(e) => setReceiptSettings({ ...receiptSettings, supportEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-slate-400"
                      placeholder="billing@kava.app"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Invoice Prefix</label>
                    <input
                      type="text"
                      value={receiptSettings.invoicePrefix}
                      onChange={(e) => setReceiptSettings({ ...receiptSettings, invoicePrefix: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-slate-400"
                      placeholder="INV-"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Format Pattern</label>
                    <input
                      type="text"
                      value={receiptSettings.invoiceNumberFormat}
                      onChange={(e) => setReceiptSettings({ ...receiptSettings, invoiceNumberFormat: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-slate-400 text-[10px]"
                      placeholder="INV-YYYY-XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Next Sequence</label>
                    <input
                      type="number"
                      value={receiptSettings.nextSequenceNumber}
                      onChange={(e) => setReceiptSettings({ ...receiptSettings, nextSequenceNumber: parseInt(e.target.value) || 10001 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Tax calculation toggle & Tax Rate */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Enable Automatic Tax</span>
                      <span className="text-[10px] text-slate-500 font-medium">Add tax calculation to total on checkout & receipts.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptSettings({ ...receiptSettings, enableTax: !receiptSettings.enableTax })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        receiptSettings.enableTax ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        receiptSettings.enableTax ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {receiptSettings.enableTax && (
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Tax Rate Percentage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={receiptSettings.taxRatePercent}
                        onChange={(e) => setReceiptSettings({ ...receiptSettings, taxRatePercent: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-slate-900 focus:outline-none focus:border-slate-400"
                        placeholder="8.5"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">Receipt Footer Legal Note</label>
                  <textarea
                    rows={2}
                    value={receiptSettings.footerText}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, footerText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-slate-400 text-[11px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    saveStoredReceiptSettings(receiptSettings);
                    addBillingLog({
                      action: 'Updated Receipt Settings',
                      adminEmail: 'admin@kava.app',
                      details: `Updated tax rate to ${receiptSettings.taxRatePercent}%, prefix to ${receiptSettings.invoicePrefix}`,
                      status: 'Success'
                    });
                    triggerToast('Receipt Settings Saved', 'Company branding & tax rules published to all host invoices.', 'success');
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Receipt Template Settings</span>
                </button>
              </div>
            </div>

            {/* Right Panel: Master Invoice History & Inspection */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-[28px] shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Master Invoice & Transaction Ledger</h4>
                  <p className="text-xs text-slate-500 font-medium">Global invoice records generated across all workspace host checkouts.</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, host, plan..."
                      value={adminInvoiceSearch}
                      onChange={(e) => setAdminInvoiceSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <select
                    value={adminInvoiceStatusFilter}
                    onChange={(e) => setAdminInvoiceStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 font-mono focus:outline-none"
                  >
                    <option value="all">Status: All</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Master Invoices Table */}
              {(() => {
                const filtered = masterInvoices.filter((inv) => {
                  const query = adminInvoiceSearch.toLowerCase();
                  const matchesSearch = !query ||
                    (inv.id && inv.id.toLowerCase().includes(query)) ||
                    (inv.customerName && inv.customerName.toLowerCase().includes(query)) ||
                    (inv.customerEmail && inv.customerEmail.toLowerCase().includes(query)) ||
                    (inv.workspaceName && inv.workspaceName.toLowerCase().includes(query)) ||
                    (inv.planName && inv.planName.toLowerCase().includes(query));

                  const matchesStatus = adminInvoiceStatusFilter === 'all' || inv.status === adminInvoiceStatusFilter;
                  return matchesSearch && matchesStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                      <h5 className="text-sm font-bold text-slate-800">No Invoices Found</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                        {adminInvoiceSearch || adminInvoiceStatusFilter !== 'all'
                          ? 'No invoice records match your search criteria.'
                          : 'No workspace checkouts recorded in the master ledger yet.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/50">
                          <th className="py-2.5 px-3 text-slate-400 font-bold uppercase tracking-wider font-mono">Invoice ID</th>
                          <th className="py-2.5 px-3 text-slate-400 font-bold uppercase tracking-wider font-mono">Workspace & Host</th>
                          <th className="py-2.5 px-3 text-slate-400 font-bold uppercase tracking-wider font-mono">Plan & Method</th>
                          <th className="py-2.5 px-3 text-slate-400 font-bold uppercase tracking-wider font-mono">Amount</th>
                          <th className="py-2.5 px-3 text-slate-400 font-bold uppercase tracking-wider font-mono">Status</th>
                          <th className="py-2.5 px-3 text-right text-slate-400 font-bold uppercase tracking-wider font-mono">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.id}</td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">{inv.workspaceName || 'Workspace'}</div>
                              <div className="text-[10px] text-slate-400">{inv.customerName || inv.customerEmail}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">{inv.planName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{inv.paymentMethod}</div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.amount}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-block font-bold text-[9px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full ${
                                inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                inv.status === 'Refunded' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                inv.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedAdminInvoice(inv);
                                    setIsAdminReceiptModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] font-mono transition-colors cursor-pointer"
                                  title="Inspect formatted PDF receipt"
                                >
                                  Inspect PDF
                                </button>
                                {inv.status === 'Paid' ? (
                                  <button
                                    onClick={() => {
                                      const updated = masterInvoices.map(i => i.id === inv.id ? { ...i, status: 'Refunded' as const } : i);
                                      setMasterInvoices(updated);
                                      saveStoredInvoices(updated);
                                      addBillingLog({
                                        action: 'Invoice Refunded',
                                        adminEmail: 'admin@kava.app',
                                        workspaceName: inv.workspaceName,
                                        invoiceId: inv.id,
                                        amount: inv.amount,
                                        details: `Refund processed for ${inv.customerName} (${inv.id}).`,
                                        status: 'Success'
                                      });
                                      triggerToast('Invoice Refunded', `Invoice ${inv.id} status set to Refunded.`, 'info');
                                    }}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[10px] font-mono transition-colors cursor-pointer"
                                  >
                                    Refund
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const updated = masterInvoices.map(i => i.id === inv.id ? { ...i, status: 'Paid' as const } : i);
                                      setMasterInvoices(updated);
                                      saveStoredInvoices(updated);
                                      addBillingLog({
                                        action: 'Invoice Marked Paid',
                                        adminEmail: 'admin@kava.app',
                                        workspaceName: inv.workspaceName,
                                        invoiceId: inv.id,
                                        amount: inv.amount,
                                        details: `Invoice ${inv.id} marked as Paid by Super Admin.`,
                                        status: 'Success'
                                      });
                                      triggerToast('Invoice Updated', `Invoice ${inv.id} marked as Paid.`, 'success');
                                    }}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[10px] font-mono transition-colors cursor-pointer"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Billing Audit Log Table */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-[28px] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">Billing System Audit Logs</h4>
              <span className="text-[10px] font-mono text-slate-400">{billingLogs.length} Logged Transactions</span>
            </div>

            {billingLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 font-mono">No billing audit logs recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="py-2 px-3 text-slate-400 font-mono font-bold uppercase">Timestamp</th>
                      <th className="py-2 px-3 text-slate-400 font-mono font-bold uppercase">Action</th>
                      <th className="py-2 px-3 text-slate-400 font-mono font-bold uppercase">Workspace / Invoice</th>
                      <th className="py-2 px-3 text-slate-400 font-mono font-bold uppercase">Amount</th>
                      <th className="py-2 px-3 text-slate-400 font-mono font-bold uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {billingLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{log.action}</td>
                        <td className="py-2.5 px-3 text-slate-600">{log.workspaceName || log.invoiceId || '—'}</td>
                        <td className="py-2.5 px-3 text-slate-900 font-bold">{log.amount || '—'}</td>
                        <td className="py-2.5 px-3 text-slate-500">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: SUPER ADMIN BILLING ANALYTICS */}
      {plansSubTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Monthly Recurring Revenue</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">$14,250</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">+18.4%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">ARR Run-rate: $171,000</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Active Paid Subscriptions</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">482</span>
                <span className="text-xs font-bold text-emerald-600">+34 this mo</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Churn Rate: 1.2%</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Upgrade Conversion Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">14.8%</span>
                <span className="text-xs font-bold text-emerald-600">+2.1%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Free → Pro Studio</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Offer Pop-up Conversion</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-500">8.4%</span>
                <span className="text-xs font-bold text-slate-500">231 redeemed</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Storage 80% Trigger Top Performer</span>
            </div>
          </div>

          {/* Promotion Campaign Performance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
              Promotional Campaign Revenue Performance
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <th className="p-3">Campaign Name</th>
                    <th className="p-3">Code</th>
                    <th className="p-3 text-center">Impressions</th>
                    <th className="p-3 text-center">Redemptions</th>
                    <th className="p-3 text-center">Conversion</th>
                    <th className="p-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Welcome Special Discount</td>
                    <td className="p-3 font-mono text-slate-900 font-bold">WELCOME20</td>
                    <td className="p-3 text-center font-mono">1,840</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">142</td>
                    <td className="p-3 text-center font-mono text-emerald-600 font-bold">7.7%</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">$3,294.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Early Bird Wedding Season</td>
                    <td className="p-3 font-mono text-slate-900 font-bold">EARLYBIRD30</td>
                    <td className="p-3 text-center font-mono">920</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">89</td>
                    <td className="p-3 text-center font-mono text-emerald-600 font-bold">9.6%</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">$1,806.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Black Friday Flash Sale</td>
                    <td className="p-3 font-mono text-slate-900 font-bold">BLACKFRIDAY50</td>
                    <td className="p-3 text-center font-mono">4,100</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">640</td>
                    <td className="p-3 text-center font-mono text-emerald-600 font-bold">15.6%</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">$9,280.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* EDIT PROMOTION MODAL */}
      {isPromoModalOpen && editingPromo && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Configure Promotion Campaign</h3>
              <button onClick={() => setIsPromoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={editingPromo.name}
                  onChange={(e) => setEditingPromo({ ...editingPromo, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={editingPromo.code}
                    onChange={(e) => setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={editingPromo.discountValue}
                      onChange={(e) => setEditingPromo({ ...editingPromo, discountValue: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                    <select
                      value={editingPromo.discountType}
                      onChange={(e) => setEditingPromo({ ...editingPromo, discountType: e.target.value as any })}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    >
                      <option value="percentage">% OFF</option>
                      <option value="fixed">$ OFF</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingPromo.startDate}
                    onChange={(e) => setEditingPromo({ ...editingPromo, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingPromo.endDate}
                    onChange={(e) => setEditingPromo({ ...editingPromo, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPromo.landingVisibility}
                    onChange={(e) => setEditingPromo({ ...editingPromo, landingVisibility: e.target.checked })}
                    className="rounded text-slate-900 focus:ring-slate-200"
                  />
                  <span className="font-bold text-slate-800">Show on Landing Page</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPromo.active}
                    onChange={(e) => setEditingPromo({ ...editingPromo, active: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-slate-800">Active</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button onClick={() => setIsPromoModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
              <button
                onClick={() => {
                  if (editingPromo) {
                    const updated = promotions.some(p => p.id === editingPromo.id)
                      ? promotions.map(p => p.id === editingPromo.id ? editingPromo : p)
                      : [editingPromo, ...promotions];
                    setPromotions(updated);
                    saveStoredPromotions(updated);
                    setIsPromoModalOpen(false);
                    triggerToast('Promotion Saved', `"${editingPromo.name}" saved successfully.`, 'success');
                  }
                }}
                className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl shadow"
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POPUP MODAL */}
      {isPopupModalOpen && editingPopup && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Configure Offer Pop-up</h3>
              <button onClick={() => setIsPopupModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pop-up Headline Title</label>
                <input
                  type="text"
                  value={editingPopup.title}
                  onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-extrabold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle / Message</label>
                <textarea
                  value={editingPopup.subtitle}
                  onChange={(e) => setEditingPopup({ ...editingPopup, subtitle: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Promotion Badge Text</label>
                  <input
                    type="text"
                    value={editingPopup.promotionBadge}
                    onChange={(e) => setEditingPopup({ ...editingPopup, promotionBadge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingPopup.ctaButtonText}
                    onChange={(e) => setEditingPopup({ ...editingPopup, ctaButtonText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-800 block">Trigger Rules:</label>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPopup.displayRules.triggerOnFirstLogin || false}
                      onChange={(e) => setEditingPopup({ ...editingPopup, displayRules: { ...editingPopup.displayRules, triggerOnFirstLogin: e.target.checked } })}
                    />
                    <span>First Login</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPopup.displayRules.triggerOnFreePlanOnly || false}
                      onChange={(e) => setEditingPopup({ ...editingPopup, displayRules: { ...editingPopup.displayRules, triggerOnFreePlanOnly: e.target.checked } })}
                    />
                    <span>Free Plan Only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPopup.displayRules.triggerOnStorageNearFull || false}
                      onChange={(e) => setEditingPopup({ ...editingPopup, displayRules: { ...editingPopup.displayRules, triggerOnStorageNearFull: e.target.checked } })}
                    />
                    <span>Storage &gt; 80%</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPopup.displayRules.triggerOnFeatureLocked || false}
                      onChange={(e) => setEditingPopup({ ...editingPopup, displayRules: { ...editingPopup.displayRules, triggerOnFeatureLocked: e.target.checked } })}
                    />
                    <span>Feature Clicked</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button onClick={() => setIsPopupModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
              <button
                onClick={() => {
                  if (editingPopup) {
                    const updated = offerPopups.some(p => p.id === editingPopup.id)
                      ? offerPopups.map(p => p.id === editingPopup.id ? editingPopup : p)
                      : [editingPopup, ...offerPopups];
                    setOfferPopups(updated);
                    saveStoredOfferPopups(updated);
                    setIsPopupModalOpen(false);
                    triggerToast('Offer Pop-up Saved', `"${editingPopup.title}" saved successfully.`, 'success');
                  }
                }}
                className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl shadow"
              >
                Save Pop-up Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLAN ASSIGNMENT & OVERRIDES */}
      {plansSubTab === 'assign' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Target Selector left panel */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => { setAssignTargetType('user'); setSelectedAssignTargetId(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    assignTargetType === 'user' ? 'bg-slate-900 text-white font-extrabold shadow-xs' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Hosts / Users List
                </button>
                <button
                  onClick={() => { setAssignTargetType('workspace'); setSelectedAssignTargetId(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    assignTargetType === 'workspace' ? 'bg-slate-900 text-white font-extrabold shadow-xs' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Workspaces Catalog
                </button>
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder={`Search catalog node references...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
              />
            </div>

            {/* Users or workspaces rendering list */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {assignTargetType === 'user' ? (
                filteredUsers.map((user: any) => (
                  <button
                    key={user.id || user.email}
                    onClick={() => {
                      setSelectedAssignTargetId(user.id || user.email);
                      setNewAssignedPlanId(user.plan || 'Premium');
                      setAssignmentOverrideStorage(user.customStorageGb || 0);
                      setIsLifetime(!!user.isLifetime);
                    }}
                    className={`w-full p-3.5 text-left flex items-center justify-between transition-all rounded-xl cursor-pointer ${
                      selectedAssignTargetId === (user.id || user.email) ? 'bg-slate-100 border border-slate-300 pl-4' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">{user.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{user.email} • {user.role}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                        {user.plan || 'Free'}
                      </span>
                      {user.isLifetime && (
                        <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest">
                          Lifetime
                        </span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                filteredWorkspaces.map((ws: any) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedAssignTargetId(ws.id);
                      setNewAssignedPlanId(ws.plan || 'Premium');
                      setAssignmentOverrideStorage(ws.maxStorageMB ? Math.round(ws.maxStorageMB / 1024) : 0);
                      setIsLifetime(!!ws.isLifetime);
                    }}
                    className={`w-full p-3.5 text-left flex items-center justify-between transition-all rounded-xl cursor-pointer ${
                      selectedAssignTargetId === ws.id ? 'bg-slate-100 border border-slate-300 pl-4' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">{ws.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Host: {ws.host} • Status: {ws.status}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-slate-500 text-[10px] font-bold mr-2">{ws.storageMB}MB / {ws.maxStorageMB}MB Storage</span>
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                        {ws.plan || 'Free'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Setup Panel right side */}
          <div className="lg:col-span-5">
            {selectedAssignTargetId ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure Override Profile</h4>
                  <p className="text-sm font-black text-slate-900 mt-1 truncate">
                    Target: <code className="font-mono text-slate-900 text-xs font-bold">{selectedAssignTargetId}</code>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Catalog Plan Tier</label>
                    <select
                      value={newAssignedPlanId}
                      onChange={(e) => setNewAssignedPlanId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      {activePlans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (monthly ${p.monthlyPrice})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Override Storage Allocation (GB)</label>
                    <input
                      type="number"
                      value={assignmentOverrideStorage}
                      onChange={(e) => setAssignmentOverrideStorage(parseInt(e.target.value) || 0)}
                      placeholder="0 maps back to default plan quota"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold"
                    />
                    <span className="text-[9px] text-slate-400 block mt-1">Specify custom storage capacity. Leave 0 to fallback to default plan quotas.</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">Lifetime Privilege Access</p>
                      <p className="text-[9px] text-slate-400 font-medium">Bypass auto renewal expires and suspend loops.</p>
                    </div>
                    <button
                      onClick={() => setIsLifetime(!isLifetime)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        isLifetime ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isLifetime ? 'translate-x-5.5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedAssignTargetId(null)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignPlan}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer"
                  >
                    Apply Settings Override
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-12 text-center text-slate-400">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-slate-900">Select User or Workspace</h5>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">Map premium quotas or lifetime privilege access directly to individual hosts.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AUDIT TRAIL & ROLLS */}
      {plansSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Plan Catalog Audit Logs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Capture transaction actions and restore prior state configurations.</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Clear audit database traces? This operation is irreversible.')) {
                  setAuditLogs([]);
                }
              }}
              className="text-[10px] text-red-500 hover:text-red-700 font-bold"
            >
              Flush Logs
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-wider ${
                        log.action === 'create' ? 'bg-green-50 text-green-700 border border-green-100' :
                        log.action === 'rollback' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        log.action === 'manually_assigned' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                        'bg-slate-150 text-slate-700 border border-slate-200'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900">{log.description}</h5>
                    {log.changeSummary && (
                      <p className="text-[10px] text-slate-500 font-mono bg-slate-50 p-1.5 px-2 rounded-lg mt-1 border border-slate-100">{log.changeSummary}</p>
                    )}
                    <p className="text-[10px] text-slate-400">Actor: <span className="font-semibold text-slate-600">{log.actor}</span></p>
                  </div>

                  {log.previousState && (
                    <button
                      onClick={() => handleRollback(log)}
                      className="px-3 py-1 border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-600 font-bold text-[10px] rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Rollback State
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Info className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">No transactions recorded inside log traces.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM PUBLISH DIALOG MODAL */}
      {showConfirmPublish && editedPlan && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[10000] p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-4 text-left animate-fade-in">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">Publish Catalog Modifications?</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                  You are about to commit changes to "{editedPlan.name}". This will immediately synchronize and update features, storage limits, and security gating for all active hosts of this plan tier.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2 text-[10px] font-semibold text-slate-600">
              <p>• Action: Update plan v{editedPlan.version} → v{(editedPlan.version || 1) + 1}</p>
              <p>• Storage Quota: {editedPlan.storageQuotaGb} GB</p>
              <p>• Allowed Media: {editedPlan.allowedMediaTypes?.join(', ').toUpperCase()}</p>
              <p>• Live Presentation screen: {editedPlan.liveScreenAvailable ? 'Enabled (ON)' : 'Disabled (OFF)'}</p>
            </div>

            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setShowConfirmPublish(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishChanges}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                Sync & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Receipt Inspection Modal */}
      <ReceiptModal
        isOpen={isAdminReceiptModalOpen}
        onClose={() => setIsAdminReceiptModalOpen(false)}
        invoice={selectedAdminInvoice}
        triggerToast={triggerToast}
      />
    </div>
  );
}
