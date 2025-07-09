import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

const fetchMovies = async ({ queryKey }) => {
    const [, { search, genre, sortBy, sortOrder }] = queryKey;

    const params = {};
    if (search) {
        params.search = search;
        params.searchBy = 'title';
    }
    if (genre) params.filter = genre;
    if (sortBy) {
        params.sortBy = sortBy;
    }
    if (sortOrder) {
        params.sortOrder = sortOrder;
    }

    params.offset = 0;
    params.limit = 20;

    const { data } = await api.get('/movies', { params });

    return {
        movies: data.data,
        total: data.totalAmount,
        offset: data.offset,
        limit: data.limit,
    };
};

export const useMovies = ({ search = '', genre = '', sortBy = '', sortOrder = '' }) => {
    return useQuery({
        queryKey: ['movies', { search, genre, sortBy, sortOrder }],
        queryFn: fetchMovies,
    });
};
