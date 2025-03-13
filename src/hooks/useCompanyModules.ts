import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyModulesApi, type CompanyModule } from '../lib/api';

export function useCompanyModules(companyId: string) {
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['company-modules', companyId],
    queryFn: () => companyModulesApi.getByCompanyId(companyId),
    enabled: !!companyId,
  });

  const createModule = useMutation({
    mutationFn: (newModule: Omit<CompanyModule, 'id' | 'created_at' | 'updated_at'>) =>
      companyModulesApi.create(newModule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules', companyId] });
    },
  });

  const updateModule = useMutation({
    mutationFn: ({ id, ...updates }: Partial<CompanyModule> & { id: string }) =>
      companyModulesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules', companyId] });
    },
  });

  return {
    modules,
    isLoading,
    createModule,
    updateModule,
  };
}