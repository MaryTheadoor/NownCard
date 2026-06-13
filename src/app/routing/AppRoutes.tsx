import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/widgets/AppLayout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("@/pages/HomePage"));
const EditorPage = lazy(() => import("@/pages/EditorPage"));
const CardViewerPage = lazy(() => import("@/pages/CardViewerPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));

function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:cardId?" element={<EditorPage />} />
          <Route path="/card/:slug" element={<CardViewerPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
