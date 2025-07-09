import React from 'react';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useMovieById } from './useMovieById';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../utils/api';

jest.mock('../../utils/api');

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useMovieById', () => {
    it('should fetch movie data successfully', async () => {
        const mockMovie = { id: 1, title: 'Inception', genre: 'Sci-Fi' };
        api.get.mockResolvedValueOnce({ data: mockMovie });
        const { result } = renderHook(() => useMovieById(1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockMovie);
        expect(api.get).toHaveBeenCalledWith('/movies/1');
    });

    it('should handle error response', async () => {
        const axiosError = {
            isAxiosError: true,
            response: {
                status: 404,
                data: { message: 'Movie not found' }
            },
            message: 'Movie not found',
        };

        api.get.mockRejectedValueOnce(axiosError);

        const { result } = renderHook(() => useMovieById(2), {
            wrapper: createWrapper(),
        });

        await waitFor(() => result.current.isError === true, { timeout: 1000 });

        expect(result.current.error).toBeDefined();
        if (result.current.error) {
            expect(result.current.error.message).toBe('Movie not found');
        }
    });
});
