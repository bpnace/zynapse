import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrandInquiryWizard } from "@/components/forms/brand-inquiry/brand-inquiry-wizard";

function goToContactStep() {
  fireEvent.click(screen.getByRole("button", { name: /06Kontakt/i }));
}

describe("BrandInquiryWizard", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    cleanup();
    fetchMock.mockReset();
  });

  it("removes the early submit shortcut and surfaces skipped minimum fields", async () => {
    render(<BrandInquiryWizard />);

    expect(screen.queryByRole("button", { name: "Absenden" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Vorschlag übernehmen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Details ergänzen" }),
    ).toBeInTheDocument();

    goToContactStep();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Mia Brand" },
    });
    fireEvent.change(screen.getByLabelText("Geschäftliche E-Mail"), {
      target: { value: "mia@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Firma"), {
      target: { value: "Hydra Labs" },
    });
    fireEvent.click(screen.getByLabelText(/Ich akzeptiere die Datenschutzerklärung/i));
    fireEvent.click(screen.getByRole("button", { name: "Kampagne anfragen" }));

    expect(
      await screen.findByText(/Bitte ergänze Produkt oder Link/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Schritt 1 von 6/i })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits a quick inquiry with only the minimum required content", async () => {
    render(<BrandInquiryWizard />);

    fireEvent.change(screen.getByLabelText("Produkt, Website oder Link"), {
      target: { value: "Neues Serum" },
    });
    fireEvent.change(screen.getByLabelText("Ziel"), {
      target: { value: "Launch testen" },
    });

    goToContactStep();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Mia Brand" },
    });
    fireEvent.change(screen.getByLabelText("Geschäftliche E-Mail"), {
      target: { value: "mia@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Firma"), {
      target: { value: "Hydra Labs" },
    });
    fireEvent.click(screen.getByLabelText(/Ich akzeptiere die Datenschutzerklärung/i));
    fireEvent.click(screen.getByRole("button", { name: "Kampagne anfragen" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toMatchObject({
      productUrl: "Neues Serum",
      goal: "Launch testen",
      budgetRange: "",
      channels: [],
      timeline: "",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: true,
    });
    expect(
      await screen.findByText(/Danke, dein Briefing ist eingegangen/i),
    ).toBeInTheDocument();
  });
});
