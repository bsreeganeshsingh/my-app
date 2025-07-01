import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

const fetchMovies = async ({ queryKey }) => {
    const [_key, { search, genre, sortBy }] = queryKey;

    const params = {};
    if (search) {
        params.search = search;
        params.searchBy = 'title';
    }
    if (genre) params.filter = genre;
    if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = 'asc';
    }
    params.offset = 0;
    params.limit = 20;

    console.log("params: " + params.data);

    const { data } = await api.get('/movies', { params });

    return {
        movies: data.data,
        total: data.totalAmount,
        offset: data.offset,
        limit: data.limit,
    };
};

export const useMovies = ({ search = '', genre = '', sortBy = '' }) => {
    return useQuery({
        queryKey: ['movies', { search, genre, sortBy }],
        queryFn: fetchMovies,
    });
};
