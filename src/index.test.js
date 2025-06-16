import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock ReactDOM.createRoot and reportWebVitals
jest.mock('react-dom/client', () => ({
    createRoot: jest.fn(() => ({
        render: jest.fn(),
    })),
}));
jest.mock('./reportWebVitals', () => jest.fn());

describe('index.js', () => {
    it('renders App inside React.StrictMode', () => {
        // Clear previous mocks
        jest.resetModules();
        const rootDiv = document.createElement('div');
        rootDiv.id = 'root';
        document.body.appendChild(rootDiv);

        require('./index.js');

        const { createRoot } = require('react-dom/client');
        expect(createRoot).toHaveBeenCalledWith(rootDiv);
        document.body.removeChild(rootDiv);
    });

    it('calls reportWebVitals', () => {
        jest.resetModules();
        require('./index.js');
        const reportWebVitals = require('./reportWebVitals');
        expect(reportWebVitals).toHaveBeenCalled();
    });
});