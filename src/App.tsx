import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useDemo } from "./contexts/DemoContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { InvestmentPage } from "./pages/InvestmentPage";
import { TransactionPage } from "./pages/TransactionPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { BudgetPage } from "./pages/BudgetPage";
import { ScheduledPage } from "./pages/ScheduledPage";
import { EmployeePage } from "./pages/EmployeePage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
import { BranchPage } from "./pages/BranchPage";
import { DepartmentPage } from "./pages/DepartmentPage";
import { PositionPage } from "./pages/PositionPage";
import { RolePage } from "./pages/RolePage";
import { ShiftPage } from "./pages/ShiftPage";
import { HolidayPage } from "./pages/HolidayPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const { isDemo } = useDemo();

  if (isLoading) return null;

  return token || isDemo ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <PrivateRoute>
            <WalletPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/investment"
        element={
          <PrivateRoute>
            <InvestmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transaction"
        element={
          <PrivateRoute>
            <TransactionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <CategoriesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <PrivateRoute>
            <BudgetPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/scheduled"
        element={
          <PrivateRoute>
            <ScheduledPage />
          </PrivateRoute>
        }
      />

      {/* Master Data Routes */}
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <EmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <PrivateRoute>
            <EmployeeDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/branches"
        element={
          <PrivateRoute>
            <BranchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <PrivateRoute>
            <DepartmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/positions"
        element={
          <PrivateRoute>
            <PositionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <RolePage />
          </PrivateRoute>
        }
      />

      {/* Jadwal Routes */}
      <Route
        path="/shifts"
        element={
          <PrivateRoute>
            <ShiftPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/holidays"
        element={
          <PrivateRoute>
            <HolidayPage />
          </PrivateRoute>
        }
      />

      {/* Default redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;