import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import KundenansichtImmobilien from "../pages/Kundenansicht.jsx";

vi.mock("../pages/ImobiliaCalculatori.jsx", () => ({
    default: () => <div data-testid="mock-calculator">Calculator Mock</div>
}));

function renderPage(lang = "de") {
    return render(
        <MemoryRouter>
            <KundenansichtImmobilien lang={lang} />
        </MemoryRouter>
    );
}

describe("KundenansichtImmobilien", () => {
    it("rendert Titel, Objektkarten und den Richtwert-Rechner", () => {
        renderPage("de");

        expect(screen.getByRole("heading", { name: "Ihre Immobilie im Fokus" })).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Mehrfamilienhaus – Balkonbrüstungen (SIA 358)" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Wohn- & Geschäftshaus – Treppen & Handläufe" })
        ).toBeInTheDocument();
        expect(screen.getByTestId("mock-calculator")).toBeInTheDocument();
    });

    it("filtert Objekte nach Suchbegriff und Kategorie", () => {
        renderPage("de");

        const searchInput = screen.getByPlaceholderText(/z\.B\. Balkon, Treppe, Avegno, Tor/i);
        fireEvent.change(searchInput, { target: { value: "Locarno" } });

        expect(
            screen.getByRole("heading", { name: "Wohn- & Geschäftshaus – Treppen & Handläufe" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "Mehrfamilienhaus – Balkonbrüstungen (SIA 358)" })
        ).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "" } });
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "Tore" } });

        expect(
            screen.getByRole("heading", { name: "Wohnanlage & Gewerbe – Einfahrts- & Schiebetore" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "Areal & Garten – Einfriedungen & Sichtschutz" })
        ).not.toBeInTheDocument();
    });

    it("übernimmt das gewählte Objekt ins Buchungsformular und zeigt die Erfolgsmeldung nach dem Absenden", () => {
        const scrollSpy = vi.fn();
        const origGetElementById = document.getElementById.bind(document);
        vi.spyOn(document, "getElementById").mockImplementation((id) => {
            const el = origGetElementById(id);
            if (el) el.scrollIntoView = scrollSpy;
            return el;
        });

        renderPage("de");

        const bookButtons = screen.getAllByRole("button", { name: /Aufmass \/ Beratung buchen/i });
        fireEvent.click(bookButtons[2]); // Tore-Objekt

        const bookingSection = document.getElementById("kunden-buchung");
        const objectSelect = within(bookingSection).getByRole("combobox");
        expect(objectSelect.value).toBe("Wohnanlage & Gewerbe – Einfahrts- & Schiebetore");
        expect(scrollSpy).toHaveBeenCalled();

        const nameInput = document.querySelector('input[type="text"]:not([placeholder*="Balkon"])');
        const emailInput = document.querySelector('input[type="email"]');

        fireEvent.change(nameInput, { target: { value: "Immobilien AG" } });
        fireEvent.change(emailInput, { target: { value: "kontakt@immobilien.ch" } });

        fireEvent.click(screen.getByRole("button", { name: /Buchungsanfrage senden/i }));

        expect(
            screen.getByText(/Vielen Dank! Ihre Terminanfrage für die Kundenberatung wurde erfasst\./i)
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Weitere Anfrage erfassen/i }));
        expect(screen.getByRole("button", { name: /Buchungsanfrage senden/i })).toBeInTheDocument();
    });

    it("unterstützt verschiedene Sprachen wie Italienisch", () => {
        renderPage("it");

        expect(screen.getByRole("heading", { name: "Il vostro immobile al centro" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Invia richiesta di prenotazione/i })).toBeInTheDocument();
    });
});