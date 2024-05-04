
export const tourSteps = {
    hypothesis: {
      name: "hypothesis",
      run: true,
      steps: [
        {
          content:
            "Welcome to Manage Master Data screen. Here you can search and update any master data that is configured for the logged in user tenant",
          target: ".example",
          disableBeacon: true,
          placement: "bottom",
          title: "Manage Master Data",
        },
      ],
      tourActive: true,
    },
    microplanDetails: {
        name: "microplanDetails",
        run: true,
        steps: [
          {
            content:
              "Idk either ok?",
            target: ".microplan-campaign-detials",
            disableBeacon: true,
            placement: "bottom",
            title: "Manage Master Data",
          },
          {
            content:
              "This, this i know. This is where you name your microplan ok?",
            target: ".microplan-name",
            disableBeacon: true,
            placement: "bottom",
            title: "Manage Master Data",
          },
        ],
        tourActive: true,
      },
  };