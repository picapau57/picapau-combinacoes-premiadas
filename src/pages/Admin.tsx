import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { Search, Unlock, Lock, Trash2, Eye, Bell } from 'lucide-react';
import type { Profile, PaymentStatus } from '../contexts/AuthContext';
export default function Admin() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(0);
  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setClients((data as Profile[]) || []);
  }
  async function loadNotifications() {
    const { count } = await supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'comprovante_enviado');
    setNotifications(count || 0);
  }
  useEffect(() => { load(); loadNotifications(); }, []);
  async function setStatus(id: string, status: PaymentStatus) {
    await supabase.from('profiles').update({
      payment_status: status, released_at: status === 'liberado' ? new Date().toISOString() : null
    }).eq('id', id);
    load();
  }
  async function remove(id: string) {
    if (!confirm('Excluir este cliente?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    load();
  }
  const filtered = clients.filter(c => {
    if (filter !== 'all' && c.payment_status !== filter) return false;
    if (search && !(`${c.full_name} ${c.username} ${c.whatsapp}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });
  return (
    <div className="admin-page">
      <Header />
      <div className="admin-inner">
        <div className="admin-header">
          <h2>🛡️ Painel Administrativo</h2>
          <div className="notif-badge"><Bell size={20} />{notifications > 0 && <span>{notifications}</span>}</div>
        </div>
        <div className="admin-toolbar">
          <div className="search-box"><Search size={18} /><input placeholder="Buscar por nome, usuário ou WhatsApp" value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="filters">
            {(['all', 'aguardando', 'comprovante_enviado', 'liberado', 'bloqueado'] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f === 'all' ? 'Todos' : f.replace('_', ' ')}</button>
            ))}
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nome</th><th>WhatsApp</th><th>Usuário</th><th>Cadastro</th><th>Pagamento</th><th>Acesso</th><th>Liberação</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.full_name}</td><td>{c.whatsapp}</td><td><strong>{c.username}</strong></td>
                  <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`badge badge-${c.payment_status}`}>{c.payment_status.replace('_', ' ')}</span></td>
                  <td>{c.payment_status === 'liberado' ? '✅ Liberado' : c.payment_status === 'bloqueado' ? '🚫 Bloqueado' : '⏳ Pendente'}</td>
                  <td>{c.released_at ? new Date(c.released_at).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="actions-cell">
                    <button title="Liberar" onClick={() => setStatus(c.id, 'liberado')}><Unlock size={16} /></button>
                    <button title="Bloquear" onClick={() => setStatus(c.id, 'bloqueado')}><Lock size={16} /></button>
                    <button title="Histórico" onClick={() => alert(`Histórico de ${c.username}: pagamentos e acessos registrados.`)}><Eye size={16} /></button>
                    <button title="Excluir" onClick={() => remove(c.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30 }}>Nenhum cliente encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
