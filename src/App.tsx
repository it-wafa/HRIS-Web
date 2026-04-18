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
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { PERMISSIONS } from "./constants/permission";

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
            <ProtectedRoute permission={PERMISSIONS.HOME_EMPLOYEE_READ}>
              <DashboardPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.PROFILE_READ}>
              <ProfilePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.PROFILE_RESET_PASSWORD}>
              <ChangePasswordPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      {/* Master Data Routes */}
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.EMPLOYEE_READ}>
              <EmployeePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.EMPLOYEE_READ}>
              <EmployeeDetailPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/branches"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.BRANCH_READ}>
              <BranchPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.DEPARTMENT_READ}>
              <DepartmentPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.ROLE_READ}>
              <RolePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/leave-types"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.LEAVE_TYPE_READ}>
              <LeaveTypePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      {/* Jadwal Routes */}
      <Route
        path="/shifts"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.TEMPLATE_SHIFT_READ}>
              <ShiftPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/holidays"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.HOLIDAY_READ}>
              <HolidayPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      {/* Kehadiran Routes */}
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.ATTENDANCE_READ}>
              <AttendancePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.LEAVE_READ}>
              <LeavePage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      {/* Pengajuan Routes */}
      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.REQUEST_READ}>
              <RequestPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/daily-reports"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.DAILY_REPORT_READ}>
              <DailyReportPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/mutabaah"
        element={
          <PrivateRoute>
            <ProtectedRoute permission={PERMISSIONS.MUTABAAH_READ}>
              <MutabaahPage />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <NotFoundPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
