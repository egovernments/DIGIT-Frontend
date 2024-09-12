import React, { useEffect } from "react";

const GoogleTranslateComponent = ({ pageLanguage = "en" }) => {
  useEffect(() => {
    const loadGoogleTranslate = () => {
      // Initialize the Google Translate element
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: pageLanguage, // Set the default language of the page
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };

      // Add the Google Translate script after the page is fully loaded
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    // Wait until the window is fully loaded
    window.onload = loadGoogleTranslate;
    console.info(pageLanguage,'Language Updated');
  }, [pageLanguage]);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslateComponent;
