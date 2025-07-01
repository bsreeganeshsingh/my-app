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
                    retry: false, // IMPORTANT: Disable retries for tests to avoid delayed error handling
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

    it('fetches movies successfully', async () => {
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
            offset: mockResponse.data.offset,
            limit: mockResponse.data.limit,
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
});
