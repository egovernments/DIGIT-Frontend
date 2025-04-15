import React, { useEffect, useState } from 'react';

const Player = ({ embedId }) => {
  return (
    <iframe
      className='player-iframe'
      width="480"
      height="270"
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
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
        <div className='overlay'
          onClick={() => setShowOverlay(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Player embedId={embedId} />
          </div>
        </div>
      )}
      {props.overlay ? (
        <div className='player-wrapper'>
          <div className='player-click-area' onClick={onPlayerPlay} />
            <Player embedId={embedId}/>
        </div>
       ) : (
        <Player embedId={embedId}/>
      )}
    </div>
  );
};

export default YoutubeVideo;