import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Forbidden from "../pages/Forbidden";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";
import MyTasks from "../pages/MyTasks/MyTasks";
import MainLayout from "../components/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["Admin"]}>
              <MainLayout>
                <Users />
              </MainLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["Admin"]}>
              <MainLayout>
                <Settings />
              </MainLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyTasks />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/403" element={<Forbidden />} />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}