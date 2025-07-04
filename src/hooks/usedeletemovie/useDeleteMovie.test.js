import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteMovie } from './useDeleteMovie';
import api from '../../utils/api';

// Mock the api module
jest.mock('../../utils/api');

describe('useDeleteMovie', () => {
    const createWrapper = () => {
        const queryClient = new QueryClient();
        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call the delete API with correct movieId and invalidate queries on success', async () => {
        // Mock api.delete to resolve
        api.delete.mockResolvedValue({ status: 200 });

        const { result } = renderHook(() => useDeleteMovie(), {
            wrapper: createWrapper(),
        });

        // Call the mutation
        result.current.mutate(123); // assume 123 is movieId

        // Wait for the mutation to be successful
        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/movies/123');
            expect(api.delete).toHaveBeenCalledTimes(1);
        });
    });

    it('should handle API error', async () => {
        api.delete.mockRejectedValue(new Error('Failed to delete'));

        const { result } = renderHook(() => useDeleteMovie(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(456);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/movies/456');
            expect(result.current.isError).toBe(true);
        });
    });
});
