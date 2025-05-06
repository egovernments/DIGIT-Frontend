import { useMutation } from "@tanstack/react-query";

const useCreateEvent = () => {
  return useMutation({
    mutationFn: (eventData) => Digit.EventsServices.Create(eventData),
    ...config, // Spread any additional configuration passed to the hook
  });
}

export default useCreateEvent; 