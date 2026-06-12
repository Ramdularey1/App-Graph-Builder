import { X } from 'lucide-react';
import type { ServiceNode } from '../../types/graph';
import { useApps } from '../../hooks/useApps';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { AppSelector } from './AppSelector';
import { NodeInspector } from './NodeInspector';

type RightPanelProps = {
  isDrawer?: boolean;
  selectedNode?: ServiceNode | null;
  onUpdateNode?: (nodeId: string, data: Partial<ServiceNode['data']>) => void;
  onDeleteNode?: () => void;
};

export function RightPanel({
  isDrawer = false,
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}: RightPanelProps) {
  const appsQuery = useApps();
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div>
          <h2 className="text-sm font-semibold">Workspace</h2>
          <p className="text-xs text-muted-foreground">Apps and node details</p>
        </div>
        {isDrawer ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobilePanelOpen(false)}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {appsQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : appsQuery.isError ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            Could not load apps. Toggle off mock error and refetch.
          </div>
        ) : (
          <AppSelector apps={appsQuery.data ?? []} />
        )}

        <div className="mt-6 border-t border-border pt-6">
          <NodeInspector
            node={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </div>
      </div>
    </div>
  );
}
