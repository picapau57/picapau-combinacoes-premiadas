import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Home } from 'lucide-react';
export default function Header() {
  const { user, profile, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => nav(user ? '/dashboard' : '/login')}>
          <span className="logo-icon">🐦</span>
          <div><h1>PICA-PAU</h1><p>COMBINAÇÕES PREMIADAS</p></div>
        </div>
        {user && (
          <div className="header-actions">
            <button className="icon-btn" onClick={() => nav('/dashboard')} title="Início"><Home size={20} /></button>
            {profile?.is_admin && <button className="icon-btn" onClick={() => nav('/admin')} title="Admin"><Shield size={20} /></button>}
            <button className="btn-logout" onClick={signOut}><LogOut size={18} /> Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}
