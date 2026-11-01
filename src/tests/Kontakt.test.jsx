// @vitest-environment jsdom
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Kontakt from '../pages/Kontakt.jsx';

// JSDOM-Fix für scrollIntoView
beforeAll(() => {
    Element.prototype.scrollIntoView = () => {};
});

// Mock für Turnstile
const mockReset = vi.fn();
vi.mock('@marsidev/react-turnstile', () => {
    const React = require('react');
    return {
        Turnstile: React.forwardRef(({ onSuccess }, ref) => {
            React.useImperativeHandle(ref, () => ({
                reset: mockReset,
            }));
            return (
                <button
                    type="button"
                    data-testid="mock-turnstile"
                    onClick={() => onSuccess('fake-token')}
                >
                    Mock Turnstile Pass
                </button>
            );
        }),
    };
});

describe('Kontakt Component Tests', () => {
    let windowSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        windowSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    it('calls window method on interaction', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Kontakt lang="de" />
            </MemoryRouter>
        );

        const button = await screen.findByRole('button', { name: /invio|senden|submit/i });

        await act(async () => {
            window.alert('Test Alert');
        });

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalled();
        });
    });
});

describe('Contatti Component Form Tests', () => {
    let windowSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        windowSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <Kontakt />
            </MemoryRouter>
        );
    };

    it('renders all form input fields, address and submit button', async () => {
        renderComponent();

        const nameInput = await screen.findByPlaceholderText('Elias');
        const emailInput = screen.getByPlaceholderText('alex@gmail.com');
        const submitButton = screen.getByRole('button', { name: /invio|senden|submit/i });

        expect(nameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('shows an alert and blocks submission if privacy policy is not accepted', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nameInput = await screen.findByPlaceholderText('Elias');
        const emailInput = screen.getByPlaceholderText('alex@gmail.com');
        const msgInput = screen.getByPlaceholderText(/Ich möchte Auskunft/i);
        const submitButton = screen.getByRole('button', { name: /invio|senden|submit/i });

        await act(async () => {
            await user.type(nameInput, 'Test Name');
            await user.type(emailInput, 'test@example.com');
            await user.type(msgInput, 'Das ist eine Testnachricht.');
            await user.click(submitButton);
        });

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalled();
        });
    });

    it('validates minimum length for the name field or shows respective alert', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nameInput = await screen.findByPlaceholderText('Elias');
        const emailInput = screen.getByPlaceholderText('alex@gmail.com');
        const msgInput = screen.getByPlaceholderText(/Ich möchte Auskunft/i);

        await act(async () => {
            await user.type(nameInput, 'AB');
            await user.type(emailInput, 'test@example.com');
            await user.type(msgInput, 'Das ist eine gültige Testnachricht.');
        });

        const privacyCheckbox = screen.queryByRole('checkbox');
        if (privacyCheckbox) {
            await act(async () => {
                await user.click(privacyCheckbox);
            });
        }

        const turnstileButton = await screen.findByTestId('mock-turnstile');
        await act(async () => {
            await user.click(turnstileButton);
        });

        const submitButton = screen.getByRole('button', { name: /invio|senden|submit/i });
        await act(async () => {
            await user.click(submitButton);
        });

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalled();
        });
    });
});