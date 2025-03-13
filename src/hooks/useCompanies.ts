import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi, type Company } from '../lib/api';

export function useCompanies() {
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
  });

  const createCompany = useMutation({
    mutationFn: (newCompany: Omit<Company, 'id' | 'created_at' | 'updated_at'>) =>
      companiesApi.create(newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const updateCompany = useMutation({
    mutationFn: ({ id, ...updates }: Partial<Company> & { id: string }) =>
      companiesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return {
    companies,
    isLoading,
    createCompany,
    updateCompany,
  };
}