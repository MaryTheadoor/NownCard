import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { ToastProvider } from "@/app/providers/ToastProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppRoutes } from "@/app/routing/AppRoutes";

export function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}
