import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, LogIn } from 'lucide-react';
import Header from '../components/Header';
export default function Register() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', whatsapp: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  function upd(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('As senhas não coincidem');
    if (form.password.length < 6) return setError('Senha deve ter ao menos 6 caracteres');
    setLoading(true);
    const email = `${form.username.trim().toLowerCase()}@picapau.local`;
    const { error } = await signUp({ email, password: form.password, fullName: form.fullName, whatsapp: form.whatsapp, username: form.username });
    setLoading(false);
    if (error) setError(error); else nav('/login');
  }
  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon"><UserPlus size={40} /></div>
          <h2>Criar sua conta</h2>
          <p className="auth-sub">Cadastre-se para acessar o sistema</p>
          <form onSubmit={handleSubmit}>
            <label>Nome completo</label>
            <input value={form.fullName} onChange={e => upd('fullName', e.target.value)} required />
            <label>WhatsApp</label>
            <input value={form.whatsapp} onChange={e => upd('whatsapp', e.target.value)} placeholder="(00) 00000-0000" required />
            <label>Nome de usuário</label>
            <input value={form.username} onChange={e => upd('username', e.target.value)} required />
            <label>Senha</label>
            <input type="password" value={form.password} onChange={e => upd('password', e.target.value)} required />
            <label>Confirmar senha</label>
            <input type="password" value={form.confirm} onChange={e => upd('confirm', e.target.value)} required />
            {error && <div className="error-msg">{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
          </form>
          <div className="auth-footer"><Link to="/login"><LogIn size={16} /> Já tenho conta</Link></div>
        </div>
      </div>
    </div>
  );
}
