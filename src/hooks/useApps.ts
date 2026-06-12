import { useQuery } from '@tanstack/react-query';
import { getApps } from '../api/mockApi';
import { useAppStore } from '../store/useAppStore';

export function useApps() {
  const simulateApiError = useAppStore((state) => state.simulateApiError);

  return useQuery({
    queryKey: ['apps', simulateApiError],
    queryFn: () => getApps(simulateApiError),
  });
}
