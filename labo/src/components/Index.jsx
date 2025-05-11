import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSortAmountDown, faUser, faArrowRightFromBracket, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import AddForm from '../modals/AddForm.jsx';
import PlayerModal from '../modals/PlayerModal.jsx';
import logo from '../assets/photos/logo.png';
import './styles/index.css';

const Index = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [canciones, setCanciones] = useState([]);
    const [modalReproductor, setModalReproductor] = useState(false);
    const [cancionSeleccionada, setCancionSeleccionada] = useState(null);
    const [ordenDescendente, setOrdenDescendente] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [filtro, setFiltro] = useState('');

    const extraerIdYoutube = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([\w\-]+)/);
        return match ? match[1] : null;
    }
    useEffect(() => {
        const cancionesGuardadas = JSON.parse(localStorage.getItem('canciones')) || [];
        const cancionesConReproducciones = cancionesGuardadas.map(c => ({
            ...c,
            reproducciones: c.reproducciones || 0
        }));
        setCanciones(cancionesConReproducciones);
    }, [mostrarModal]);

    const toggleFavorito = (index) => {
        setFavoritos((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

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

                    <img src={logo} alt="logo de mixory" className='logo-mixory' />
                    <div className='busqueda-agrega-contenedor'>
                        <input
                            type="text"
                            className='input-busqueda'
                            placeholder="Buscar por título o agregar cancion con el + "
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                        <button onClick={() => setMostrarModal(true)} className='agregar-cancion'>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <div className='acciones-usuario'>
                        <FontAwesomeIcon icon={faUser} />
                        <FontAwesomeIcon icon={faBagShopping} />
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </div>
                </div>

                {mostrarModal && <AddForm onClose={() => setMostrarModal(false)} />}

                <div className="main-contenedor-contenido">
                    <div className="columna izquierda">
                        <h2>Canciones Favoritas</h2>
                        <div className="favoritos-grid">
                            {favoritos.length > 0 ? (
                                favoritos.map((index) => {
                                    const cancion = canciones[index];
                                    return (
                                        <div key={index} className="favorito-card">
                                            <p className="favorito-titulo">🎵 {cancion?.titulo}</p>
                                            <p className="favorito-repros">▶ {cancion?.reproducciones} rep.</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="favorito-vacio">No hay canciones favoritas.</p>
                            )}
                        </div>
                    </div>

                    <div className="columna centro">
                        <button onClick={() => setOrdenDescendente(!ordenDescendente)} className="filtro-reproducciones">
                            <FontAwesomeIcon icon={faSortAmountDown} /> Ordenar por reproducciones
                        </button>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
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
                                            <button
                                                className="boton-favorito"
                                                onClick={() => toggleFavorito(index)}
                                                title="Agregar a favoritos"
                                            >
                                                {favoritos.includes(index) ? '⭐' : '☆'}
                                            </button>
                                        </td>
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
                            // setCancionSeleccionada(null);
                        }}
                    />
                )}
            </main>
            {cancionSeleccionada && (
                <div className="footer-player">
                    {/* <p><strong>Reproduciendo:</strong> {cancionSeleccionada.titulo}</p>
                    <audio controls src={cancionSeleccionada.url} autoPlay /> */}
                    <p><strong>Reproduciendo:</strong> {cancionSeleccionada.titulo}</p>
                    <iframe
                        width="100%"
                        height="80"
                        src={`https://www.youtube.com/embed/${extraerIdYoutube(cancionSeleccionada.url)}?autoplay=1`}
                        title="YouTube player"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default Index;
