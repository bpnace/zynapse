import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WorkspaceLoginForm } from "@/components/workspace/login/workspace-login-form";
import { createBrowserSupabaseClient } from "@/lib/auth/client";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("@/lib/auth/client", () => ({
  createBrowserSupabaseClient: vi.fn(),
}));

function createSupabaseMock() {
  return {
    auth: {
      signInWithOtp: vi.fn(),
      signInWithPassword: vi.fn(),
      verifyOtp: vi.fn(),
    },
  };
}

describe("WorkspaceLoginForm", () => {
  const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    vi.stubEnv("NODE_ENV", "test");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    pushMock.mockReset();
    refreshMock.mockReset();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalSupabaseAnonKey;
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
    cleanup();
  });

  it("shows the dev-only switch and defaults to OTP mode in non-production", () => {
    const supabase = createSupabaseMock();
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);

    render(<WorkspaceLoginForm />);

    expect(screen.getByRole("button", { name: "Code per E-Mail" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mit Passwort" })).toBeInTheDocument();
    expect(screen.getByLabelText("Geschaeftliche E-Mail")).toBeInTheDocument();
    expect(screen.queryByLabelText("Passwort")).not.toBeInTheDocument();
  });

  it("hides the password switch in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const supabase = createSupabaseMock();
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);

    render(<WorkspaceLoginForm />);

    expect(screen.queryByRole("button", { name: "Mit Passwort" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anmelden" })).toBeInTheDocument();
  });

  it("sends an OTP for an eligible email and switches to code entry", async () => {
    const supabase = createSupabaseMock();
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<WorkspaceLoginForm />);

    fireEvent.change(screen.getByLabelText("Geschaeftliche E-Mail"), {
      target: { value: "team@brand.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Anmelden" }));

    await screen.findByLabelText("6-stelliger Code");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/workspace-login",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "team@brand.com",
      options: {
        shouldCreateUser: true,
      },
    });
  });

  it("switches to password mode and signs in with email and password", async () => {
    const supabase = createSupabaseMock();
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<WorkspaceLoginForm next="/workspace?view=home" />);

    fireEvent.click(screen.getByRole("button", { name: "Mit Passwort" }));
    fireEvent.change(screen.getByLabelText("Geschaeftliche E-Mail"), {
      target: { value: "team@brand.com" },
    });
    fireEvent.change(screen.getByLabelText("Passwort"), {
      target: { value: "secret-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Mit Passwort anmelden" }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "team@brand.com",
        password: "secret-password",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/workspace?view=home");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("keeps OTP resend cooldown behavior intact", async () => {
    vi.useFakeTimers();

    const supabase = createSupabaseMock();
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<WorkspaceLoginForm />);

    fireEvent.change(screen.getByLabelText("Geschaeftliche E-Mail"), {
      target: { value: "team@brand.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Anmelden" }).closest("form")!);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByLabelText("6-stelliger Code")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Code erneut senden (30s)" }),
    ).toBeDisabled();

    for (let index = 0; index < 31; index += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
    }

    expect(
      screen.getByRole("button", { name: /Code erneut senden \(\d+s\)|Code erneut senden/ }),
    ).toBeEnabled();
  });

  it("shows a password auth error inline", async () => {
    const supabase = createSupabaseMock();
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: new Error("Invalid login credentials"),
    });
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<WorkspaceLoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Mit Passwort" }));
    fireEvent.change(screen.getByLabelText("Geschaeftliche E-Mail"), {
      target: { value: "team@brand.com" },
    });
    fireEvent.change(screen.getByLabelText("Passwort"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Mit Passwort anmelden" }));

    expect(await screen.findByText("E-Mail oder Passwort ist falsch.")).toBeInTheDocument();
  });

  it("keeps login disabled when public supabase config is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
    const supabase = createSupabaseMock();
    vi.mocked(createBrowserSupabaseClient).mockReturnValue(supabase as never);

    render(<WorkspaceLoginForm />);

    fireEvent.change(screen.getByLabelText("Geschaeftliche E-Mail"), {
      target: { value: "team@brand.com" },
    });

    expect(screen.getByRole("button", { name: "Anmelden" })).toBeDisabled();
    expect(
      screen.getByText(
        "Login ist aktuell nicht verfuegbar. Die Supabase-Konfiguration fehlt.",
      ),
    ).toBeInTheDocument();
  });
});
