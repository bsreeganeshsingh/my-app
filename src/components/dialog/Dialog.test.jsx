import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Dialog from './Dialog';

beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
});

afterAll(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
        document.body.removeChild(modalRoot);
    }
});

jest.mock('focus-trap-react', () => {
    return ({ children }) => <>{children}</>;
});

describe('Dialog', () => {
    const onCloseMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders with title and children', () => {
        render(
            <Dialog title="My Dialog" onClose={onCloseMock}>
                {/* Add tabbable element */}
                <button>Focusable Button</button>
            </Dialog>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('My Dialog')).toBeInTheDocument();
        expect(screen.getByText('Focusable Button')).toBeInTheDocument();
        expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        render(
            <Dialog title="Closable" onClose={onCloseMock}>
                <button>Focusable</button>
            </Dialog>
        );

        fireEvent.click(screen.getByLabelText('Close dialog'));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('renders without title', () => {
        render(
            <Dialog onClose={onCloseMock}>
                <input type="text" placeholder="Focusable input" />
            </Dialog>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Focusable input')).toBeInTheDocument();
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    test('renders into document.body when #modal-root is not present', () => {
        const modalRoot = document.getElementById('modal-root');
        document.body.removeChild(modalRoot);

        render(
            <Dialog title="Fallback" onClose={onCloseMock}>
                <span>Fallback test</span>
            </Dialog>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        // Re-add for other tests
        document.body.appendChild(modalRoot);
    });
});
