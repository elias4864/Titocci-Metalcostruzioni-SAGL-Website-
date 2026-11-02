import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home.jsx';

const renderComponent = () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
};

beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
        constructor(callback) {
            this.callback = callback;
        }
        observe() { return null; }
        unobserve() { return null; }
        disconnect() { return null; }
    };
});

describe('Home Component Slider', () => {
    it('wechselt zum nächsten Bild beim Klick auf Weiter', () => {
        renderComponent();

        expect(screen.getByAltText('Holzkonstrukt')).toBeInTheDocument();

        const nextButton = screen.getAllByRole('button', {
            name: '▶'
        });

        fireEvent.click(nextButton[nextButton.length - 1]);

        expect(screen.getByAltText("Verranda Holz"))
            .toBeInTheDocument();


        const nextButton2 = screen.getAllByRole('button', {
            name: '▶'
        });

        fireEvent.click(nextButton2[nextButton.length - 1]);

        expect(screen.getByAltText("Treppe Holzbau"))
            .toBeInTheDocument();


    });
});