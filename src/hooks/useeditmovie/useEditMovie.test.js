import React, { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEditMovie } from './useEditMovie';
import api from '../../utils/api';

jest.mock('../../utils/api');

describe('useEditMovie hook', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false, // Disable retries to make test failures obvious
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('should call the API and return success data', async () => {
        const mockMovie = { id: 1, title: 'Test Movie', genre: 'Action' };
        const mockResponse = { success: true, movie: mockMovie };

        api.put.mockResolvedValueOnce({ data: mockResponse });

        const { result } = renderHook(() => useEditMovie(), { wrapper });

        act(() => {
            result.current.mutate(mockMovie);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(api.put).toHaveBeenCalledWith('/movies/', mockMovie);
        expect(api.put).toHaveBeenCalledTimes(1);
    });

    it('should handle error response', async () => {
        api.put.mockRejectedValueOnce(new Error('Failed to edit movie'));

        const { result } = renderHook(() => useEditMovie(), { wrapper });

        act(() => {
            result.current.mutate({ id: 1, title: 'Fail Movie' });
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(api.put).toHaveBeenCalledTimes(1);
    });
});
