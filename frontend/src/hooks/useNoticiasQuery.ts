import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';

export interface Noticia {
  ID: number;
  Title: string;
  Text: string;
  ImagePath: string;
}

const fetchNoticias = async (): Promise<Noticia[]> => {
  const { data } = await axiosClient.get('/news');
  return data;
};

export const useNoticiasQuery = () => {
  return useQuery({
    queryKey: ['noticias'],
    queryFn: fetchNoticias,
  });
};
