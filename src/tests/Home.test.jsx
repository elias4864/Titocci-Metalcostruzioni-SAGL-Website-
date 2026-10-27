import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Home from '../pages/Home.jsx';
import StatCard from '../pages/StatCard.jsx';





vi.mock('../assets/PC.png', () => ({ default: 'PC.png' }));
vi.mock('../assets/Schleifen.jpg', () => ({ default: 'Schleifen.jpg' }));
vi.mock('../assets/Bauplan.jfif', () => ({ default: 'Bauplan.jfif' }));
vi.mock('../assets/Zangen.jfif', () => ({ default: 'Zangen.jfif' }));
vi.mock('../assets/Redfacebook.jfif',()=>({default:'Redfacebook.jfif'}));
vi.mock('../assets/RedGoogleMaps.jfif',()=>({default:'RedGoogleMaps.jfif'}));
vi.mock('../assets/Statistiken.jfif',()=>({default: 'Statistiken.jfif'}))
vi.mock('../assets/Diplom.jfif', () => ({ default: 'Diplom.jfif' }));
vi.mock('../assets/Person.jfif', () => ({ default: 'Person.jfif' }));
vi.mock('../assets/Kreislauf.jfif',()=>({default:'Kreislauf.jfif'}));
vi.mock('../assets/Google.png',()=>({default:'Google.png'}));
vi.mock('../assets/Werkstatt.jfif', () => ({ default: 'Werkstatt.jfif' }));
vi.mock('../assets/Git.png', () => ({ default: 'Git.png' }));

// Mock für die untergelagerte Komponente StatCard
vi.mock('../pages/StatCard', () => ({
    default: ({ value, suffix = '', label }) => (
        <div data-testid="stat-card">
            <span>{value}{suffix}</span>
            <span>{label}</span>
        </div>
    )
}));

describe('Home Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

    it('rendert den Header und die Navigationslinks korrekt', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 1, name: /Progettazione/i })).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Chi siamo')).toBeInTheDocument();
        expect(screen.getByText('Servizi')).toBeInTheDocument();
        expect(screen.getByText('Galleria')).toBeInTheDocument();
        expect(screen.getByText('Contatti')).toBeInTheDocument();
        expect(screen.getByText('Impressum')).toBeInTheDocument();
        expect(screen.getByText)
    });

    it('zeigt das erste Bild und den ersten Titel des Karussells beim Start an', () => {
        renderComponent();

        const heroImage = screen.getByAltText('Holzkonstrukt');
        expect(heroImage).toBeInTheDocument();
        expect(screen.getByText('Holzkonstrukt')).toBeInTheDocument();
    });

    it('wechselt zum nächsten Bild beim Klick auf den Weiter-Button (▶)', () => {
        renderComponent();

        const nextButton = screen.getByText('▶');
        fireEvent.click(nextButton);

        expect(screen.getByAltText('Verranda Holz')).toBeInTheDocument();
        expect(screen.getByText('Verranda Holz')).toBeInTheDocument();
    });

    it('wechselt zum vorherigen Bild beim Klick auf den Zurück-Button (◀)', () => {
        renderComponent();

        const prevButton = screen.getByText('◀');
        fireEvent.click(prevButton);

        // Sollte zum letzten Bild in der Liste springen (Metallgiter Haus)
        expect(screen.getByAltText('Metallgiter Haus')).toBeInTheDocument();
        expect(screen.getByText('Metallgiter Haus')).toBeInTheDocument();
    });

    it('schaltet nach 3 Sekunden automatisch das nächste Bild durch (Autoplay)', () => {
        renderComponent();

        expect(screen.getByAltText('Holzkonstrukt')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.getByAltText('Verranda Holz')).toBeInTheDocument();
    });

    it('rendert die Leistungs-Sektionen (Progettazione, Costruzione, etc.)', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 2, name: 'Progettazione' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Costruzione' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Montaggio' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Assistenza' })).toBeInTheDocument();
    });

    it('rendert die StatCard-Komponenten mit den richtigen Daten', () => {
        renderComponent();

        const statCards = screen.getAllByTestId('stat-card');
        expect(statCards).toHaveLength(4);
        expect(screen.getByText('Progetti realizzati')).toBeInTheDocument();
        expect(screen.getByText('Clienti soddisfatti')).toBeInTheDocument();
    });
});