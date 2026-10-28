// @vitest-environment jsdom
import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Kontakt from '../pages/Kontakt.jsx';
import '../Styles/TimeLineSection.css';
expect.extend(matchers);

const renderContatti = () => {
    return render(
        <BrowserRouter>
            <Kontakt lang="de" />
        </BrowserRouter>
    );
};

describe('Contatti Component Form Tests', () => {
    it('renders all form input fields and submit button', () => {
        const { container } = renderContatti();

        expect(container.querySelector('input[name="nome"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('textarea[name="messaggio"]')).toBeInTheDocument();
        expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
    });

    it('shows an alert and blocks submission if privacy policy is not accepted', async () => {
        const windowSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = renderContatti();

        const nomeInput = container.querySelector('input[name="nome"]');
        const emailInput = container.querySelector('input[name="email"]');
        const messaggioInput = container.querySelector('textarea[name="messaggio"]');
        const submitButton = container.querySelector('button[type="submit"]');

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
        const submitButton = container.querySelector('button[type="submit"]');

        fireEvent.change(nomeInput, { target: { value: 'Alex' } }); // Zu kurz (< 7 Zeichen)
        fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
        fireEvent.change(messaggioInput, { target: { value: 'Questo è un messaggio di test.' } });

        if (privacyCheckbox) {
            fireEvent.click(privacyCheckbox);
        }

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(windowSpy).toHaveBeenCalledWith('Bitte akzeptiere das Google-reCAPTCHA!');
        });

        windowSpy.mockRestore();
    });
});