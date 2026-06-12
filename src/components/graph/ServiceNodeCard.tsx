import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Database, Server } from 'lucide-react';
import type { ServiceNode } from '../../types/graph';
import { cn } from '../../lib/utils';

export function ServiceNodeCard({ data, selected }: NodeProps<ServiceNode>) {
  const Icon = data.kind === 'database' ? Database : Server;

  return (
    <div
      className={cn(
        'min-w-52 rounded-md border border-border bg-background p-3 shadow-sm transition-shadow',
        selected && 'border-primary shadow-lg shadow-primary/10'
      )}
    >
      <Handle className="!bg-primary" position={Position.Left} type="target" />
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{data.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {data.status} · {data.traffic}%
          </div>
        </div>
      </div>
      <Handle className="!bg-primary" position={Position.Right} type="source" />
    </div>
  );
}
