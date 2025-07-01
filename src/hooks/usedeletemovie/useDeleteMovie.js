import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';

export const useDeleteMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movieId) => {
            await api.delete(`/movies/${movieId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['movies']);
        },
    });
};
