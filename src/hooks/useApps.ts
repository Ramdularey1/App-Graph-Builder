import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApps, createApp, deleteApp } from '../api/mockApi';
import { useAppStore } from '../store/useAppStore';

export function useApps() {
  const simulateApiError = useAppStore((state) => state.simulateApiError);

  return useQuery({
    queryKey: ['apps', simulateApiError],
    queryFn: () => getApps(simulateApiError),
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  return useMutation({
    mutationFn: createApp,
    onSuccess: (newApp) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setSelectedAppId(newApp.id);
    },
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  return useMutation({
    mutationFn: deleteApp,
    onSuccess: (deletedAppId) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.removeQueries({ queryKey: ['graph', deletedAppId] });

      if (selectedAppId === deletedAppId) {
        const apps = queryClient
          .getQueryData<Awaited<ReturnType<typeof getApps>>>(['apps', false])
          ?.filter((app) => app.id !== deletedAppId);
        const nextApp = apps?.[0];

        if (nextApp) {
          setSelectedAppId(nextApp.id);
        }
      }
    },
  });
}
