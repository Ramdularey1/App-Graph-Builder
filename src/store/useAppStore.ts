import { create } from 'zustand';

type InspectorTab = 'config' | 'runtime';
export type AddNodeRequest = {
  id: number;
  label: string;
  description: string;
  kind: 'service' | 'database';
  status: 'Healthy' | 'Degraded' | 'Down';
  traffic: number;
};

type AppUiState = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  simulateApiError: boolean;
  addNodeRequest: AddNodeRequest | null;
  setSelectedAppId: (appId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setSimulateApiError: (enabled: boolean) => void;
  requestAddNode: (node: Omit<AddNodeRequest, 'id'>) => void;
};

const SELECTED_APP_STORAGE_KEY = 'app-graph-builder:selected-app-id';

const getInitialSelectedAppId = () => {
  try {
    return window.localStorage.getItem(SELECTED_APP_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistSelectedAppId = (appId: string) => {
  window.localStorage.setItem(SELECTED_APP_STORAGE_KEY, appId);
};

export const useAppStore = create<AppUiState>((set) => ({
  selectedAppId: getInitialSelectedAppId(),
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  simulateApiError: false,
  addNodeRequest: null,
  setSelectedAppId: (appId) =>
    set(() => {
      persistSelectedAppId(appId);
      return { selectedAppId: appId, selectedNodeId: null };
    }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setSimulateApiError: (enabled) => set({ simulateApiError: enabled }),
  requestAddNode: (node) =>
    set({
      addNodeRequest: {
        ...node,
        id: Date.now(),
      },
    }),
}));
