import React, { useState, useEffect, useMemo } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import {
  Users, BookOpen, RefreshCw, Search,
  AlertTriangle, X, Mail, Hash,
  CheckCircle2, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  fetchUsers, fetchSubjects, fetchAllTests,
  assignCurriculums, unassignCurriculums, isTrainualConfigured
} from '../services/trainualService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  title: string; // Job title from Trainual (e.g. "Bartender", "Server")
  status: string;
  roles: string[];
  completionPct: number;
  assignedSubjectIds: Record<number, boolean>;
}

interface Subject {
  id: number;
  title: string;
  testCount: number;
  tests: { id: number; name: string }[];
  category: string;
  location: 'Cantina' | 'OAK' | 'Both' | 'General';
  role: 'Host' | 'Server' | 'Bartender' | 'General';
}

type RoleFilter = 'All' | 'Host' | 'Server' | 'Bartender';

// ─── Tiny shadcn-style primitives (no extra deps beyond what's installed) ─────

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-card text-card-foreground rounded-xl border border-border/60 shadow-sm', className)} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-sm text-muted-foreground', className)} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5 pt-0', className)} {...props} />
);

const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' }) => (
  <div className={cn(
    'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border transition-colors',
    variant === 'default' && 'bg-primary/10 text-primary border-primary/20',
    variant === 'secondary' && 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    variant === 'outline' && 'bg-transparent text-foreground border-border',
    variant === 'success' && 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    variant === 'warning' && 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    className
  )} {...props} />
);

const Progress = ({ value = 0, className }: { value?: number; className?: string }) => (
  <ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/15', className)}>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-500"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </ProgressPrimitive.Root>
);

