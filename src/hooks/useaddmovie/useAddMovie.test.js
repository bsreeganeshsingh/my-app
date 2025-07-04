import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddMovie } from './useAddMovie';
import api from '../../utils/api';

// Mock API
jest.mock('../../utils/api');

describe('useAddMovie', () => {
    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('should add a movie and invalidate movies query', async () => {
        const mockMovie = { id: 1, title: 'Inception' };
        const postMock = api.post.mockResolvedValue({ data: mockMovie });

        const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useAddMovie(), { wrapper });

        // Trigger mutation
        result.current.mutate(mockMovie);

        // Wait for success
        await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1));

        // Check API called with correct arguments
        expect(postMock).toHaveBeenCalledWith('/movies', mockMovie);

        // Check invalidateQueries is called with the right key
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['movies'] });
    });
});
