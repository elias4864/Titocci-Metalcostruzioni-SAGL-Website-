import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Calculator from '../pages/Calculator.jsx'; // Pfad ggf. anpassen

vi.mock('../pages/KeyPad.jsx', () => ({
    default: ({
                  addChar,
                  delChar,
                  reset,
                  handleOperator,
                  handleSquare,
                  handlePercent,
                  handleSqrt,
                  handleEquals,
              }) => (
        <div data-testid="mock-keypad">
            <button type="button" onClick={() => addChar('7')}>7</button>
            <button type="button" onClick={() => addChar('2')}>2</button>
            <button type="button" onClick={() => addChar('9')}>9</button>
            <button type="button" onClick={() => addChar('-')}>-</button>
            <button type="button" onClick={() => addChar('+')}>+</button>
            <button type="button" onClick={() => addChar('3')}>3</button>
            <button type="button" onClick={() => addChar('1')}>1</button>





            <button type="button" onClick={() => handleOperator('+')}>+</button>
            <button type="button" onClick={() => handleOperator('/')}>/</button>
            <button type="button" onClick={delChar}>DEL</button>
            <button type="button" onClick={reset}>RESET</button>
            <button type="button" onClick={handleSquare}>x²</button>
            <button type="button" onClick={handlePercent}>%</button>
            <button type="button" onClick={handleSqrt}>√</button>
            <button type="button" onClick={handleEquals}>=</button>
        </div>
    ),
}));

describe('Calculator Komponente', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    const getKeypadButton = (label) =>
        within(screen.getByTestId('mock-keypad')).getByRole('button', { name: label });

    it('rendert Initialzustand mit "0" und Standard-Theme "1"', () => {
        const { container } = render(<Calculator />);

        expect(screen.getByText('Online Rechner')).toBeInTheDocument();
        expect(container.querySelector('.display-text')).toHaveTextContent('0');
        expect(container.querySelector('.calc-wrapper')).toHaveClass('theme-1-main');
    });

    it('fügt Ziffern hinzu und ersetzt die führende "0"', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('7'));
        expect(display).toHaveTextContent('7');

        fireEvent.click(getKeypadButton('2'));
        expect(display).toHaveTextContent('72');
    });

    it('löscht das letzte Zeichen mit DEL und setzt bei einer Ziffer auf "0" zurück', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('7'));
        fireEvent.click(getKeypadButton('2'));
        fireEvent.click(getKeypadButton('DEL'));
        expect(display).toHaveTextContent('7');

        fireEvent.click(getKeypadButton('DEL'));
        expect(display).toHaveTextContent('0');
    });

    it('setzt die Anzeige mit RESET zurück auf "0"', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('7'));
        fireEvent.click(getKeypadButton('RESET'));
        expect(display).toHaveTextContent('0');
    });

    it('führt eine Addition korrekt aus', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('7'));
        fireEvent.click(getKeypadButton('+'));
        fireEvent.click(getKeypadButton('2'));
        fireEvent.click(getKeypadButton('='));

        expect(display).toHaveTextContent('9');
    });


    it('führt eine Subtraktion korrekt aus', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('1'));
        fireEvent.click(getKeypadButton('3'));
        fireEvent.click(getKeypadButton('-'));
        fireEvent.click(getKeypadButton('2'));
        fireEvent.click(getKeypadButton('='));

        expect(display).toHaveTextContent('11');
    });


    it('berechnet Quadrat (x²), Prozent (%) und Quadratwurzel (√) korrekt', () => {
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('9'));
        fireEvent.click(getKeypadButton('x²'));
        expect(display).toHaveTextContent('81');

        fireEvent.click(getKeypadButton('√'));
        expect(display).toHaveTextContent('9');

        fireEvent.click(getKeypadButton('%'));
        expect(display).toHaveTextContent('0.09');
    });

    it('zeigt bei negativer Quadratwurzel einen Alert an', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('-'));
        fireEvent.click(getKeypadButton('9'));
        fireEvent.click(getKeypadButton('√'));

        expect(alertMock).toHaveBeenCalledWith(
            'Fehler: Ungültiger Wert für die Wurzel (-9)'
        );
        expect(display).toHaveTextContent('-9');
    });

    it('fängt ungültige Berechnungen bei "=" ab und setzt auf "0" zurück', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = render(<Calculator />);
        const display = container.querySelector('.display-text');

        fireEvent.click(getKeypadButton('7'));
        fireEvent.click(getKeypadButton('+'));
        fireEvent.click(getKeypadButton('='));

        expect(alertMock).toHaveBeenCalledWith('Ungültige Berechnung');
        expect(display).toHaveTextContent('0');
    });

    it('wechselt das Theme beim Klick auf die Theme-Buttons (1 bis 4)', () => {
        const { container } = render(<Calculator />);
        const wrapper = container.querySelector('.calc-wrapper');

        fireEvent.click(container.querySelector('.ghost-2'));
        expect(wrapper).toHaveClass('theme-2-main');

        fireEvent.click(container.querySelector('.ghost-3'));
        expect(wrapper).toHaveClass('theme-3-main');

        fireEvent.click(container.querySelector('.ghost-4'));
        expect(wrapper).toHaveClass('theme-4-main');
    });
});