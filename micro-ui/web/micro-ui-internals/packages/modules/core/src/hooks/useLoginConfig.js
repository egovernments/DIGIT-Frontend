export const useLoginConfig = (stateCode) => {
  return Digit.Hooks.useCommonMDMS(
    stateCode,
    "commonUiConfig",
    ["LoginConfig"],
    {
      select: (data) => ({
        config: data?.commonUiConfig?.LoginConfig,
      }),
      retry: false,
    }
  );
};
