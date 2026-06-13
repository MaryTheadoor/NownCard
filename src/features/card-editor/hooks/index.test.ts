import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSaveCard } from "@/features/card-editor/hooks";
import type { ReactNode } from "react";

const mockToast = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/app/providers/ToastProvider", () => ({
  useToast: () => ({ toast: mockToast }),
  ToastProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: () => ({ user: { uid: "test-uid", email: "test@test.com" } }),
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockCreateCard = vi.fn();
const mockUpdateCard = vi.fn();
const mockIsSlugTaken = vi.fn().mockResolvedValue(false);

vi.mock("@/shared/api/cards", () => ({
  createCard: (...args: unknown[]) => mockCreateCard(...args),
  updateCard: (...args: unknown[]) => mockUpdateCard(...args),
  isSlugTaken: () => mockIsSlugTaken(),
}));

const validCardData = {
  firstName: "John",
  lastName: "Doe",
  phones: [],
  emails: [],
  addresses: [],
  socialLinks: [],
  theme: "minimal" as const,
  accentColor: "#c9a278",
  isPublic: false,
};

describe("useSaveCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new card and navigates to dashboard", async () => {
    mockCreateCard.mockResolvedValue({ id: "card-1", slug: "john-doe-abc" });
    const { result } = renderHook(() => useSaveCard());

    await act(async () => {
      await result.current.save(validCardData);
    });

    expect(mockCreateCard).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "John", lastName: "Doe", ownerUid: "test-uid" }),
    );
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ variant: "success" }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("updates an existing card", async () => {
    const { result } = renderHook(() => useSaveCard());

    await act(async () => {
      await result.current.save(validCardData, "card-1");
    });

    expect(mockUpdateCard).toHaveBeenCalledWith("card-1", expect.objectContaining({ firstName: "John" }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows error toast on failure", async () => {
    mockCreateCard.mockRejectedValue(new Error("Permission denied"));
    const { result } = renderHook(() => useSaveCard());

    await act(async () => {
      await result.current.save(validCardData);
    });

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ variant: "error" }));
  });
});
