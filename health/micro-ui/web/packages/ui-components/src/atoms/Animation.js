import React from 'react';
import Lottie from 'react-lottie';

const Animation = (props) => {

  const defaultOptions = {
    loop: props?.loop,
    autoplay: props?.autoplay,
    animationData: props?.animationData,
    renderer: 'svg',
  };

  return (
    <div className='digit-animation'>
      <Lottie options={defaultOptions} height={props?.height} width={props?.width} />
    </div>
  );
};

export default Animation;
