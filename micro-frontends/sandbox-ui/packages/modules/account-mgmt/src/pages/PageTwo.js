import React from "react";
import { DigitUIComponents, States, YoutubeVideo } from "components"; // Import only the necessary component
const { Card } = DigitUIComponents;
const { useUserState } = States;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const PageTwo = () => {
  const { setData, resetData, data } = useUserState();
  const obj = { link: "https://www.youtube.com/watch?v=ONzdr4SmOng", locale: "" , overlay: true}

  return (
    <Card type="primary">
      {" "}
      <h1>Hi {data?.name}</h1>
      <p>video - triggering overlay</p>
      <YoutubeVideo {...obj}/>
      <p>video - not triggering overlay</p>
      <YoutubeVideo {...{ ...obj, overlay: false }}/>
    </Card>
  );
};

export default PageTwo;
