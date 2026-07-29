import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy, Check, MessageCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
const PIX_KEY = '(62) 98428-9911';
const WHATSAPP_DEST = '5562985756881';
export default function Payment() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  function copyPix() { navigator.clipboard.writeText(PIX_KEY); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  async function sendReceipt() {
    if (!profile) return;
    const msg = encodeURIComponent(`Olá! Meu nome é ${profile.full_name}. Realizei o pagamento de R$ 50,00 para acessar o sistema PICA-PAU COMBINAÇÕES PREMIADAS. Meu usuário é ${profile.username}. Estou enviando o comprovante para análise.`);
    await supabase.from('payment_requests').insert({
      user_id: profile.id, full_name: profile.full_name, username: profile.username,
      status: 'comprovante_enviado', sent_at: new Date().toISOString()
    });
    window.open(`https://wa.me/${WHATSAPP_DEST}?text=${msg}`, '_blank');
  }
  const statusLabel: Record<string, string> = {
    aguardando: 'Aguardando pagamento',
    comprovante_enviado: 'Comprovante enviado — em análise',
    liberado: 'Acesso liberado',
    bloqueado: 'Acesso bloqueado'
  };
  return (
    <div className="payment-page">
      <Header />
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-badge"><Clock size={18} /> {statusLabel[profile?.payment_status || 'aguardando']}</div>
          <h2>Ativação do acesso</h2>
          <p className="payment-sub">Pagamento único para liberar todas as modalidades</p>
          <div className="price-box"><span className="price-label">Valor</span><span className="price-value">R$ 50,00</span></div>
          <div className="pix-box">
            <p className="pix-title">📱 Chave PIX (Celular)</p>
            <div className="pix-key">{PIX_KEY}</div>
            <button className="btn-secondary" onClick={copyPix}>
              {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar chave PIX</>}
            </button>
          </div>
          <div className="receipt-box">
            <p>Após o pagamento, envie o comprovante pelo WhatsApp:</p>
            <button className="btn-whatsapp" onClick={sendReceipt}><MessageCircle size={18} /> Enviar comprovante pelo WhatsApp</button>
          </div>
          <div className="info-box"><p>⚠️ Seu acesso será liberado manualmente após a análise do comprovante pelo administrador.</p></div>
        </div>
      </div>
    </div>
  );
}
