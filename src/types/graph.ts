import type { Edge, Node } from '@xyflow/react';

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down';
export type NodeKind = 'service' | 'database';

export type AppSummary = {
  id: string;
  name: string;
  environment: string;
  owner: string;
};

export type ServiceNodeData = {
  label: string;
  description: string;
  status: NodeStatus;
  traffic: number;
  kind: NodeKind;
};

export type ServiceNode = Node<ServiceNodeData, 'service'>;
export type GraphEdge = Edge;

export type AppGraph = {
  nodes: ServiceNode[];
  edges: GraphEdge[];
};
