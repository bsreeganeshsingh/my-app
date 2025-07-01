import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';

const addMovie = async (movie) => {
    const { data } = await api.post('/movies', movie);
    return data;
};

export const useAddMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addMovie,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
    });
};
