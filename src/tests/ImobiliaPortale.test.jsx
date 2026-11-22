import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImmobilienPortal from "../pages/ImobiliaPortale.jsx";

vi.mock("react-router-dom", () => ({
    Link: ({ children, to, ...props }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
}));

vi.mock("../pages/ImobiliaCalculatori.jsx", () => ({
    default: ({ lang }) => <div data-testid="mock-calculator">Calculator ({lang})</div>,
}));

vi.mock("../assets/Schleifen3.jpg", () => ({ default: "schleifen.jpg" }));
vi.mock("../assets/Impressum.jpg", () => ({ default: "impressum.jpg" }));
vi.mock("../assets/Holztreppe.jpg", () => ({ default: "holztreppe.jpg" }));
vi.mock("../assets/Seitengitter.jpg", () => ({ default: "seitengitter.jpg" }));
vi.mock("../assets/Gitter4.jpg", () => ({ default: "gitter4.jpg" }));

describe("ImmobilienPortal", () => {
    beforeEach(() => {
        Element.prototype.scrollIntoView = vi.fn();
    });

    it("rendert Titel und Ausschreibungen standardmässig auf Deutsch", () => {
        render(<ImmobilienPortal lang="de" />);

        expect(screen.getByRole("heading", { name: "Titocci Metalcostruzioni" })).toBeInTheDocument();
        expect(screen.getByText(/Residenza Valle Maggia/i)).toBeInTheDocument();
        expect(screen.getByText(/Villa & Gartenanlage Ascona/i)).toBeInTheDocument();
    });

    it("wechselt in den Kunden-Tab und zeigt Immobilien-Pakete", () => {
        render(<ImmobilienPortal lang="de" />);

        fireEvent.click(screen.getByRole("button", { name: /Kundenansicht & Objekt-Katalog/i }));

        expect(screen.getByText(/Parapetti & Balkonsysteme \(SIA 358\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Treppenhaus- & Innengeländer/i)).toBeInTheDocument();
    });

    it("wechselt über das Suchformular in den Kalkulator- & Booking-Tab", () => {
        render(<ImmobilienPortal lang="de" />);

        fireEvent.click(screen.getByRole("button", { name: /Verfügbarkeit & Richtpreis prüfen/i }));

        expect(screen.getByTestId("mock-calculator")).toHaveTextContent(/Calculator/i);
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });



    it("unterstützt andere Sprachen wie Italienisch", () => {
        render(<ImmobilienPortal lang="it" />);

        expect(screen.getByRole("button", { name: /Appalti e Progetti Attuali/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Vista Clienti & Catalogo Oggetti/i })).toBeInTheDocument();
    });
});