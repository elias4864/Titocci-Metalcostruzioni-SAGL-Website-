// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import StatCard from '../pages/StatCard.jsx';

expect.extend(matchers);

// Mocks für Assets
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

    it('wechselt zum nächsten Bild der Image-Slide beim Klick auf den Weiter-Button (▶)', () => {
        renderComponent();

        const nextButtons = screen.getAllByText('▶');
        fireEvent.click(nextButtons[0]);

        expect(screen.getAllByAltText('Verranda Holz')[0]).toBeInTheDocument();
    });
});