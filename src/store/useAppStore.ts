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
  isAuthenticated: boolean;
  currentUser: { name: string; email: string } | null;
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  simulateApiError: boolean;
  addNodeRequest: AddNodeRequest | null;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
  setSelectedAppId: (appId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setSimulateApiError: (enabled: boolean) => void;
  requestAddNode: (node: Omit<AddNodeRequest, 'id'>) => void;
};

const SELECTED_APP_STORAGE_KEY = 'app-graph-builder:selected-app-id';
const CURRENT_USER_STORAGE_KEY = 'app-graph-builder:current-user';

const getInitialUser = () => {
  try {
    const saved = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

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
  isAuthenticated: !!getInitialUser(),
  currentUser: getInitialUser(),
  selectedAppId: getInitialSelectedAppId(),
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  simulateApiError: false,
  addNodeRequest: null,
  login: (user) =>
    set(() => {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return { isAuthenticated: true, currentUser: user };
    }),
  logout: () =>
    set(() => {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      return {
        isAuthenticated: false,
        currentUser: null,
        selectedNodeId: null,
        isMobilePanelOpen: false,
      };
    }),
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
