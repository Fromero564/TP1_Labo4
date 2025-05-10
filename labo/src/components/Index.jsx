import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import AddForm from '../modals/AddForm.jsx';
import PlayerModal from '../modals/PlayerModal.jsx';
import './styles/index.css';

const Index = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [canciones, setCanciones] = useState([]);
    const [modalReproductor, setModalReproductor] = useState(false);
    const [cancionSeleccionada, setCancionSeleccionada] = useState(null);
    const [ordenDescendente, setOrdenDescendente] = useState(false);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const cancionesGuardadas = JSON.parse(localStorage.getItem('canciones')) || [];
        const cancionesConReproducciones = cancionesGuardadas.map(c => ({
            ...c,
            reproducciones: c.reproducciones || 0
        }));
        setCanciones(cancionesConReproducciones);
    }, [mostrarModal]);

    const handleRemoveSong = (indexToRemove) => {
        const nuevasCanciones = canciones.filter((_, index) => index !== indexToRemove);
        setCanciones(nuevasCanciones);
        localStorage.setItem('canciones', JSON.stringify(nuevasCanciones));
    };

    const handlePlaySong = (cancion) => {
        const nuevasCanciones = canciones.map(c => {
            if (c.url === cancion.url) {
                return { ...c, reproducciones: (c.reproducciones || 0) + 1 };
            }
            return c;
        });
        setCanciones(nuevasCanciones);
        localStorage.setItem('canciones', JSON.stringify(nuevasCanciones));
        setCancionSeleccionada(cancion);
        setModalReproductor(true);
    };

    const cancionesFiltradas = canciones.filter(c =>
        c.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    const cancionesOrdenadas = ordenDescendente
        ? [...cancionesFiltradas].sort((a, b) => b.reproducciones - a.reproducciones)
        : cancionesFiltradas;

    return (
        <div className='contenedor'>
            <main className='main-contenedor'>
                <div className='div-busqueda'>
                    <input
                        type="text"
                        className='input-buqueda'
                        placeholder="Buscar por título..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <button onClick={() => setMostrarModal(true)} className='agregar-cancion'>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button onClick={() => setOrdenDescendente(!ordenDescendente)} className="filtro-reproducciones">
                        <FontAwesomeIcon icon={faSortAmountDown} /> Ordenar por reproducciones
                    </button>
                </div>

                {mostrarModal && <AddForm onClose={() => setMostrarModal(false)} />}

                <div className="main-contenedor-contenido">
                    <div className="columna izquierda">
                        <h2>Artistas Favoritos</h2>
                        <ul>
                            <li>Bad Bunny</li>
                            <li>Blink 182</li>
                            <li>Trueno</li>
                        </ul>
                    </div>

                    <div className="columna centro">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reproducir</th>
                                    <th>Título</th>
                                    <th>Reproducciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cancionesOrdenadas.map((cancion, index) => (
                                    <tr key={index}>
                                        <td>
                                            <button className="boton-reproducir" onClick={() => handlePlaySong(cancion)}>
                                                ▶ Reproducir
                                            </button>
                                        </td>
                                        <td>{cancion.titulo}</td>
                                        <td>{cancion.reproducciones}</td>
                                        <td>
                                            <button className='button-list' onClick={() => handleRemoveSong(index)}>
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="columna derecha">
                        <h2>Recomendaciones</h2>
                        <p>Podés poner aquí sugerencias, playlists destacadas, o un reproductor embebido de YouTube.</p>
                    </div>
                </div>

                {modalReproductor && (
                    <PlayerModal
                        url={cancionSeleccionada?.url}
                        onClose={() => {
                            setModalReproductor(false);
                            setCancionSeleccionada(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
};

export default Index;
