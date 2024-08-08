import React, { useState } from 'react';

import { DigitUIComponents } from '../../../components/src';
const { Button, TextBlock } = DigitUIComponents;
import "./../css/index.css";




const dummyData = [
  {
    stepsArray: [
      {
        text: "The lantern flickered softly in the meadow as the symphony of the night began to unfold. A glacier shimmered in the horizon, while a bumblebee buzzed around a mosaic of flowers. Tranquil moments passed as circuit lights twinkled in the distance. An astronaut marveled at the quasar above, surrounded by a lattice of stars. The driftwood by the harbor created a charming prism of colors, as the ember of a cascade slowly dimmed. A tango played softly in the background, whispering a mirage of distant lands.",
        bannerImage: "https://cdn.worldvectorlogo.com/logos/world-health-organization-logo-1.svg"
      },
      {
        text: "In the heart of the fortress, an euphoria spread as the carousel spun with joy. The radiant lights reflected on a whistle that pierced through the thunder. Parchment maps lay scattered, revealing hidden frost patterns. A phoenix emerged from the eclipse, casting a bright drift across the land. An alloy of history and legend combined with the song of the meadowlark in an oasis of peace. Nebula clouds floated by the quarry, where quantum secrets were whispered among the stars. The luminary of the vortex created a new ember of hope.",
        bannerImage: "https://cdn.worldvectorlogo.com/logos/world-health-organization-logo-1.svg"
      },
      {
        text: "The horizon glowed with a twilight hue as a mirage danced in the celestial sky. A spindle of light traced a path over the lantern by the glacier. The mosaic of stars above reflected the radiance of the vortex, while a gentle drift of cool air brought an echo of ancient quantum mysteries. The zenith of the night revealed a glowing ember, whispering secrets of a hidden prism. A cascade of light fell softly over the fortress, as the nimbus clouds gently rolled by. The harmony of nature intertwined with the sapphire night.",
        bannerImage: "https://cdn.worldvectorlogo.com/logos/world-health-organization-logo-1.svg"
      },
      {
        text: "As the odyssey of the day ended, the ecliptic sky showcased a radiant display. Oasis moments were filled with cryptic symbols of solstice magic. The aurora danced gracefully over the glacier, while a distant beacon lit the way through the nimbus clouds. Harmony settled in as the echo of the celestial realm intertwined with the horizon. Driftwood by the shore created a serene backdrop, and the serene landscape was adorned with a quasar of light. The twilight melded into a mirage of stars",
        bannerImage: "https://cdn.worldvectorlogo.com/logos/world-health-organization-logo-1.svg"
      }
    ]
  }
];

const Slider = ({ data = dummyData }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prevStep) =>
      prevStep < data[0].stepsArray.length - 1 ? prevStep + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) =>
      prevStep > 0 ? prevStep - 1 : data[0].stepsArray.length - 1
    );
  };

  const { text, bannerImage } = data[0].stepsArray[currentStep];

  return (
    <div className="slider-container">


      <img src={bannerImage} alt={`Slide ${currentStep}`} className="slider-image" />
      <div className="slider-card">
        <TextBlock
          body={text}
          headerContentClassName="custom-header-class"
          subHeaderClasName="sub-header-class"
          captionClassName=""
          header="Slider"
          subHeader=""
        />
      </div>
      <div className="slider-buttons">
        <Button
          className="slider-button"

          icon="ArrowBack"
          isSuffix
          label=""
          onClick={handlePrevious}
          options={[]}
          optionsKey=""
          size="small"
          style={{}}
          title=""
          variation="secondary"
        />


        <Button
          className="slider-button"

          icon="ArrowForward"
          isSuffix
          label=""
          onClick={handleNext}
          options={[]}
          optionsKey=""
          size="small"
          style={{}}
          title=""
          variation="secondary"
        />
      </div>

    </div>
  );
};

export default Slider;
