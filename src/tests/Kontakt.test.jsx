// @vitest-environment jsdom
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import Kontakt from '../pages/Kontakt.jsx';
import emailjs from '@emailjs/browser';

// JSDOM-Fix für scrollIntoView
beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
});

// Mocks für externe Bibliotheken
vi.mock('@emailjs/browser', () => ({
    default: {
        send: vi.fn(),
    },
}));

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
                <Kontakt lang="de" />
            </MemoryRouter>
        );
    };

    it('renders all form input fields, address and submit button', async () => {
        act(async () => {
            renderComponent();
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Elias')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('alex@gmail.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Ich möchte Auskunft/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /INVIO/i })).toBeInTheDocument();
        });
    });

    it('shows an alert and blocks submission if privacy policy is not accepted', async () => {
        const user = userEvent.setup();

        act(async () => {
            renderComponent();
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Elias')).toBeInTheDocument();
        });

        act(async () => {
            await user.type(screen.getByPlaceholderText('Elias'), 'Test Name');
            await user.type(screen.getByPlaceholderText('alex@gmail.com'), 'Test Email');
            await user.type(screen.getByPlaceholderText(/Ich möchte Auskunft/i), 'Das ist eine Testnachricht.');
        });

        const submitButton = screen.getByRole('button', { name: /INVIO/i });

        act(async () => {
            await user.click(submitButton);
        });

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalled();
        });
    });

    it('validates minimum length for the name field', async () => {
        const user = userEvent.setup();

        act(async () => {
            renderComponent();
        });

        const turnstileButton = await screen.findByTestId('mock-turnstile');
        act(async () => {
            await user.click(turnstileButton);
        });

        const privacyCheckbox = screen.getByRole('checkbox');
        if (privacyCheckbox) {
            act(async () => {
                await user.click(privacyCheckbox);
            });
        }

        await waitFor(() => {
            expect(screen.getByPlaceholderText('alex@gmail.com')).toBeInTheDocument();
        });

        act(async () => {
            await user.type(screen.getByPlaceholderText('alex@gmail.com'), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/Ich möchte Auskunft/i), 'Das ist eine gültige Testnachricht.');
        });

        const nameInput = screen.getByPlaceholderText('Elias');
        act(async () => {
            await user.clear(nameInput);
            await user.type(nameInput, 'AB');
        });

        const submitButton = screen.getByRole('button', { name: /INVIO/i });
        act(async () => {
            await user.click(submitButton);
        });

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalledWith('Bitte gib einen gültigen Namen ein (mindestens 7 Zeichen)!');
        });
    });
});