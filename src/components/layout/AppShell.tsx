import {
  Box,
  ChevronDown,
  Database,
  GitBranch,
  Leaf,
  LogOut,
  Menu,
  Network,
  PanelRightOpen,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Zap,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { GraphCanvas } from '../graph/GraphCanvas';
import { Button } from '../ui/button';
import { isDefaultApp } from '../../api/mockApi';
import { useApps, useCreateApp, useDeleteApp } from '../../hooks/useApps';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function AppShell() {
  const { data: apps } = useApps();
  const createApp = useCreateApp();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);
  const logout = useAppStore((state) => state.logout);
  const currentUser = useAppStore((state) => state.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateAppOpen, setCreateAppOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const onCreateApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newAppName.trim();

    if (!name) {
      return;
    }

    createApp.mutate(name, {
      onSuccess: () => {
        setNewAppName('');
        setCreateAppOpen(false);
      },
    });
  };

  useEffect(() => {
    if (
      (!selectedAppId || !apps?.some((app) => app.id === selectedAppId)) &&
      apps?.[0]
    ) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId, setSelectedAppId]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111111] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10)_1px,transparent_1.5px)] [background-size:18px_18px]" />
      <header className="pointer-events-none fixed left-7 right-3 top-4 z-30 flex items-start justify-between">
        <div className="pointer-events-auto flex h-10 w-[380px] max-w-[calc(100vw-2rem)] items-center overflow-hidden rounded-md border border-[#333] bg-[#151515] shadow-2xl">
          <div className="grid h-10 w-12 place-items-center border-r border-[#2a2a2a] bg-black">
            <div className="h-8 w-8 rounded-sm border-4 border-white border-r-transparent border-t-transparent" />
          </div>
          <div className="grid h-10 w-10 place-items-center bg-[#6657f4]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between px-3 text-sm font-semibold">
            <span className="truncate">supertokens-golang</span>
            <div className="flex items-center gap-3 text-zinc-300">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-start gap-2">
          <div className="flex items-center gap-3 rounded-md border border-[#303030] bg-[#1a1a1a] px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] text-xs font-medium text-white">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden text-sm font-medium text-zinc-200 sm:inline-block">
              {currentUser?.name || 'User'}
            </span>
          </div>

          <Button
            className="h-10 w-10 border-[#303030] bg-[#181818] text-zinc-300 hover:bg-[#242424]"
            size="icon"
            variant="outline"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <LeftRail />
      <div className="relative z-10 min-h-screen">
        <main className="min-h-screen">
          <GraphCanvas />
        </main>
        <div className="fixed left-[92px] top-[72px] z-20 h-[330px] w-[324px] overflow-hidden rounded-lg border border-[#141414] bg-black shadow-2xl">
          <div className="flex h-full flex-col p-5">
            <div className="mb-5 text-lg font-semibold">Application</div>
            <div className="mb-3 flex gap-2">
              <div className="flex h-8 flex-1 items-center gap-2 rounded-md bg-[#1d2023] px-3 text-sm text-zinc-300">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder:text-zinc-500"
                />
                <Search className="ml-auto h-4 w-4 text-zinc-500" />
              </div>
              <Button
                className="h-8 w-8 bg-[#2563eb] hover:bg-[#1d4ed8]"
                size="icon"
                title="Add App"
                disabled={createApp.isPending}
                onClick={() => setCreateAppOpen(true)}
              >
                +
              </Button>
            </div>
            {isCreateAppOpen ? (
              <form
                className="mb-3 rounded-lg border border-[#202020] bg-[#090909] p-3 shadow-xl"
                onSubmit={onCreateApp}
              >
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  New application
                </label>
                <input
                  className="mb-3 h-9 w-full rounded-md border border-[#2f2f2f] bg-[#151515] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#2563eb]"
                  type="text"
                  value={newAppName}
                  onChange={(event) => setNewAppName(event.target.value)}
                  placeholder="Application name"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    className="h-8 border-[#2f2f2f] bg-transparent text-zinc-300 hover:bg-[#151515]"
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewAppName('');
                      setCreateAppOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-8 bg-[#2563eb] hover:bg-[#1d4ed8]"
                    type="submit"
                    size="sm"
                    disabled={createApp.isPending || !newAppName.trim()}
                  >
                    {createApp.isPending ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </form>
            ) : null}
            <Button
              className="mb-3 md:hidden"
              size="icon"
              onClick={() => setMobilePanelOpen(true)}
              aria-label="Open panel"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <AppMenu searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftRail() {
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);
  const requestAddNode = useAppStore((state) => state.requestAddNode);
  const items = [
    {
      icon: GitBranch,
      color: 'bg-[#0f172a]',
      label: 'Add source service',
      action: () =>
        requestAddNode({
          label: 'Source Service',
          description: 'Source control backed service node.',
          kind: 'service',
          status: 'Healthy',
          traffic: 50,
        }),
    },
    {
      icon: Database,
      color: 'bg-[#0f3450]',
      label: 'Add Postgres node',
      action: () =>
        requestAddNode({
          label: 'Postgres',
          description: 'Relational database node.',
          kind: 'database',
          status: 'Healthy',
          traffic: 55,
        }),
    },
    {
      icon: Database,
      color: 'bg-[#d52222]',
      label: 'Add Redis node',
      action: () =>
        requestAddNode({
          label: 'Redis',
          description: 'Cache and queue storage node.',
          kind: 'database',
          status: 'Degraded',
          traffic: 42,
        }),
    },
    {
      icon: Leaf,
      color: 'bg-[#112915]',
      label: 'Add MongoDB node',
      action: () =>
        requestAddNode({
          label: 'Mongodb',
          description: 'Document database node.',
          kind: 'database',
          status: 'Healthy',
          traffic: 62,
        }),
    },
    {
      icon: Box,
      color: 'bg-[#111827]',
      label: 'Add container node',
      action: () =>
        requestAddNode({
          label: 'Container',
          description: 'Generic containerized service node.',
          kind: 'service',
          status: 'Healthy',
          traffic: 48,
        }),
    },
    {
      icon: PanelRightOpen,
      color: 'bg-[#111827]',
      label: 'Open inspector',
      action: () => setMobilePanelOpen(true),
    },
    {
      icon: Network,
      color: 'bg-[#06251d]',
      label: 'Fit topology',
      action: () => window.dispatchEvent(new Event('app-graph-fit-view')),
    },
  ];

  return (
    <nav className="fixed left-5 top-[312px] z-30 flex w-11 flex-col items-center gap-2 rounded-lg bg-black p-2 shadow-2xl">
      {items.map(({ icon: Icon, color, label, action }, index) => (
        <button
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md text-white transition-transform hover:scale-105',
            color,
            index === 5 && 'text-yellow-400'
          )}
          key={label}
          type="button"
          aria-label={label}
          title={label}
          onClick={action}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
}

function AppMenu({ searchQuery = '' }: { searchQuery?: string }) {
  const { data: apps, isError, isLoading } = useApps();
  const deleteApp = useDeleteApp();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  const getAppDetails = (id: string) => {
    switch (id) {
      case 'commerce':
        return { icon: Zap, color: 'bg-[#6657f4]' };
      case 'ops':
        return { icon: Settings, color: 'bg-[#8b5cf6]' };
      case 'analytics':
        return { icon: RefreshCw, color: 'bg-[#ef4444]' };
      case 'ruby':
        return { icon: Box, color: 'bg-[#d946ef]' };
      case 'go':
        return { icon: Network, color: 'bg-[#8b5cf6]' };
      default: {
        // Use a deterministic color based on id length for newly added apps
        const colors = ['bg-[#3b82f6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#f43f5e]', 'bg-[#8b5cf6]'];
        const color = colors[id.length % colors.length];
        return { icon: Box, color };
      }
    }
  };

  const rows = (apps ?? []).map((app) => ({
    id: app.id,
    name: app.name,
    environment: app.environment,
    owner: app.owner,
    ...getAppDetails(app.id),
  }));

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-sm text-zinc-500">Loading apps...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-400">Could not load apps.</div>;
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      {filteredRows.length ? (
        <div className="app-slider flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2">
          {filteredRows.map(({ id, name, environment, owner, icon: Icon, color }) => {
            const isSelected = selectedAppId === id;
            const canDelete = !isDefaultApp(id);

            return (
              <div
                className={cn(
                  'flex h-14 w-full shrink-0 items-center gap-2 rounded-md text-zinc-100 transition-colors hover:bg-white/5',
                  isSelected && 'bg-white/5'
                )}
                key={id}
              >
                <button
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-0 text-left text-sm font-semibold"
                  type="button"
                  onClick={() => setSelectedAppId(id)}
                >
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-md text-white',
                      color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{name}</span>
                    <span className="block truncate text-xs font-normal text-zinc-500">
                      {environment} · {owner}
                    </span>
                  </span>
                </button>
                {canDelete ? (
                  <button
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
                    type="button"
                    aria-label={`Delete ${name}`}
                    title="Delete application"
                    disabled={deleteApp.isPending}
                    onClick={() => deleteApp.mutate(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="w-8 shrink-0 text-center text-xl font-light text-zinc-300">
                    ›
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid h-full place-items-center rounded-lg border border-[#181818] bg-[#080808] px-4 text-center text-sm text-zinc-500">
          No applications found.
        </div>
      )}
    </div>
  );
}
