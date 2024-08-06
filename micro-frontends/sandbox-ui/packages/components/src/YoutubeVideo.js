import React, { useEffect, useState } from 'react';

const Player = ({ embedId }) => {
  return (
    <iframe
      width="480"
      height="270"
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
      style={{ position: 'relative', zIndex: 0 }}
    />
  );
};

const YoutubeVideo = (props) => {
  const [embedId, setEmbedId] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let id = props.link;
    if (id.startsWith("https://www.youtube.com/watch?v=")) {
      id = id.split("https://www.youtube.com/watch?v=")[1];
    }
    setEmbedId(id);
  }, [props.link]);

  const onPlayerPlay = () => {
    if (props.overlay) {
      setShowOverlay(true);
    }
  };

  return (
    <div>
      {showOverlay && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowOverlay(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Player embedId={embedId} />
          </div>
        </div>
      )}
      {props.overlay ? (
        <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
          <div onClick={onPlayerPlay} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }} />
            <Player embedId={embedId}/>
        </div>
       ) : (
        <Player embedId={embedId}/>
      )}
    </div>
  );
};

export default YoutubeVideo;