import { Trash2 } from 'lucide-react';
import type { ServiceNode } from '../../types/graph';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

type NodeInspectorProps = {
  node?: ServiceNode | null;
  onUpdateNode?: (nodeId: string, data: Partial<ServiceNode['data']>) => void;
  onDeleteNode?: () => void;
};

const statusVariant = {
  Healthy: 'healthy',
  Degraded: 'degraded',
  Down: 'down',
} as const;

export function NodeInspector({
  node,
  onUpdateNode,
  onDeleteNode,
}: NodeInspectorProps) {
  const activeInspectorTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useAppStore(
    (state) => state.setActiveInspectorTab
  );

  if (!node) {
    return (
      <section className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        Select a service node on the canvas to edit its config and runtime
        values.
      </section>
    );
  }

  const updateNode = (data: Partial<ServiceNode['data']>) => {
    onUpdateNode?.(node.id, data);
  };

  const traffic = node.data.traffic;

  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Service Node</h3>
          <p className="text-xs text-muted-foreground">{node.id}</p>
        </div>
        <Badge variant={statusVariant[node.data.status]}>
          {node.data.status}
        </Badge>
      </div>

      <Tabs
        value={activeInspectorTab}
        onValueChange={(value) =>
          setActiveInspectorTab(value as 'config' | 'runtime')
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Node name
            </span>
            <Input
              value={node.data.label}
              onChange={(event) => updateNode({ label: event.target.value })}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Description
            </span>
            <Textarea
              value={node.data.description}
              onChange={(event) =>
                updateNode({ description: event.target.value })
              }
            />
          </label>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Traffic weight
              </span>
              <span className="text-xs text-muted-foreground">0-100</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[traffic]}
              onValueChange={([value]) => updateNode({ traffic: value ?? 0 })}
            />
            <Input
              min={0}
              max={100}
              type="number"
              value={traffic}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                updateNode({
                  traffic: Math.max(0, Math.min(100, nextValue || 0)),
                });
              }}
            />
          </div>
          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="font-medium">{node.data.kind.toUpperCase()}</div>
            <p className="mt-1 text-muted-foreground">
              Runtime edits are stored directly on the selected ReactFlow node
              data.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Button
        className="mt-5 w-full border-red-500/40 bg-red-950/60 text-red-100 hover:bg-red-900/70"
        variant="outline"
        onClick={onDeleteNode}
      >
        <Trash2 className="h-4 w-4" />
        Delete selected node
      </Button>
    </section>
  );
}
