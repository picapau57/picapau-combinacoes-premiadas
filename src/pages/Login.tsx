import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import Header from '../components/Header';
export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    const { error } = await signIn(username, password);
    setLoading(false);
    if (error) setError(error); else nav('/dashboard');
  }
  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon"><LogIn size={40} /></div>
          <h2>Entrar na sua conta</h2>
          <p className="auth-sub">Acesse suas combinações premiadas</p>
          <form onSubmit={handleSubmit}>
            <label>Usuário</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
            <label>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <div className="error-msg">{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <div className="auth-footer"><Link to="/register"><UserPlus size={16} /> Criar conta</Link></div>
        </div>
      </div>
    </div>
  );
}
