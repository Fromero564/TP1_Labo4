import React from 'react';
import './styles/playermodal.css'; 

const convertirAEmbed = (url) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^\s&]+)/;
    const shortRegex = /(?:https?:\/\/)?youtu\.be\/([^\s&]+)/;

    const match = url.match(youtubeRegex) || url.match(shortRegex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

const PlayerModal = ({ url, onClose }) => {
    if (!url) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-reproductor">
                <button className="cerrar-modal" onClick={onClose}>✖</button>
                <iframe
                    width="100%"
                    height="315"
                    src={convertirAEmbed(url)}
                    title="Reproductor"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default PlayerModal;
