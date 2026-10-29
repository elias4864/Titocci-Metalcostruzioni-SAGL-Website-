// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AboutUsPage from '../pages/AboutUs.jsx';
import emailjs from '@emailjs/browser';

// 1. Mocks für externe Bibliotheken
vi.mock('@emailjs/browser', () => ({
    default: {
        send: vi.fn(),
    },
}));

// Turnstile Mock inklusive Spying für den Reset-Aufruf
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
                    onClick={() => onSuccess('fake-turnstile-token')}
                >
                    Mock Turnstile Pass
                </button>
            );
        }),
    };
});

vi.mock('react-useanimations', () => ({
    default: () => <div data-testid="mock-use-animation">Lock Icon</div>,
}));

vi.mock('react-useanimations/lib/lock', () => ({
    default: {},
}));

describe('AboutUsPage Component Tests', () => {
    let alertSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        if (typeof globalThis.alert === 'function') {
            alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
        } else {
            globalThis.alert = vi.fn();
            alertSpy = globalThis.alert;
        }
    });

    afterEach(() => {
        if (alertSpy && typeof alertSpy.mockRestore === 'function') {
            alertSpy.mockRestore();
        }
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <AboutUsPage lang="de" />
            </BrowserRouter>
        );
    };

    it('rendert die Komponente und wichtigste Elemente korrekt', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 1, name: /Alcuni dei nostri lavori & Storia/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2, name: /Titocci Metalcostruzioni SAGL/i })).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Scrivi qui il tuo messaggio...')).toBeInTheDocument();
        });
    });

    it('zeigt einen Fehler (Alert) an, wenn die Nachricht kürzer als 10 Zeichen ist', async () => {
        const user = userEvent.setup();
        renderComponent();

        const textarea = screen.getByPlaceholderText('Scrivi qui il tuo messaggio...');
        const submitButton = screen.getByRole('button', { name: /Invia Messaggio/i });

        await user.type(textarea, 'Kurz');
        await user.click(submitButton);

        expect(alertSpy).toHaveBeenCalledWith('Fehler beim Senden der Nachricht.');
        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('bricht ab, wenn Turnstile-Token fehlt', async () => {
        const user = userEvent.setup();
        renderComponent();

        const textarea = screen.getByPlaceholderText('Scrivi qui il tuo messaggio...');
        const submitButton = screen.getByRole('button', { name: /Invia Messaggio/i });

        await user.type(textarea, 'Das ist eine ausreichend lange Testnachricht.');
        await user.click(submitButton);

        expect(alertSpy).toHaveBeenCalledWith('Bitte bestätige, dass du kein Roboter bist (Turnstile).');
        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('sendet die E-Mail erfolgreich ab und setzt das Formular sowie Turnstile zurück', async () => {
        const user = userEvent.setup();
        emailjs.send.mockResolvedValueOnce({ status: 200, text: 'OK' });

        renderComponent();

        const textarea = screen.getByPlaceholderText('Scrivi qui il tuo messaggio...');
        const submitButton = screen.getByRole('button', { name: /Invia Messaggio/i });
        const turnstileButton = screen.getByTestId('mock-turnstile');

        await user.click(turnstileButton);
        await user.type(textarea, 'Das ist eine Testnachricht mit mehr als zehn Zeichen.');
        await user.click(submitButton);

        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalledWith(
                'service_qa3r1ej',
                'template_mrshrnl',
                {
                    message: 'Das ist eine Testnachricht mit mehr als zehn Zeichen.',
                    'g-recaptcha-response': 'fake-turnstile-token',
                },
                'dFpVpt98rEIko4TLa'
            );
            expect(alertSpy).toHaveBeenCalledWith('Vielen Dank! Deine Nachricht wurde erfolgreich versendet.');
        });

        expect(textarea.value).toBe('');
        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('fängt Fehler beim Fehlschlagen des EmailJS-Versands sauber ab', async () => {
        const user = userEvent.setup();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        emailjs.send.mockRejectedValueOnce(new Error('Network Error'));

        renderComponent();

        const textarea = screen.getByPlaceholderText('Scrivi qui il tuo messaggio...');
        const submitButton = screen.getByRole('button', { name: /Invia Messaggio/i });
        const turnstileButton = screen.getByTestId('mock-turnstile');

        await user.click(turnstileButton);
        await user.type(textarea, 'Das ist eine Testnachricht mit mehr als zehn Zeichen.');
        await user.click(submitButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Fehler beim Senden der Nachricht.');
        });

        consoleSpy.mockRestore();
    });
});