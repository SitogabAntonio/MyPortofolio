import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminExperienceFormPage from './pages/admin/AdminExperienceFormPage';
import AdminExperiencesListPage from './pages/admin/AdminExperiencesListPage';
import AdminCertificateFormPage from './pages/admin/AdminCertificateFormPage';
import AdminCertificatesListPage from './pages/admin/AdminCertificatesListPage';
import AdminGalleryFormPage from './pages/admin/AdminGalleryFormPage';
import AdminGalleriesListPage from './pages/admin/AdminGalleriesListPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProjectFormPage from './pages/admin/AdminProjectFormPage';
import AdminProjectsListPage from './pages/admin/AdminProjectsListPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSkillFormPage from './pages/admin/AdminSkillFormPage';
import AdminSkillsListPage from './pages/admin/AdminSkillsListPage';
import AdminTagsPage from './pages/admin/AdminTagsPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/public/HomePage';

function ProtectedAdminRoute() {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <HomePage />
            <Footer />
          </main>
        )}
      />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="projects" element={<AdminProjectsListPage />} />
          <Route path="projects/new" element={<AdminProjectFormPage />} />
          <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />
          <Route path="experiences" element={<AdminExperiencesListPage />} />
          <Route path="experiences/new" element={<AdminExperienceFormPage />} />
          <Route path="experiences/:id/edit" element={<AdminExperienceFormPage />} />
          <Route path="skills" element={<AdminSkillsListPage />} />
          <Route path="skills/new" element={<AdminSkillFormPage />} />
          <Route path="skills/:id/edit" element={<AdminSkillFormPage />} />
          <Route path="galleries" element={<AdminGalleriesListPage />} />
          <Route path="galleries/new" element={<AdminGalleryFormPage />} />
          <Route path="galleries/:id/edit" element={<AdminGalleryFormPage />} />
          <Route path="certificates" element={<AdminCertificatesListPage />} />
          <Route path="certificates/new" element={<AdminCertificateFormPage />} />
          <Route path="certificates/:id/edit" element={<AdminCertificateFormPage />} />
          <Route path="tags" element={<AdminTagsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;