import { LocalizationService } from "../../elements/Localization/service";
import { MdmsService } from "../../elements/MDMS";
import { Storage } from "../../atoms/Utils/Storage";
import { ApiCacheService } from "../../atoms/ApiCacheService";
import { TenantConfigSearch } from "../../elements/TenantConfigService";

const getImgUrl = (url, fallbackUrl) => {

  if (!url && fallbackUrl) {
    return fallbackUrl;
  }
  if (url?.includes("s3.ap-south-1.amazonaws.com")) {
    const baseDomain = window?.location?.origin;
    return url.replace("https://s3.ap-south-1.amazonaws.com", baseDomain);
  }
  return url;
};
const addLogo = (id, url, fallbackUrl = "") => {
  const containerDivId = "logo-img-container";
  let containerDiv = document.getElementById(containerDivId);
  if (!containerDiv) {
    containerDiv = document.createElement("div");
    containerDiv.id = containerDivId;
    containerDiv.style = "position: absolute; top: 0; left: -9999px;";
    document.body.appendChild(containerDiv);
  }
  const img = document.createElement("img");
  img.src = getImgUrl(url, fallbackUrl);
  img.id = `logo-${id}`;
  containerDiv.appendChild(img);
};

const renderTenantLogos = (stateInfo, tenants) => {
  addLogo(stateInfo.code, stateInfo.logoUrl);
  tenants?.forEach((tenant) => {
    addLogo(tenant.code, tenant.logoId, stateInfo.logoUrl);
  });
};

