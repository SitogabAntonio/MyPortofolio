import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Navbar from './components/Navbar';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminExperiencesPage from './pages/admin/AdminExperiencesPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/public/HomePage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <main className="min-h-screen bg-neutral-950">
            <Navbar />
            <HomePage />
          </main>
        )}
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="experiences" element={<AdminExperiencesPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;