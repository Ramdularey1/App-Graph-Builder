import { useQuery } from '@tanstack/react-query';
import { getAppGraph } from '../api/mockApi';
import { useAppStore } from '../store/useAppStore';

export function useAppGraph(appId: string | null) {
  const simulateApiError = useAppStore((state) => state.simulateApiError);

  return useQuery({
    queryKey: ['app-graph', appId, simulateApiError],
    queryFn: () => getAppGraph(appId ?? '', simulateApiError),
    enabled: Boolean(appId),
  });
}
