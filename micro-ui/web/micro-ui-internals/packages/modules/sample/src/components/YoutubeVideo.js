import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube'


const YoutubeVideo = (props) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  const onPlayerPlay = () => {
    if (props.overlay) {
      setShowOverlay(true);
      setVideoKey(prev => prev + 1);
    }
  };

  return (
    <div>
      <ReactPlayer key={videoKey} url={props.link} controls={true} onPlay={onPlayerPlay}/>
      {showOverlay && (
        <div className="overlay" onClick={() => setShowOverlay(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ReactPlayer url={props.link} controls={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default YoutubeVideo;
