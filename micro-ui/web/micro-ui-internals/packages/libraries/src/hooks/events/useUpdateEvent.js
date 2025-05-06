import { useMutation } from "@tanstack/react-query";

const useUpdateEvent = () => {
  return useMutation({
    mutationFn: (eventData) => Digit.EventsServices.Update(eventData),
    ...config, // Spread any additional configuration passed to the hook
  });
}

export default useUpdateEvent; 