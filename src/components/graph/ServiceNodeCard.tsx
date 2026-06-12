import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Server,
  Settings,
} from 'lucide-react';
import type { ServiceNode } from '../../types/graph';
import { cn } from '../../lib/utils';

export function ServiceNodeCard({ data, selected }: NodeProps<ServiceNode>) {
  const Icon = data.kind === 'database' ? Database : Server;
  const isHealthy = data.status === 'Healthy';

  return (
    <div
      className={cn(
        'w-[300px] rounded-lg border border-[#111] bg-black p-4 text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-shadow sm:w-[360px] sm:p-5',
        selected && 'border-[#2563eb] shadow-[0_0_0_1px_rgba(37,99,235,0.6),0_16px_36px_rgba(0,0,0,0.5)]'
      )}
    >
      <Handle
        className="!h-3 !w-3 !border-2 !border-black !bg-emerald-400 !opacity-100"
        position={Position.Left}
        type="target"
      />
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-white text-slate-900">
            <Icon className="h-4 w-4" />
          </div>
          <div className="truncate text-sm font-semibold sm:text-base">{data.label}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md border border-emerald-500/70 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
            $0.03/HR
          </span>
          <button
            className="grid h-8 w-8 place-items-center rounded-md bg-[#0f172a] text-slate-200"
            type="button"
            aria-label="Node settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-4 text-center text-xs text-white">
        <span>0.02</span>
        <span>0.05 GB</span>
        <span>10.00 GB</span>
        <span>1</span>
      </div>

      <div className="mb-4 grid grid-cols-4 overflow-hidden rounded-md bg-[#111a2e] text-[10px] font-semibold text-slate-300 sm:text-xs">
        <div className="flex h-8 items-center justify-center gap-1 rounded-md bg-white text-slate-950">
          <Cpu className="h-3.5 w-3.5" />
          CPU
        </div>
        <div className="flex h-8 items-center justify-center gap-1">
          <MemoryStick className="hidden h-3.5 w-3.5 sm:block" />
          Memory
        </div>
        <div className="flex h-8 items-center justify-center gap-1">
          <HardDrive className="hidden h-3.5 w-3.5 sm:block" />
          Disk
        </div>
        <div className="flex h-8 items-center justify-center gap-1">
          <Database className="hidden h-3.5 w-3.5 sm:block" />
          Region
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#2c78ff] via-[#21c55d] to-[#ef4444]">
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white"
            style={{ left: `calc(${data.traffic}% - 7px)` }}
          />
        </div>
        <div className="grid h-8 w-16 place-items-center rounded-md border border-[#171717] bg-black text-sm text-zinc-200 sm:w-20">
          0.02
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold',
            isHealthy
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          )}
        >
          {isHealthy ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {isHealthy ? 'Success' : 'Error'}
        </span>
        <div className="text-2xl font-bold tracking-tight text-[#ff9f1a]">
          aws
        </div>
      </div>
      <Handle
        className="!h-3 !w-3 !border-2 !border-black !bg-blue-400 !opacity-100"
        position={Position.Right}
        type="source"
      />
    </div>
  );
}
