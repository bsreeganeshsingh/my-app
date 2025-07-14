import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

export function useMovieById(id) {
    return useQuery({
        queryKey: ['movie', id],
        queryFn: async () => {
            const response = await api.get(`/movies/${id}`);
            return response.data;
        },
        enabled: !!id
    });
}