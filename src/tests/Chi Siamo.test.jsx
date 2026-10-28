// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import StatCard from '../pages/StatCard.jsx';
import ChiSiamo from '../pages/Chi Siamo.jsx';
import '../Styles/TimeLineSection.css';


expect.extend(matchers);

// Mocks für Assets
vi.mock('../assets/PC.png', () => ({ default: 'PC.png' }));
vi.mock('../assets/Schleifbild.jpg', () => ({ default: 'Schleifen.jfif' }));
vi.mock('../assets/Schleifpapier.jpg', () => ({ default: 'Schleifpapier.jfif' }));
vi.mock('../assets/Bauplan.jfif', () => ({ default: 'Bauplan.jfif' }));
vi.mock('../assets/Navicon.png',()=>({default:'Navicon.png'}));
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

    describe('TimelineSection Headings & Content', () => {
        it('renders the workshop relocation text correctly', () => {
            renderComponent();

            const relocationTexts = screen.getAllByText((content) => {
                return content.includes("Passato qualche anno, visto il costante aumento della mole di lavoro");
            });

            expect(relocationTexts.length).toBeGreaterThan(0);
            expect(relocationTexts[0]).toBeInTheDocument();
        });

        it('renders main presentation heading', () => {
            renderComponent();

            const headings = screen.getAllByText(/Presentazione/i);
            expect(headings.length).toBeGreaterThan(0);
            expect(headings[0]).toBeInTheDocument();
        });
    });

    it('die einzelnen Sections', () => {
        renderComponent();
        const elements = screen.getAllByText(/Titocci Metalcostruzioni SAGL/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    });

    it('Div-Section mit Bild', () => {
        renderComponent();

        const elements2 = screen.getAllByText((content) => {
            return content.includes('Il Fabbro') && content.includes('creazioni personalizzate');
        });

        expect(elements2.length).toBeGreaterThan(0);
        expect(elements2[0]).toBeInTheDocument();
    });

    it('Chi-Siamo Section', () => {
        renderComponent();
        const elements3 = screen.getAllByText((content) => {
            return content.includes("Passato qualche anno, visto il costante aumento della mole di lavoro");
        });

        expect(elements3.length).toBeGreaterThan(0);
        expect(elements3[0]).toBeInTheDocument();
    });
});