const Separator = ({ className }: { className?: string }) => (
  <div className={cn('shrink-0 bg-border/60 h-[1px] w-full', className)} />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function detectCategory(title: string): Pick<Subject, 'category' | 'location' | 'role'> {
  const t = title.toLowerCase();
  const location: Subject['location'] = t.includes('cantina') ? 'Cantina' : t.includes('oak') ? 'OAK' : 'General';
  let role: Subject['role'] = 'General';
  if (t.includes('server') || t.includes('service')) role = 'Server';
  else if (t.includes('bartender') || t.includes('bar')) role = 'Bartender';
  else if (t.includes('host')) role = 'Host';

  let category = 'General';
  if (location !== 'General' && role !== 'General') category = `${location} ${role}`;
  else if (location !== 'General') category = `${location} General`;
  else if (t.includes('beer') || t.includes('wine')) { category = 'Beer & Wine'; }
  else if (t.includes('handbook') || t.includes('employee')) category = 'Company Policies';
  else if (t.includes('white buffalo') || t.includes('wb')) category = 'White Buffalo';

  return { category, location, role };
}

function getRoleColor(role: string) {
  if (role === 'Host') return 'bg-violet-500/10 text-violet-700 border-violet-500/20';
  if (role === 'Server') return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
  if (role === 'Bartender') return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
  return 'bg-muted text-muted-foreground border-border/60';
}

function getLocationAccent(location: string) {
  if (location === 'Cantina') return 'border-l-teal-400';
  if (location === 'OAK') return 'border-l-orange-400';
  return 'border-l-border';
}

// Maps a user's role title → which Subject roles are relevant
function relevantRolesForUser(userTitle: string): Subject['role'][] {
  const t = userTitle.toLowerCase();
  const result = new Set<Subject['role']>(['General']);
  if (t.includes('server') || t.includes('service')) result.add('Server');
  if (t.includes('bartender') || t.includes('bar')) result.add('Bartender');
  if (t.includes('host')) result.add('Host');
  return Array.from(result);
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TestAssigner({ mode = 'assign' }: { mode?: 'directory' | 'assign' }) {
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    if (!isTrainualConfigured()) {
      showToast('Trainual password not configured.', 'error');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [usersData, subjectsData, allTests] = await Promise.all([fetchUsers(), fetchSubjects(), fetchAllTests()]);

      // Fetched once above and grouped here, instead of once per subject.
      const testsBySubject = new Map<number, { id: number; name: string }[]>();
      for (const t of allTests) {
        if (t.subject_id == null) continue;
        if (!testsBySubject.has(t.subject_id)) testsBySubject.set(t.subject_id, []);
        testsBySubject.get(t.subject_id)!.push({ id: t.id, name: t.name || 'Unnamed Test' });
      }

      const testSubjects: Subject[] = [];
      for (const s of subjectsData) {
        if ((s.surveys_count || 0) > 0) {
          const title = s.title || 'Untitled';
          const { category, location, role } = detectCategory(title);
          testSubjects.push({
            id: s.id,
            title,
            testCount: s.surveys_count || 0,
            tests: testsBySubject.get(s.id) || [],
            category,
            location,
            role,
          });
        }
      }
      testSubjects.sort((a, b) => a.title.localeCompare(b.title));

      const userData: User[] = [];
      usersData.forEach((u: any) => {
        if (u.status === 'archived') return;
        const assignedSubjectIds: Record<number, boolean> = {};
        (u.curriculums_assigned || []).forEach((c: any) => { assignedSubjectIds[c.id] = true; });
        userData.push({
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          title: u.title || '',
          completionPct: u.completion_percentage ?? 0,
          status: u.status || '',
          roles: (u.roles_assigned || []).map((r: any) => r.name),
          assignedSubjectIds,
        });
      });
      userData.sort((a, b) => a.name.localeCompare(b.name));

      setUsers(userData);
      setSubjects(testSubjects);
    } catch (error: any) {
      showToast(`Failed to load: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredUsers = useMemo(() => users.filter(u => {
    if (search) {
      const h = `${u.name} ${u.email} ${u.title}`.toLowerCase();
      if (!h.includes(search.toLowerCase())) return false;
    }
    if (roleFilter !== 'All') {
      if (!u.title.toLowerCase().includes(roleFilter.toLowerCase())) return false;
    }
    return true;
  }), [users, search, roleFilter]);

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId) ?? null, [users, selectedUserId]);

  // Subjects relevant to the selected user based on their role
  const userRelevantSubjects = useMemo(() => {
    if (!selectedUser) return subjects;
    const relevant = relevantRolesForUser(selectedUser.title);
    return subjects.filter(s => relevant.includes(s.role));
  }, [selectedUser, subjects]);

  const stats = useMemo(() => {
    const roleCounts = { Host: 0, Server: 0, Bartender: 0, Other: 0 };
    users.forEach(u => {
      const r = u.roles.join(' ').toLowerCase();
      if (r.includes('host')) roleCounts.Host++;
      else if (r.includes('server')) roleCounts.Server++;
      else if (r.includes('bartender') || r.includes('bar')) roleCounts.Bartender++;
      else roleCounts.Other++;
    });
    return roleCounts;
  }, [users]);

  const toggle = async (userId: number, subjectId: number, isAssigned: boolean) => {
    if (isAssigned) {
      const result = await unassignCurriculums(userId, [subjectId]);
      if (result.succeeded.includes(subjectId)) {
        setUsers(prev => prev.map(u => {
          if (u.id !== userId) return u;
          const n = { ...u.assignedSubjectIds };
          delete n[subjectId];
          return { ...u, assignedSubjectIds: n };
        }));
        showToast('Subject unassigned', 'info');
      } else {
        showToast(result.error || 'Failed to unassign', 'error');
      }
    } else {
      const result = await assignCurriculums(userId, [subjectId]);
      if (result.succeeded.includes(subjectId)) {
        setUsers(prev => prev.map(u => {
          if (u.id !== userId) return u;
          return { ...u, assignedSubjectIds: { ...u.assignedSubjectIds, [subjectId]: true } };
        }));
        showToast('Subject assigned ✓', 'success');
      } else {
        showToast(result.error || 'Failed to assign', 'error');
      }
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!isTrainualConfigured() && !loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Trainual Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Add <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">TRAINUAL_PASSWORD</code> to your <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">.env</code> file and rebuild.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Left Panel: Employee List ──────────────────────────────────────── */}
      <div className="w-72 border-r border-border/60 bg-card/40 flex flex-col shrink-0">

        {/* Header */}
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">{mode === 'directory' ? 'Manage Staff' : 'Test Assigner'}</h2>
            <button
              onClick={loadData}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-8 pr-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="px-3 pt-3 pb-2 border-b border-border/60">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Filter by Role</p>
          <div className="grid grid-cols-4 gap-1">
            {(['All', 'Host', 'Server', 'Bartender'] as RoleFilter[]).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  'py-1 rounded-md text-xs font-medium transition-all border',
                  roleFilter === r
                    ? r === 'All' ? 'bg-foreground text-background border-foreground'
                      : r === 'Host' ? 'bg-violet-500 text-white border-violet-500'
                      : r === 'Server' ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-amber-500 text-white border-amber-500'
                    : 'bg-background text-muted-foreground border-border/60 hover:bg-accent hover:text-foreground'
                )}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Role stat pills */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-700 font-medium">{stats.Host} Host</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 font-medium">{stats.Server} Server</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 font-medium">{stats.Bartender} Bartender</span>
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No employees found</div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filteredUsers.map(user => {
                const assigned = Object.keys(user.assignedSubjectIds).length;
                const pct = user.completionPct;
                const isSelected = selectedUserId === user.id;

                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-lg transition-all group',
                      isSelected
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-accent border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border',
                        isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border/60'
                      )}>
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={cn('text-sm font-medium truncate', isSelected ? 'text-primary' : 'text-foreground')}>
                            {user.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{pct}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {user.title && (
                            <span className={cn('text-[10px] px-1.5 py-0 rounded border font-medium', getRoleColor(
                              user.title.toLowerCase().includes('host') ? 'Host'
                              : user.title.toLowerCase().includes('server') ? 'Server'
                              : user.title.toLowerCase().includes('bartender') ? 'Bartender' : ''
                            ))}>
                              {user.title}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">{assigned} assigned</span>
                        </div>
                        <Progress value={pct} className="mt-1.5 h-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel: User Profile ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!selectedUser ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Select an Employee</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {mode === 'directory'
                ? 'Choose an employee from the left to view their profile, completion stats, and assigned subjects.'
                : 'Choose an employee from the left panel to view their profile and manage test assignments.'}
            </p>
          </div>
        ) : (
          <UserProfile
            user={selectedUser}
            relevantSubjects={userRelevantSubjects}
            allSubjects={subjects}
            onToggle={toggle}
            onBack={() => setSelectedUserId(null)}
            readOnly={mode === 'directory'}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={cn(
            'px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3',
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
            : toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200'
            : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200'
          )}>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Profile Panel ────────────────────────────────────────────────────────

interface UserProfileProps {
  user: User;
  relevantSubjects: Subject[];
  allSubjects: Subject[];
  onToggle: (userId: number, subjectId: number, isAssigned: boolean) => void;
  onBack: () => void;
  readOnly?: boolean;
}

function UserProfile({ user, relevantSubjects, allSubjects, onToggle, onBack, readOnly = false }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'relevant' | 'all'>('relevant');
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const assignedCount = Object.keys(user.assignedSubjectIds).length;
  const relevantAssigned = relevantSubjects.filter(s => user.assignedSubjectIds[s.id]).length;
  const relevantPct = relevantSubjects.length > 0 ? Math.round((relevantAssigned / relevantSubjects.length) * 100) : 0;

  const handleToggle = async (subjectId: number, isAssigned: boolean) => {
    setPendingIds(p => new Set(p).add(subjectId));
    await onToggle(user.id, subjectId, isAssigned);
    setPendingIds(p => { const n = new Set(p); n.delete(subjectId); return n; });
  };

  const displaySubjects = activeTab === 'relevant' ? relevantSubjects : allSubjects;

  // Group subjects by category for the "relevant" tab
  const grouped = useMemo(() => {
    const map = new Map<string, Subject[]>();
    displaySubjects.forEach(s => {
      const k = s.category;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [displaySubjects]);

  const roleKey = user.title.toLowerCase().includes('host') ? 'Host'
    : user.title.toLowerCase().includes('server') ? 'Server'
    : user.title.toLowerCase().includes('bartender') ? 'Bartender' : '';

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Profile Header */}
      <div className="p-6 border-b border-border/60 bg-card/30 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          All Employees
        </button>

        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border-2 border-primary/20 shrink-0">
            {getInitials(user.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              {roleKey && (
                <span className={cn('text-xs px-2 py-0.5 rounded-md border font-semibold', getRoleColor(roleKey))}>
                  {user.title}
                </span>
              )}
              <span className={cn('text-xs px-2 py-0.5 rounded-md border font-medium',
                user.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/60'
              )}>
                {user.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </div>
            {user.roles.length > 1 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.roles.slice(1).map(r => (
                  <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">{r}</span>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 shrink-0">
            <div className="text-center p-3 rounded-xl bg-card border border-border/60 min-w-[72px]">
              <div className="text-2xl font-bold text-foreground">{user.completionPct}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Trainual</div>
              <div className="text-[10px] text-muted-foreground">Complete</div>
              <Progress value={user.completionPct} className="mt-2 h-1.5" />
            </div>
            <div className="text-center p-3 rounded-xl bg-card border border-border/60 min-w-[72px]">
              <div className="text-2xl font-bold text-foreground">{relevantAssigned}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">of {relevantSubjects.length}</div>
              <div className="text-[10px] text-muted-foreground">assigned</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-card border border-border/60 min-w-[72px]">
              <div className="text-2xl font-bold text-foreground">{assignedCount}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">total</div>
              <div className="text-[10px] text-muted-foreground">assigned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-border/60 shrink-0">
        <button
          onClick={() => setActiveTab('relevant')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all -mb-px',
            activeTab === 'relevant'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          Relevant Subjects
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
            {relevantSubjects.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all -mb-px',
            activeTab === 'all'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Hash className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          All Subjects
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
            {allSubjects.length}
          </span>
        </button>
      </div>

      {/* Subject List */}
      <div className="flex-1 overflow-y-auto p-6">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <BookOpen className="w-8 h-8 opacity-30" />
            <p className="text-sm">No subjects found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([category, subs]) => {
              const catAssigned = subs.filter(s => user.assignedSubjectIds[s.id]).length;
              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {catAssigned}/{subs.length}
                      </span>
                    </div>
                    <div className="flex-1 mx-4">
                      <Progress value={subs.length > 0 ? Math.round((catAssigned / subs.length) * 100) : 0} className="h-1" />
                    </div>
                  </div>

                  {/* Subject Cards */}
                  <div className="space-y-2">
                    {subs.map(subject => {
                      const isAssigned = !!user.assignedSubjectIds[subject.id];
                      const isPending = pendingIds.has(subject.id);

                      return (
                        <div
                          key={subject.id}
                          className={cn(
                            'flex items-center gap-4 p-3.5 rounded-xl border transition-all',
                            'border-l-4',
                            getLocationAccent(subject.location),
                            isAssigned
                              ? 'bg-primary/5 border-primary/15 border-l-primary/40'
                              : 'bg-card border-border/60 hover:border-border',
                          )}
                        >
                          {/* Toggle (assign mode only) */}
                          {!readOnly && (
                          <button
                            disabled={isPending}
                            onClick={() => handleToggle(subject.id, isAssigned)}
                            className={cn(
                              'shrink-0 w-10 h-5 rounded-full relative transition-all border-none outline-none',
                              isAssigned ? 'bg-primary' : 'bg-muted',
                              isPending && 'opacity-50 cursor-wait'
                            )}
                          >
                            <div className={cn(
                              'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                              isAssigned && 'translate-x-5'
                            )} />
                          </button>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">{subject.title}</span>
                              {isAssigned && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> Assigned
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground">{subject.testCount} test{subject.testCount !== 1 ? 's' : ''}</span>
                              {subject.tests.length > 0 && (
                                <span className="text-xs text-muted-foreground truncate max-w-xs">
                                  {subject.tests.map(t => t.name).join(' · ')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Location badge */}
                          {subject.location !== 'General' && (
                            <span className={cn(
                              'shrink-0 text-[10px] px-2 py-0.5 rounded border font-medium',
                              subject.location === 'Cantina' ? 'bg-teal-500/10 text-teal-700 border-teal-500/20' : 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                            )}>
                              {subject.location}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
