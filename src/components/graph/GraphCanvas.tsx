import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeTypes,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import { Maximize2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { AppGraph, ServiceNode } from '../../types/graph';
import { useAppGraph } from '../../hooks/useAppGraph';
import { type AddNodeRequest, useAppStore } from '../../store/useAppStore';
import { RightPanel } from '../panel/RightPanel';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ServiceNodeCard } from './ServiceNodeCard';

const nodeTypes: NodeTypes = {
  service: ServiceNodeCard,
};
const MIN_ZOOM = 0.55;
const NODE_CARD_WIDTH = 360;
const NODE_CARD_HEIGHT = 230;
const NODE_COLUMN_GAP = 460;
const NODE_ROW_GAP = 300;
const STORAGE_PREFIX = 'app-graph-builder:graph:';

export function GraphCanvas() {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);
  const addNodeRequest = useAppStore((state) => state.addNodeRequest);
  const graphQuery = useAppGraph(selectedAppId);
  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const handledAddRequestIdRef = useRef<number | null>(null);
  const loadedGraphAppIdRef = useRef<string | null>(null);
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    if (graphQuery.data && selectedAppId) {
      const savedGraph = loadSavedGraph(selectedAppId);

      if (savedGraph) {
        setNodes(savedGraph.nodes);
        setEdges(savedGraph.edges);
      } else {
        setNodes(arrangeNodes(graphQuery.data.nodes));
        setEdges(graphQuery.data.edges);
      }

      setSelectedNodeId(null);
      loadedGraphAppIdRef.current = selectedAppId;
      skipNextSaveRef.current = true;
    }
  }, [graphQuery.data, selectedAppId, setEdges, setNodes, setSelectedNodeId]);

  useEffect(() => {
    loadedGraphAppIdRef.current = null;
  }, [selectedAppId]);

  useEffect(() => {
    if (
      !selectedAppId ||
      loadedGraphAppIdRef.current !== selectedAppId ||
      !nodes.length
    ) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    saveGraph(selectedAppId, { nodes, edges });
  }, [edges, nodes, selectedAppId]);

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

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((items) => items.filter((node) => node.id !== selectedNodeId));
    setEdges((items) =>
      items.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
  }, [selectedNodeId, setEdges, setNodes, setSelectedNodeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (isTyping || !selectedNodeId) {
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelectedNode();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelectedNode, selectedNodeId]);

  const addServiceNode = useCallback((template?: Omit<AddNodeRequest, 'id'>) => {
    const id = `service-${nodes.length + 1}`;
    const visibleCenter = getVisibleFlowCenter(flowWrapperRef.current);
    const nextNode: ServiceNode = {
      id,
      type: 'service',
      position: {
        x: visibleCenter.x - NODE_CARD_WIDTH / 2,
        y: visibleCenter.y - NODE_CARD_HEIGHT / 2,
      },
      data: {
        label: template?.label ?? 'New Service',
        description: template?.description ?? 'New service node.',
        status: template?.status ?? 'Healthy',
        traffic: template?.traffic ?? 50,
        kind: template?.kind ?? 'service',
      },
    };

    setNodes((items) => [...items, nextNode]);
    setSelectedNodeId(id);
  }, [nodes.length, setNodes, setSelectedNodeId]);

  useEffect(() => {
    if (
      !addNodeRequest ||
      handledAddRequestIdRef.current === addNodeRequest.id
    ) {
      return;
    }

    handledAddRequestIdRef.current = addNodeRequest.id;
    addServiceNode(addNodeRequest);
  }, [addNodeRequest, addServiceNode]);

  if (!selectedAppId) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-muted/20 p-6">
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-transparent">
      <div className="relative min-w-0">
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-wrap gap-2">
          <Button
            className="border-[#2f2f2f] bg-black/90 text-white hover:bg-[#171717]"
            size="sm"
            variant="outline"
            onClick={addServiceNode}
          >
            <Plus className="h-4 w-4" />
            Add node
          </Button>
          {selectedNode ? (
            <Button
              className="border-red-500/40 bg-red-950/80 text-red-100 hover:bg-red-900/80"
              size="sm"
              variant="outline"
              onClick={deleteSelectedNode}
            >
              <Trash2 className="h-4 w-4" />
              Delete selected
            </Button>
          ) : null}
          <Button
            className="border-[#2f2f2f] bg-black/90 text-white hover:bg-[#171717]"
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
            className="h-screen min-h-[720px]"
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
              defaultViewport={{ x: 0, y: 0, zoom: MIN_ZOOM }}
              minZoom={MIN_ZOOM}
              maxZoom={1.5}
              deleteKeyCode={['Backspace', 'Delete']}
              proOptions={{ hideAttribution: true }}
              className="dark-canvas-flow"
            >
              <CenterViewportBridge
                graphKey={selectedAppId}
                nodes={nodes}
              />
              <FitViewBridge />
              <Background
                color="#2c2c2c"
                gap={18}
                size={1.25}
                variant={BackgroundVariant.Dots}
              />
            <Controls className="graph-controls" />
            </ReactFlow>
          </div>
        )}
      </div>

      <div
        className={[
          'fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden',
          isMobilePanelOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setMobilePanelOpen(false)}
      />
      <aside
        className={[
          'fixed right-0 top-0 z-50 h-full w-[min(92vw,380px)] border-l border-[#2b2b2b] bg-black text-white shadow-2xl transition-transform',
          isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <RightPanel
          isDrawer
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteSelectedNode}
        />
      </aside>
    </section>
  );
}

