import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.is_admin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
