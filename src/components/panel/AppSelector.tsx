import type { AppSummary } from '../../types/graph';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

type AppSelectorProps = {
  apps: AppSummary[];
};

export function AppSelector({ apps }: AppSelectorProps) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Apps</h3>
        <Badge variant="neutral">{apps.length} total</Badge>
      </div>
      <div className="space-y-2">
        {apps.map((app) => (
          <button
            className={cn(
              'w-full rounded-md border border-border bg-background p-3 text-left transition-colors hover:bg-accent',
              selectedAppId === app.id && 'border-primary bg-primary/5'
            )}
            key={app.id}
            type="button"
            onClick={() => setSelectedAppId(app.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{app.name}</span>
              <span className="text-xs text-muted-foreground">
                {app.environment}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Owner: {app.owner}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
