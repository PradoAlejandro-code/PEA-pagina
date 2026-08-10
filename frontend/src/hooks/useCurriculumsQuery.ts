import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';

export interface Curriculum {
  id: number;
  major: string;
  institute: string;
  image_path: string;
  created_at: string;
}

const fetchCurriculums = async (): Promise<Curriculum[]> => {
  const { data } = await axiosClient.get('/curriculums');
  return data;
};

export const useCurriculumsQuery = () => {
  return useQuery({
    queryKey: ['curriculums'],
    queryFn: fetchCurriculums,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
