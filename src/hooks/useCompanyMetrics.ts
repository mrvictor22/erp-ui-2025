import { useQuery } from '@tanstack/react-query';
import { companyMetricsApi } from '../lib/api';

export function useCompanyMetrics(companyId: string) {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['company-metrics', companyId],
    queryFn: () => companyMetricsApi.getCurrent(companyId),
    enabled: !!companyId,
  });

  const { data: metricsHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['company-metrics-history', companyId],
    queryFn: () => companyMetricsApi.getHistory(companyId),
    enabled: !!companyId,
  });

  return {
    metrics,
    metricsHistory,
    isLoading,
    isLoadingHistory,
  };
}