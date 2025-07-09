import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMovies } from './useMovies';
import api from '../../utils/api';

jest.mock('../../utils/api');

describe('useMovies Hook', () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches movies successfully with search query only', async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, title: 'Movie 1' }],
                totalAmount: 1,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useMovies({ search: 'test' }), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            movies: mockResponse.data.data,
            total: mockResponse.data.totalAmount,
            offset: 0,
            limit: 20,
        });

        expect(api.get).toHaveBeenCalledWith('/movies', {
            params: {
                search: 'test',
                searchBy: 'title',
                offset: 0,
                limit: 20,
            },
        });
    });

    it('fetches with all query params', async () => {
        const mockResponse = {
            data: {
                data: [{ id: 2, title: 'Movie 2' }],
                totalAmount: 10,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const queryParams = {
            search: 'action',
            genre: 'Comedy',
            sortBy: 'release_date',
            sortOrder: 'desc',
        };

        const { result } = renderHook(() => useMovies(queryParams), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.get).toHaveBeenCalledWith('/movies', {
            params: {
                search: 'action',
                searchBy: 'title',
                filter: 'Comedy',
                sortBy: 'release_date',
                sortOrder: 'desc',
                offset: 0,
                limit: 20,
            },
        });
    });

    it('fetches with only genre param', async () => {
        const mockResponse = {
            data: {
                data: [{ id: 3, title: 'Comedy Movie' }],
                totalAmount: 5,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useMovies({ genre: 'Comedy' }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.get).toHaveBeenCalledWith('/movies', {
            params: {
                filter: 'Comedy',
                offset: 0,
                limit: 20,
            },
        });
    });

    it('fetches with only sort params', async () => {
        const mockResponse = {
            data: {
                data: [{ id: 4, title: 'Sorted Movie' }],
                totalAmount: 3,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useMovies({ sortBy: 'rating', sortOrder: 'asc' }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.get).toHaveBeenCalledWith('/movies', {
            params: {
                sortBy: 'rating',
                sortOrder: 'asc',
                offset: 0,
                limit: 20,
            },
        });
    });

    it('fetches with no params (defaults)', async () => {
        const mockResponse = {
            data: {
                data: [],
                totalAmount: 0,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useMovies({}), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.get).toHaveBeenCalledWith('/movies', {
            params: {
                offset: 0,
                limit: 20,
            },
        });
    });

    it('handles API error', async () => {
        api.get.mockRejectedValueOnce(new Error('API error'));

        const { result } = renderHook(() => useMovies({ search: 'fail' }), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeDefined();
        expect(result.current.error.message).toBe('API error');
    });

    it('does not refetch unnecessarily with same queryKey (caching)', async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, title: 'Cached Movie' }],
                totalAmount: 1,
                offset: 0,
                limit: 20,
            },
        };

        api.get.mockResolvedValueOnce(mockResponse);

        const wrapper = createWrapper();

        const { result, rerender } = renderHook(
            ({ search }) => useMovies({ search }),
            {
                wrapper,
                initialProps: { search: 'cached' },
            }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        rerender({ search: 'cached' });

        expect(api.get).toHaveBeenCalledTimes(1);
    });
});