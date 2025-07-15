export const useLoginConfig = (stateCode) => {
    const moduleName = Digit.Utils.getConfigModuleName();

    return Digit.Hooks.useCommonMDMS(
        stateCode,
        moduleName,
        ["LoginConfig"],
        {
            select: (data) => ({
                config: data?.[moduleName]?.LoginConfig,
            }),
            retry: false,
        }
    );
};
