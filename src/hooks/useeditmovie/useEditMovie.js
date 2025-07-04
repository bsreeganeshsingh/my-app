import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';

const editMovie = async (movie) => {
    const { data } = await api.put(`/movies/`, movie);
    return data;
};

export const useEditMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editMovie,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
    });
};