export const StoreService = {
  getInitData: () => {
    return Storage.get("initData");
  },

  getBoundries: async (tenants) => {
    let allBoundries = [];
    allBoundries = tenants.map((tenant) => {
      return Digit.LocationService.getLocalities(tenant.code);
    });
    return await Promise.all(allBoundries);
  },
  getRevenueBoundries: async (tenants) => {
    let allBoundries = [];
    allBoundries = tenants.map((tenant) => {
      return Digit.LocationService.getRevenueLocalities(tenant.code);
    });
    return await Promise.all(allBoundries);
  },
  getTenantConfig: async (stateCode, enabledModules) => {
    const tenantConfigs = await TenantConfigSearch.tenant(stateCode);
    const tenantConfigSearch = tenantConfigs?.tenantConfigs?.length > 0 ? tenantConfigs?.tenantConfigs : null;
    if (!tenantConfigSearch) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = `/${window?.globalPath}/user/invalid-url`;
      return;
      // throw new Error("Invalid URL")
      // return;
    }
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"]?.StateInfo?.[0] || {};
    const uiHomePage = MdmsRes["common-masters"]?.uiHomePage?.[0] || {};
    return {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: Digit.Utils.getDefaultLanguage() }],
      stateInfo: {
        code: tenantConfigSearch?.[0]?.code,
        name: tenantConfigSearch?.[0]?.name,
        logoUrl: tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrl")?.url,
        statelogo: tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "statelogo")?.url,
        logoUrlWhite: tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrlWhite")?.url,
        bannerUrl: tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "bannerUrl")?.url,
      },
      localizationModules: stateInfo.localizationModules,
      modules:
        MdmsRes?.tenant?.citymodule
          ?.filter((module) => module?.active)
          ?.filter((module) => enabledModules?.includes(module?.code))
          ?.sort((x, y) => x?.order - y?.order) || [],
      uiHomePage: uiHomePage,
    };
  },
  digitInitData: async (stateCode, enabledModules, modulePrefix) => {

    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"]?.StateInfo?.[0] || {};
    const uiHomePage = MdmsRes["common-masters"]?.uiHomePage?.[0] || {};
    const tenantConfigFetch = Digit.Utils.getMultiRootTenant();
    const localities = {};
    const revenue_localities = {};
    if (tenantConfigFetch) {
      const tenantConfig = await StoreService.getTenantConfig(stateCode, enabledModules); // Await the async call
    }
    const fetchTenantConfig = async () => {
      const tenantConfigs = await TenantConfigSearch.tenant(stateCode);
      const tenantConfigSearch = tenantConfigs?.tenantConfigs ? tenantConfigs?.tenantConfigs : null;
      const logoArray = tenantConfigSearch[0].documents
        .filter(doc => doc.type === "logoUrl")
        .map(doc => doc.fileStoreId);
      const bannerArray = tenantConfigSearch[0].documents
        .filter(doc => doc.type === "bannerUrl")
        .map(doc => doc.fileStoreId);
      const logoUrl = await Digit.UploadServices.Filefetch(logoArray, tenantConfigSearch?.[0]?.code);
      const bannerUrl = await Digit.UploadServices.Filefetch(bannerArray, tenantConfigSearch?.[0]?.code)
      const formattedLanguages = tenantConfigSearch?.[0]?.languages?.map(lang => ({
        label: lang,
        value: lang
      })) || [];
      return {
        languages: tenantConfigSearch?.[0]?.languages? formattedLanguages : [{ label: "ENGLISH", value: Digit.Utils.getDefaultLanguage() }],
        stateInfo: {
          code: tenantConfigFetch ? tenantConfigSearch?.[0]?.code : stateInfo.code,
          name: tenantConfigFetch ? tenantConfigSearch?.[0]?.name : stateInfo.name,
          logoUrl: tenantConfigFetch ? logoUrl?.data?.fileStoreIds?.[0]?.url ? logoUrl?.data?.fileStoreIds?.[0]?.url?.split('?')[0] : tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrl")?.url : stateInfo.logoUrl,
          statelogo: tenantConfigFetch ? tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "statelogo")?.url : stateInfo.statelogo,
          logoUrlWhite: tenantConfigFetch
            ? tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrlWhite")?.url
            : stateInfo.logoUrlWhite,
          bannerUrl: tenantConfigFetch ? bannerUrl?.data?.fileStoreIds?.[0]?.url  ? bannerUrl?.data?.fileStoreIds?.[0]?.url?.split('?')[0] : tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "bannerUrl")?.url : stateInfo.bannerUrl,
        },
        localizationModules: stateInfo.localizationModules,
        modules:
          MdmsRes?.tenant?.citymodule
            ?.filter((module) => module?.active)
            ?.filter((module) => enabledModules?.includes(module?.code))
            ?.sort((x, y) => x?.order - y?.order) || [],
        uiHomePage: uiHomePage,
      };
    };
    const initData = tenantConfigFetch
      ? await fetchTenantConfig()
      : {
          languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: Digit.Utils.getDefaultLanguage() }],
          stateInfo: {
            code: stateInfo.code,
            name: stateInfo.name,
            logoUrl: stateInfo.logoUrl,
            statelogo: stateInfo.statelogo,
            logoUrlWhite: stateInfo.logoUrlWhite,
            bannerUrl: stateInfo.bannerUrl,
          },
          localizationModules: stateInfo.localizationModules,
          modules:
            MdmsRes?.tenant?.citymodule
              ?.filter((module) => module?.active)
              ?.filter((module) => enabledModules?.includes(module?.code))
              ?.sort((x, y) => x?.order - y?.order) || [],
          uiHomePage: uiHomePage,
        };
    initData.selectedLanguage = Digit.SessionStorage.get("locale") || initData.languages[0].value;

    ApiCacheService.saveSetting(MdmsRes["DIGIT-UI"]?.ApiCachingSettings);

    const moduleTenants = initData.modules
      .map((module) => module.tenants)
      .flat()
      .reduce((unique, ele) => (unique.find((item) => item.code === ele.code) ? unique : [...unique, ele]), []);
      if (Digit.Utils.getMultiRootTenant()) {
        initData.tenants = MdmsRes?.tenant?.cities.map((tenant) => ({
            i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`,
            ...tenant,
        }));
      } else {
        initData.tenants = MdmsRes?.tenant?.tenants.map((tenant) => ({
            i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`,
            ...tenant,
        }));
    }
    // .filter((item) => !!moduleTenants.find((mt) => mt.code === item.code))
    // .map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant }));

    await LocalizationService.getLocale({
      modules: [`${modulePrefix}-common`, `digit-ui`, `digit-tenants`, `${modulePrefix}-${stateCode.toLowerCase()}`],
      locale: initData.selectedLanguage,
      tenantId: stateCode,
    });
    Storage.set("initData", initData);
    initData.revenue_localities = revenue_localities;
    initData.localities = localities;
    // setTimeout(() => {
    //   renderTenantLogos(stateInfo, initData.tenants);
    // }, 0);
    return initData;
  },
  defaultData: async (stateCode, moduleCode, language, modulePrefix) => {
    let moduleCodes = [];
    if (typeof moduleCode !== "string")
      moduleCode.forEach((code) => {
        moduleCodes.push(modulePrefix ? `${modulePrefix}-${code.toLowerCase()}` : `${code.toLowerCase()}`);
      });
    const LocalePromise = LocalizationService.getLocale({
      modules:
        typeof moduleCode == "string"
          ? modulePrefix
            ? [`${modulePrefix}-${moduleCode.toLowerCase()}`]
            : [`${moduleCode.toLowerCase()}`]
          : moduleCodes,
      locale: language,
      tenantId: stateCode,
    });
    await LocalePromise;
    return {};
  },
};
