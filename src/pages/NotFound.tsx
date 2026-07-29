import { Link } from 'react-router-dom';
import Header from '../components/Header';
export default function NotFound() {
  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h1>404</h1><p>Página não encontrada</p><Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}
