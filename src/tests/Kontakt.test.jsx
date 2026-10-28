// @vitest-environment jsdom
import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Kontakt from '../pages/Kontakt.jsx';
import { Turnstile } from '@marsidev/react-turnstile';
import '../Styles/TimeLineSection.css';

const renderContatti = () => {
    return render(
        <BrowserRouter>
            <Kontakt lang="de" />
        </BrowserRouter>
    );
};

describe('Contatti Component Form Tests', () => {
    it('renders all form input fields, address and submit button', () => {
        const { container } = renderContatti();

        expect(container.querySelector('input[name="nome"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('textarea[name="messaggio"]')).toBeInTheDocument();

        expect(screen.getByText(/In di Salécc 2/i)).toBeInTheDocument();
        expect(screen.getByText(/6670 Avegno/i)).toBeInTheDocument();

        expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('shows an alert and blocks submission if privacy policy is not accepted', async () => {
        const windowSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = renderContatti();

        const nomeInput = container.querySelector('input[name="nome"]');
        const emailInput = container.querySelector('input[name="email"]');
        const messaggioInput = container.querySelector('textarea[name="messaggio"]');
        const submitButton = container.querySelector('button');

        fireEvent.change(nomeInput, { target: { value: 'Alexandre' } });
        fireEvent.change(emailInput, { target: { value: 'alex@gmail.com' } });
        fireEvent.change(messaggioInput, { target: { value: 'Ich möchte Auskunft über die Dienstleistungen der Titocci Metalcostruzioni SAGL erhalten...' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalledWith('Si prega di accettare la privacy policy.');
        });

        windowSpy.mockRestore();
    });

    it('validates minimum length for the name field', async () => {
        const windowSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = renderContatti();

        const nomeInput = container.querySelector('input[name="nome"]');
        const emailInput = container.querySelector('input[name="email"]');
        const messaggioInput = container.querySelector('textarea[name="messaggio"]');
        const privacyCheckbox = container.querySelector('input[type="checkbox"]');
        const submitButton = container.querySelector('button');

        fireEvent.change(nomeInput, { target: { value: 'Alex' } }); // Zu kurz (< 7 Zeichen)
        fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
        fireEvent.change(messaggioInput, { target: { value: 'Questo è un messaggio di test.' } });

        if (privacyCheckbox) {
            fireEvent.click(privacyCheckbox);
        }

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalledWith('Bitte gib einen gültigen Namen ein (mindestens 7 Zeichen)!');
        });

        windowSpy.mockRestore();
    });
});