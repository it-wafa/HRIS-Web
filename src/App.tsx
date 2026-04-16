import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useDemo } from "./contexts/DemoContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EmployeePage } from "./pages/EmployeePage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
import { BranchPage } from "./pages/BranchPage";
import { DepartmentPage } from "./pages/DepartmentPage";

import { RolePage } from "./pages/RolePage";
import { ShiftPage } from "./pages/ShiftPage";
import { HolidayPage } from "./pages/HolidayPage";
import { AttendancePage } from "./pages/AttendancePage";
import { LeavePage } from "./pages/LeavePage";
import { LeaveTypePage } from "./pages/LeaveTypePage";
import { RequestPage } from "./pages/RequestPage";
import { DailyReportPage } from "./pages/DailyReportPage";
import { MutabaahPage } from "./pages/MutabaahPage";
import { ChangePasswordPage } from "./pages/ChangePassword";

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
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePasswordPage />
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
        path="/roles"
        element={
          <PrivateRoute>
            <RolePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/leave-types"
        element={
          <PrivateRoute>
            <LeaveTypePage />
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

      {/* Kehadiran Routes */}
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <LeavePage />
          </PrivateRoute>
        }
      />

      {/* Pengajuan Routes */}
      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <RequestPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/daily-reports"
        element={
          <PrivateRoute>
            <DailyReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/mutabaah"
        element={
          <PrivateRoute>
            <MutabaahPage />
          </PrivateRoute>
        }
      />

      {/* Default redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
