
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import AboutUsPage from '../pages/AboutUs.jsx';

// Mocks vor dem Import initialisieren
const { mockSend, mockReset } = vi.hoisted(() => ({
    mockSend: vi.fn(),
    mockReset: vi.fn()
}));

// EmailJS Mock
vi.mock('@emailjs/browser', () => ({
    default: {
        send: mockSend
    }
}));

// Turnstile Mock
vi.mock('@marsidev/react-turnstile', async () => {
    const React = await import('react');

    return {
        Turnstile: React.forwardRef(({ onSuccess }, ref) => {
            React.useImperativeHandle(ref, () => ({
                reset: mockReset
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
        })
    };
});

// Animation Mocks
vi.mock('react-useanimations', () => ({
    default: () => (
        <div data-testid="mock-use-animation">
            Lock Icon
        </div>
    )
}));

vi.mock('react-useanimations/lib/lock', () => ({
    default: {}
}));

// EmailJS Import
import emailjs from '@emailjs/browser';

describe('AboutUsPage Component Tests', () => {
    let alertSpy;

    beforeEach(() => {
        vi.clearAllMocks();

        alertSpy = vi.spyOn(window, 'alert')
            .mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <AboutUsPage lang="de" />
            </BrowserRouter>
        );
    };

    // Hilfsfunktion für gültige Formulareingaben
    const fillValidForm = async (user) => {
        await user.type(
            screen.getByLabelText(/Nome/i),
            'Elias'
        );

        await user.type(
            screen.getByPlaceholderText(
                'Scrivi qui il tuo messaggio...'
            ),
            'Das ist eine Testnachricht mit mehr als zehn Zeichen.'
        );

        await user.click(screen.getByRole('checkbox'));
    };

    it('rendert die Komponente und wichtigste Elemente korrekt', () => {
        renderComponent();

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /Alcuni dei nostri lavori & Storia/i
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: /Titocci Metalcostruzioni SAGL/i
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                level: 3,
                name: /Dati Aziendali/i
            })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                'Scrivi qui il tuo messaggio...'
            )
        ).toBeInTheDocument();
    });

    it('zeigt einen Fehler an, wenn die Nachricht kürzer als 10 Zeichen ist', async () => {
        const user = userEvent.setup();

        renderComponent();

        await user.type(
            screen.getByLabelText(/Nome/i),
            'Elias'
        );

        await user.click(screen.getByRole('checkbox'));

        await user.type(
            screen.getByPlaceholderText(
                'Scrivi qui il tuo messaggio...'
            ),
            'Kurz'
        );

        await user.click(
            screen.getByRole('button', {
                name: /Invia Messaggio/i
            })
        );

        expect(alertSpy).toHaveBeenCalledWith(
            'Fehler beim Senden der Nachricht.'
        );

        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('bricht ab, wenn das Turnstile-Token fehlt', async () => {
        const user = userEvent.setup();

        renderComponent();

        await fillValidForm(user);

        await user.click(
            screen.getByRole('button', {
                name: /Invia Messaggio/i
            })
        );

        expect(alertSpy).toHaveBeenCalledWith(
            'Bitte bestätige, dass du kein Roboter bist (Turnstile).'
        );

        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('sendet die E-Mail erfolgreich und setzt Formular sowie Turnstile zurück', async () => {
        const user = userEvent.setup();

        mockSend.mockResolvedValueOnce({
            status: 200,
            text: 'OK'
        });

        renderComponent();

        await fillValidForm(user);

        await user.click(
            screen.getByTestId('mock-turnstile')
        );

        const textarea = screen.getByPlaceholderText(
            'Scrivi qui il tuo messaggio...'
        );

        await user.click(
            screen.getByRole('button', {
                name: /Invia Messaggio/i
            })
        );

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledWith(
                'service_qa3r1ej',
                'template_mrshrnl',
                expect.objectContaining({
                    message: 'Das ist eine Testnachricht mit mehr als zehn Zeichen.',
                    'g-recaptcha-response': 'fake-turnstile-token'
                }),
                'dFpVpt98rEIko4TLa'
            );

            expect(alertSpy).toHaveBeenCalledWith(
                'Vielen Dank! Deine Nachricht wurde erfolgreich versendet.'
            );
        });

        await waitFor(() => {
            expect(textarea).toHaveValue('');
            expect(mockReset).toHaveBeenCalledTimes(1);
        });
    });

    it('fängt Fehler beim Fehlschlagen des EmailJS-Versands sauber ab', async () => {
        const user = userEvent.setup();

        const consoleSpy = vi.spyOn(console, 'error')
            .mockImplementation(() => {});

        mockSend.mockRejectedValueOnce(
            new Error('Network Error')
        );

        renderComponent();

        await fillValidForm(user);

        await user.click(
            screen.getByTestId('mock-turnstile')
        );

        await user.click(
            screen.getByRole('button', {
                name: /Invia Messaggio/i
            })
        );

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledTimes(1);

            expect(alertSpy).toHaveBeenCalledWith(
                'Fehler beim Senden der Nachricht.'
            );
        });

        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
