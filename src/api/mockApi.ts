import type { AppGraph, AppSummary } from '../types/graph';

const apps: AppSummary[] = [
  {
    id: 'commerce',
    name: 'supertokens-golang',
    environment: 'Production',
    owner: 'Growth',
  },
  {
    id: 'ops',
    name: 'supertokens-java',
    environment: 'Staging',
    owner: 'Platform',
  },
  {
    id: 'analytics',
    name: 'supertokens-python',
    environment: 'Sandbox',
    owner: 'Data',
  },
];

const graphs: Record<string, AppGraph> = {
  commerce: {
    nodes: [
      {
        id: 'gateway',
        type: 'service',
        position: { x: 420, y: 160 },
        data: {
          label: 'Node',
          description: 'Routes storefront and partner traffic.',
          status: 'Healthy',
          traffic: 76,
          kind: 'service',
        },
      },
      {
        id: 'checkout',
        type: 'service',
        position: { x: 785, y: 210 },
        data: {
          label: 'Postgres',
          description: 'Owns payment intent and order submission.',
          status: 'Healthy',
          traffic: 58,
          kind: 'database',
        },
      },
      {
        id: 'orders-db',
        type: 'service',
        position: { x: 350, y: 480 },
        data: {
          label: 'Redis',
          description: 'Primary order storage cluster.',
          status: 'Down',
          traffic: 44,
          kind: 'database',
        },
      },
      {
        id: 'mongo-db',
        type: 'service',
        position: { x: 835, y: 530 },
        data: {
          label: 'Mongodb',
          description: 'Document store for application metadata.',
          status: 'Down',
          traffic: 66,
          kind: 'database',
        },
      },
    ],
    edges: [
      { id: 'gateway-checkout', source: 'gateway', target: 'checkout' },
      { id: 'checkout-orders', source: 'checkout', target: 'orders-db' },
      { id: 'checkout-mongo', source: 'checkout', target: 'mongo-db' },
    ],
  },
  ops: {
    nodes: [
      {
        id: 'scheduler',
        type: 'service',
        position: { x: 80, y: 90 },
        data: {
          label: 'Job Scheduler',
          description: 'Coordinates recurring operational tasks.',
          status: 'Healthy',
          traffic: 34,
          kind: 'service',
        },
      },
      {
        id: 'worker',
        type: 'service',
        position: { x: 390, y: 120 },
        data: {
          label: 'Worker Pool',
          description: 'Runs queue-backed jobs and retries.',
          status: 'Healthy',
          traffic: 63,
          kind: 'service',
        },
      },
      {
        id: 'audit',
        type: 'service',
        position: { x: 690, y: 80 },
        data: {
          label: 'Audit Sink',
          description: 'Collects operator actions and system events.',
          status: 'Down',
          traffic: 19,
          kind: 'database',
        },
      },
    ],
    edges: [
      { id: 'scheduler-worker', source: 'scheduler', target: 'worker' },
      { id: 'worker-audit', source: 'worker', target: 'audit' },
    ],
  },
  analytics: {
    nodes: [
      {
        id: 'ingest',
        type: 'service',
        position: { x: 70, y: 170 },
        data: {
          label: 'Event Ingest',
          description: 'Accepts application events from clients.',
          status: 'Healthy',
          traffic: 88,
          kind: 'service',
        },
      },
      {
        id: 'stream',
        type: 'service',
        position: { x: 400, y: 70 },
        data: {
          label: 'Stream Processor',
          description: 'Enriches events before storage.',
          status: 'Degraded',
          traffic: 71,
          kind: 'service',
        },
      },
      {
        id: 'warehouse',
        type: 'service',
        position: { x: 710, y: 210 },
        data: {
          label: 'Warehouse',
          description: 'Columnar analytics store.',
          status: 'Healthy',
          traffic: 52,
          kind: 'database',
        },
      },
    ],
    edges: [
      { id: 'ingest-stream', source: 'ingest', target: 'stream' },
      { id: 'stream-warehouse', source: 'stream', target: 'warehouse' },
    ],
  },
};

const cloneGraph = (graph: AppGraph): AppGraph => ({
  nodes: graph.nodes.map((node) => ({
    ...node,
    position: { ...node.position },
    data: { ...node.data },
  })),
  edges: graph.edges.map((edge) => ({ ...edge })),
});

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export async function getApps(shouldFail = false): Promise<AppSummary[]> {
  await wait(500);
  if (shouldFail) {
    throw new Error('Mock API error while loading apps.');
  }

  return apps;
}

export async function getAppGraph(
  appId: string,
  shouldFail = false
): Promise<AppGraph> {
  await wait(650);
  if (shouldFail) {
    throw new Error('Mock API error while loading the graph.');
  }

  const graph = graphs[appId];
  if (!graph) {
    throw new Error(`No mock graph found for app "${appId}".`);
  }

  return cloneGraph(graph);
}
