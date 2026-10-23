import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LeadModalProvider } from './context/LeadModalContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { AuthPage } from './features/auth/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { LeadsPage } from './pages/LeadsPage'
import { FollowUpsPage } from './pages/FollowUpsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LeadModalProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected CRM Workspace */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </LeadModalProvider>
    </AuthProvider>
  )
}

export default App
