import { Menu, Network, PanelRightOpen, RefreshCw, Search } from 'lucide-react';
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
    if (!selectedAppId && apps?.[0]) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId, setSelectedAppId]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <LeftRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              className="lg:hidden"
              size="icon"
              variant="outline"
              onClick={() => setMobilePanelOpen(true)}
              aria-label="Open panel"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Network className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">
                App Graph Builder
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Service topology and runtime controls
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={simulateApiError ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSimulateApiError(!simulateApiError)}
            >
              Mock error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries()}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refetch</span>
            </Button>
            <Button
              className="hidden lg:inline-flex"
              variant="outline"
              size="sm"
              onClick={() => setMobilePanelOpen(true)}
            >
              <PanelRightOpen className="h-4 w-4" />
              Panel
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <GraphCanvas />
        </main>
      </div>
    </div>
  );
}

function LeftRail() {
  const items = [Network, Search, PanelRightOpen];

  return (
    <nav className="hidden w-16 shrink-0 flex-col items-center gap-3 border-r border-border bg-muted/25 py-4 md:flex">
      {items.map((Icon, index) => (
        <button
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            index === 0 && 'bg-background text-foreground shadow-sm'
          )}
          key={Icon.displayName ?? index}
          type="button"
          aria-label={`Navigation item ${index + 1}`}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
}
