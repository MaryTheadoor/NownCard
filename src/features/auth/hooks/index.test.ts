import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSignIn, useSignUp, useGoogleSignIn, useSignOut } from "@/features/auth/hooks";
import type { ReactNode } from "react";

const mockToast = vi.fn();
const mockDismiss = vi.fn();

vi.mock("@/app/providers/ToastProvider", () => ({
  useToast: () => ({ toast: mockToast, dismiss: mockDismiss }),
  ToastProvider: ({ children }: { children: ReactNode }) => children,
}));

const mockSignInWithEmail = vi.fn();
const mockSignUpWithEmail = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignOutUser = vi.fn();

vi.mock("@/shared/lib/firebase/auth", () => ({
  signInWithEmail: (...args: unknown[]) => mockSignInWithEmail(...args),
  signUpWithEmail: (...args: unknown[]) => mockSignUpWithEmail(...args),
  signInWithGoogle: () => mockSignInWithGoogle(),
  signOutUser: () => mockSignOutUser(),
  onAuthChange: vi.fn(() => vi.fn()),
  mapFirebaseUser: vi.fn((u: unknown) => u),
}));

describe("useSignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading and error states", () => {
    const { result } = renderHook(() => useSignIn());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("calls signInWithEmail and shows success toast", async () => {
    mockSignInWithEmail.mockResolvedValue({ uid: "1", email: "test@test.com" });
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.signIn("test@test.com", "password");
    });

    expect(mockSignInWithEmail).toHaveBeenCalledWith("test@test.com", "password");
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "success" }),
    );
  });

  it("sets error on failure", async () => {
    mockSignInWithEmail.mockRejectedValue(new Error("Invalid credentials"));
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.signIn("bad@test.com", "wrong");
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "error" }),
    );
  });
});

describe("useSignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signUpWithEmail and shows success toast", async () => {
    mockSignUpWithEmail.mockResolvedValue({ uid: "1", email: "new@test.com" });
    const { result } = renderHook(() => useSignUp());

    await act(async () => {
      await result.current.signUp("new@test.com", "password");
    });

    expect(mockSignUpWithEmail).toHaveBeenCalledWith("new@test.com", "password");
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "success" }),
    );
  });
});

describe("useGoogleSignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signInWithGoogle and shows success toast", async () => {
    mockSignInWithGoogle.mockResolvedValue({ uid: "1", email: "google@test.com" });
    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "success" }),
    );
  });
});

describe("useSignOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signOutUser and shows toast", async () => {
    mockSignOutUser.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignOut());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOutUser).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalled();
  });
});
