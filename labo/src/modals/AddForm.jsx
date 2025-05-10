import { useState } from 'react';

const AddForm = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

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

    const nuevaCancion = { titulo, url };

    // Leer canciones anteriores o iniciar array vacío
    const cancionesGuardadas = JSON.parse(localStorage.getItem('canciones')) || [];

    // Agregar nueva canción
    cancionesGuardadas.push(nuevaCancion);

    // Guardar en localStorage
    localStorage.setItem('canciones', JSON.stringify(cancionesGuardadas));

    // Resetear campos y cerrar
    setTitulo('');
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar canción</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título de la canción"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="URL de YouTube"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