function CenterViewportBridge({
  graphKey,
  nodes,
}: {
  graphKey: string;
  nodes: ServiceNode[];
}) {
  const { setViewport } = useReactFlow();
  const centeredGraphKey = useRef<string | null>(null);

  useEffect(() => {
    if (
      !nodes.length ||
      centeredGraphKey.current === graphKey
    ) {
      return;
    }

    centeredGraphKey.current = graphKey;

    window.requestAnimationFrame(() => {
      const container = document
        .querySelector('.dark-canvas-flow')
        ?.getBoundingClientRect();

      if (!container) {
        return;
      }

      const minX = Math.min(...nodes.map((node) => node.position.x));
      const minY = Math.min(...nodes.map((node) => node.position.y));
      const maxX = Math.max(
        ...nodes.map((node) => node.position.x + NODE_CARD_WIDTH)
      );
      const maxY = Math.max(
        ...nodes.map((node) => node.position.y + NODE_CARD_HEIGHT)
      );

      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const x = (container.width - graphWidth * MIN_ZOOM) / 2 - minX * MIN_ZOOM;
      const y =
        (container.height - graphHeight * MIN_ZOOM) / 2 - minY * MIN_ZOOM;

      void setViewport({ x, y, zoom: MIN_ZOOM }, { duration: 0 });
    });
  }, [graphKey, nodes, setViewport]);

  return null;
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

function storageKey(appId: string) {
  return `${STORAGE_PREFIX}${appId}`;
}

function loadSavedGraph(appId: string) {
  try {
    const saved = window.localStorage.getItem(storageKey(appId));
    if (!saved) {
      return null;
    }

    return JSON.parse(saved) as AppGraph;
  } catch {
    return null;
  }
}

function saveGraph(appId: string, graph: AppGraph) {
  window.localStorage.setItem(storageKey(appId), JSON.stringify(graph));
}

function arrangeNodes(nodes: ServiceNode[]) {
  return nodes.map((node, index) => {
    const row = Math.floor(index / 2);
    const column = index % 2;

    return {
      ...node,
      position: {
        x: column * NODE_COLUMN_GAP,
        y: row * NODE_ROW_GAP,
      },
    };
  });
}

function getVisibleFlowCenter(wrapper: HTMLDivElement | null) {
  if (!wrapper) {
    return { x: NODE_CARD_WIDTH / 2, y: NODE_CARD_HEIGHT / 2 };
  }

  const wrapperRect = wrapper.getBoundingClientRect();
  const viewport = wrapper.querySelector('.react-flow__viewport');
  const transform = viewport ? window.getComputedStyle(viewport).transform : '';
  const matrix = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform);
  const screenCenterX = wrapperRect.width / 2;
  const screenCenterY = wrapperRect.height / 2;

  return {
    x: (screenCenterX - matrix.m41) / matrix.a,
    y: (screenCenterY - matrix.m42) / matrix.d,
  };
}
