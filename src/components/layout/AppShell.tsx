import {
  Box,
  ChevronDown,
  Database,
  GitBranch,
  Leaf,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  PanelRightOpen,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GraphCanvas } from '../graph/GraphCanvas';
import { Button } from '../ui/button';
import { useApps } from '../../hooks/useApps';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function AppShell() {
  const queryClient = useQueryClient();
  const { data: apps } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const simulateApiError = useAppStore((state) => state.simulateApiError);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);
  const setSimulateApiError = useAppStore((state) => state.setSimulateApiError);

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
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-start gap-2">
          <Button
            className="h-10 w-10 border-[#303030] bg-[#181818] text-zinc-200 hover:bg-[#242424]"
            size="icon"
            variant="outline"
            onClick={() => queryClient.invalidateQueries()}
            aria-label="Refetch"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex h-10 overflow-hidden rounded-md border border-[#303030] bg-[#181818]">
            <Button
              className="h-10 w-10 rounded-none border-0 bg-[#303030] text-white hover:bg-[#3a3a3a]"
              size="icon"
              variant="ghost"
              onClick={() => setSimulateApiError(!simulateApiError)}
              aria-label="Toggle mock error"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              className="h-10 w-10 rounded-none border-0 bg-transparent text-zinc-500 hover:bg-[#242424]"
              size="icon"
              variant="ghost"
              onClick={() => queryClient.invalidateQueries()}
              aria-label="Refresh data"
            >
              <Sun className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="h-16 w-16 rounded-2xl border-[#3a3a3a] bg-[#1d1d1d] text-zinc-300 hover:bg-[#252525]"
            size="icon"
            variant="outline"
            onClick={() => setMobilePanelOpen(true)}
            aria-label="Open inspector"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <LeftRail />
      <div className="relative z-10 min-h-screen">
        <main className="min-h-screen">
          <GraphCanvas />
        </main>
        <div className="fixed left-[92px] top-[72px] z-20 h-[330px] w-[324px] rounded-lg border border-[#141414] bg-black shadow-2xl">
          <div className="p-5">
            <div className="mb-5 text-lg font-semibold">Application</div>
            <div className="mb-3 flex gap-2">
              <div className="flex h-8 flex-1 items-center gap-2 rounded-md bg-[#1d2023] px-3 text-sm text-zinc-500">
                <span>Search...</span>
                <Search className="ml-auto h-4 w-4" />
              </div>
              <Button
                className="h-8 w-8 bg-[#2563eb] hover:bg-[#1d4ed8]"
                size="icon"
                onClick={() => setMobilePanelOpen(true)}
              >
                +
              </Button>
            </div>
            <Button
              className="mb-3 md:hidden"
              size="icon"
              onClick={() => setMobilePanelOpen(true)}
              aria-label="Open panel"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <AppMenu />
          </div>
          <div className="absolute right-2 top-28 h-[200px] w-1 rounded-full bg-zinc-500/50" />
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

function AppMenu() {
  const { data: apps, isError, isLoading } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const rows = [
    { id: 'commerce', name: 'supertokens-golang', icon: Zap, color: 'bg-[#6657f4]' },
    { id: 'ops', name: 'supertokens-java', icon: Settings, color: 'bg-[#8b5cf6]' },
    { id: 'analytics', name: 'supertokens-python', icon: RefreshCw, color: 'bg-[#ef4444]' },
    { id: 'ruby', name: 'supertokens-ruby', icon: Box, color: 'bg-[#d946ef]' },
    { id: 'go', name: 'supertokens-go', icon: Network, color: 'bg-[#8b5cf6]' },
  ];
  const availableIds = new Set((apps ?? []).map((app) => app.id));

  if (isLoading) {
    return <div className="text-sm text-zinc-500">Loading apps...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-400">Could not load apps.</div>;
  }

  return (
    <div className="space-y-2">
      {rows.map(({ id, name, icon: Icon, color }) => {
        const isAvailable = availableIds.has(id);
        const isSelected = selectedAppId === id;

        return (
        <button
          className={cn(
            'flex h-9 w-full items-center gap-3 rounded-md text-left text-sm font-semibold text-zinc-100 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45',
            isSelected && 'bg-white/5'
          )}
          key={name}
          type="button"
          disabled={!isAvailable}
          onClick={() => setSelectedAppId(id)}
        >
          <span
            className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-md text-white',
              color
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="flex-1">{name}</span>
          <span className="text-xl font-light text-zinc-300">›</span>
        </button>
        );
      })}
    </div>
  );
}
