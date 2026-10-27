// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import StatCard from '../pages/StatCard.jsx';
import ChiSiamo from '../pages/Chi Siamo.jsx';

// WICHTIG: Bindet die Jest-DOM Matcher (wie toBeInTheDocument) für Vitest an!
expect.extend(matchers);

// Mocks für Assets
vi.mock('../assets/PC.png', () => ({ default: 'PC.png' }));
vi.mock('../assets/Schleifbild.jpg', () => ({ default: 'Schleifen.jfif' }));
vi.mock('../assets/Schleifpapier.jpg', () => ({ default: 'Schleifpapier.jfif' }));
vi.mock('../assets/Bauplan.jfif', () => ({ default: 'Bauplan.jfif' }));
vi.mock('../assets/Zangen.jfif', () => ({ default: 'Zangen.jfif' }));
vi.mock('../assets/Redfacebook.jfif', () => ({ default: 'Redfacebook.jfif' }));

// Mock für StatCard
vi.mock('../pages/StatCard', () => ({
    default: ({ value, suffix = '', label }) => (
        <div data-testid="stat-card">
            <span>{value}{suffix}</span>
            <span>{label}</span>
        </div>
    )
}));

describe('Chi Siamo Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <ChiSiamo />
            </MemoryRouter>
        );

    it('rendert die Chi Siamo Seite und wichtige Inhalte korrekt', () => {
        renderComponent();
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
    });

    it('enthält die Präsentations-Überschrift', () => {
        renderComponent();
        const elements = screen.getAllByText(/Presentazione/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    });

    it('die einzelnen Sektionen wie Fondazione rendern korrekt', () => {
        renderComponent();
        const elements = screen.getAllByText(/Fondazione/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    });


    it('die einzelnen Sections',()=>{
        renderComponent();
        const elements = screen.getAllByText(/Titocci Metalcostruzioni SAGL/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    })

    it('Div-Section mit Bild', () => {
        renderComponent();

        // Sucht flexibel, selbst wenn ein <br /> dazwischen liegt
        const elements2 = screen.getAllByText((content, element) => {
            return content.includes('Il Fabbro') && content.includes('creazioni personalizzate');
        });

        expect(elements2.length).toBeGreaterThan(0);
        expect(elements2[0]).toBeInTheDocument();
    });


    it('Chi-Siamo Section',()=>{
        renderComponent();
        const element3 = screen.getAllByText((content, element) => {
            return content.includes(' Passato qualche anno, visto il costante aumento della mole di lavoro e\n' +'inserimento di personale, sorge l\'esigenza di trasferirsi in un\'officina più grande.');
        })

        expect(element3.length).toBeGreaterThan(0)
        expect(element3[0]).toBeInTheDocument();
    });
    it('die einzelnen Sections', () => {
        renderComponent();

        // Flexible Suche per Funktion, die Zeilenumbrüche und Leerzeichen ignoriert
        const elements2 = screen.getAllByText((content, element) => {
            return content.includes('Il Fabbro') && content.includes('creazioni personalizzate');
        });

        expect(elements2.length).toBeGreaterThan(0);
        expect(elements2[0]).toBeInTheDocument();
    });
});