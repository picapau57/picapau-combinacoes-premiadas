import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.payment_status !== 'liberado') return <Navigate to="/payment" replace />;
  return <>{children}</>;
}
