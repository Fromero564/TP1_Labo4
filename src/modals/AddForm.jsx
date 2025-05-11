import { useState, useEffect } from 'react';
import './styles/addform.css';

const AddForm = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const validarYoutube = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    return regex.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarYoutube(url)) {
      setError('La URL debe ser un enlace válido de YouTube.');
      return;
    }

    const cancionesGuardadas = JSON.parse(localStorage.getItem('canciones')) || [];

    const yaExiste = cancionesGuardadas.some(c =>
      c.url.trim().toLowerCase() === url.trim().toLowerCase() ||
      c.titulo.trim().toLowerCase() === titulo.trim().toLowerCase()
    );

    if (yaExiste) {
      setError('Esta canción ya fue agregada.');
      return;
    }

    const nuevaCancion = {
      titulo: titulo.trim(),
      url: url.trim(),
      reproducciones: 0
    };

    cancionesGuardadas.push(nuevaCancion);
    localStorage.setItem('canciones', JSON.stringify(cancionesGuardadas));

    setTitulo('');
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Agregar canción</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            placeholder="Título de la canción"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <input
            className="modal-input"
            type="text"
            placeholder="URL de YouTube"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose} className="cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
