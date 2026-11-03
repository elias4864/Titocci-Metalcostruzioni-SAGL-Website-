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






        const nextButton3 = screen.getAllByRole('button', {
            name: '▶'
        });

        fireEvent.click(nextButton2[nextButton.length - 1]);

        expect(screen.getByAltText("Metallgiter Haus"))
            .toBeInTheDocument();



    });

    it('alle vier Arbeitsbereiche anzeigen', () => {
        renderComponent();

        expect(screen.getByAltText('Progettazione'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Costruzione'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Montaggio'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Assistenza'))
            .toBeInTheDocument();
    });

    it('zeigt unsere Stärken an', () => {
        renderComponent();

        expect(screen.getByText('I NOSTRI PUNTI DI FORZA'))
            .toBeInTheDocument();

        expect(screen.getByText('Personale qualificato'))
            .toBeInTheDocument();

        expect(screen.getByText('Tantissimi clienti soddisfatti'))
            .toBeInTheDocument();

        expect(screen.getByText('Officina ultra attrezzata'))
            .toBeInTheDocument();
    });

    it('zeigt unsere Arbeitsprojekte an', () => {
        renderComponent();

        expect(screen.getByText('I NOSTRI PUNTI DI LAVORI'))
            .toBeInTheDocument();

        expect(screen.getByText('Progetti realizzati'))
            .toBeInTheDocument();

        expect(screen.getByText('Clienti soddisfatti'))
            .toBeInTheDocument();

        expect(screen.getByText('Progetti attivi'))
            .toBeInTheDocument();

        expect(screen.getByText('Progetti in attesa'))
            .toBeInTheDocument();
    });

    it('zeigt die vier Bereichsbilder an', () => {
        renderComponent();

        expect(screen.getByAltText('Progettazione'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Costruzione'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Montaggio'))
            .toBeInTheDocument();

        expect(screen.getByAltText('Assistenza'))
            .toBeInTheDocument();
    });


});