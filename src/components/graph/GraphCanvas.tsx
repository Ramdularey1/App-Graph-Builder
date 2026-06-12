import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeTypes,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import { Maximize2, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { AppGraph, ServiceNode } from '../../types/graph';
import { useAppGraph } from '../../hooks/useAppGraph';
import { useAppStore } from '../../store/useAppStore';
import { RightPanel } from '../panel/RightPanel';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ServiceNodeCard } from './ServiceNodeCard';

const nodeTypes: NodeTypes = {
  service: ServiceNodeCard,
};

export function GraphCanvas() {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);
  const graphQuery = useAppGraph(selectedAppId);
  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const flowWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphQuery.data) {
      setNodes(graphQuery.data.nodes);
      setEdges(graphQuery.data.edges);
      setSelectedNodeId(null);
    }
  }, [graphQuery.data, setEdges, setNodes, setSelectedNodeId]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((items) => addEdge(connection, items)),
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const nodeId = selectedNodes[0]?.id ?? null;
      setSelectedNodeId(nodeId);
      if (nodeId && window.innerWidth < 1024) {
        setMobilePanelOpen(true);
      }
    },
    [setMobilePanelOpen, setSelectedNodeId]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<ServiceNode['data']>) => {
      setNodes((items) =>
        items.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

  const addServiceNode = () => {
    const id = `service-${nodes.length + 1}`;
    const nextNode: ServiceNode = {
      id,
      type: 'service',
      position: { x: 160 + nodes.length * 32, y: 260 + nodes.length * 18 },
      data: {
        label: 'New Service',
        description: 'New service node.',
        status: 'Healthy',
        traffic: 50,
        kind: 'service',
      },
    };

    setNodes((items) => [...items, nextNode]);
    setSelectedNodeId(id);
  };

  if (!selectedAppId) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-muted/20 p-6">
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  return (
    <section className="relative grid min-h-[calc(100vh-4rem)] grid-cols-1 bg-muted/20 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative min-w-0">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={addServiceNode}>
            <Plus className="h-4 w-4" />
            Add node
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.dispatchEvent(new Event('app-graph-fit-view'));
            }}
          >
            <Maximize2 className="h-4 w-4" />
            Fit
          </Button>
        </div>

        {graphQuery.isLoading ? (
          <div className="grid h-full min-h-[calc(100vh-4rem)] place-items-center p-6">
            <div className="w-full max-w-lg space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        ) : graphQuery.isError ? (
          <div className="grid h-full min-h-[calc(100vh-4rem)] place-items-center p-6">
            <div className="max-w-md rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              Could not load this graph. Toggle off mock error and refetch from
              the top bar.
            </div>
          </div>
        ) : (
          <div
            ref={flowWrapperRef}
            className="h-[calc(100vh-4rem)] min-h-[560px]"
          >
            <ReactFlow<AppGraph['nodes'][number]>
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={onSelectionChange}
              onNodesDelete={() => setSelectedNodeId(null)}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              proOptions={{ hideAttribution: true }}
            >
              <FitViewBridge />
              <Background
                color="#94a3b8"
                gap={22}
                size={1.5}
                variant={BackgroundVariant.Dots}
              />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>
        )}
      </div>

      <aside className="hidden border-l border-border bg-background lg:block">
        <RightPanel selectedNode={selectedNode} onUpdateNode={updateNodeData} />
      </aside>

      <div
        className={[
          'fixed inset-0 z-40 bg-slate-950/40 opacity-0 pointer-events-none transition-opacity lg:hidden',
          isMobilePanelOpen ? 'pointer-events-auto opacity-100' : '',
        ].join(' ')}
        onClick={() => setMobilePanelOpen(false)}
      />
      <aside
        className={[
          'fixed right-0 top-0 z-50 h-full w-[min(92vw,380px)] translate-x-full border-l border-border bg-background shadow-2xl transition-transform lg:hidden',
          isMobilePanelOpen ? 'translate-x-0' : '',
        ].join(' ')}
      >
        <RightPanel
          isDrawer
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
        />
      </aside>
    </section>
  );
}

function FitViewBridge() {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const fit = () => {
      void fitView({ padding: 0.25, duration: 300 });
    };
    window.addEventListener('app-graph-fit-view', fit);
    return () => window.removeEventListener('app-graph-fit-view', fit);
  }, [fitView]);

  return null;
}
