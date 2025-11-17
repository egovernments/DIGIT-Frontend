import { LocalizationService } from "../../elements/Localization/service";
import { MdmsService } from "../../elements/MDMS";
import { Storage } from "../../atoms/Utils/Storage";
import { ApiCacheService } from "../../atoms/ApiCacheService";
import { TenantConfigSearch } from "../../elements/TenantConfigService";

const getImgUrl = (url, fallbackUrl) => {
  console.log("getImgUrl called with:", url);

  if (!url && fallbackUrl) {
    console.log("getImgUrl returning fallback:", fallbackUrl);
    return fallbackUrl;
  }
  // If URL has S3 signed parameters (X-Amz-*), return as-is without transformation
  if (url?.includes("X-Amz-")) {
    console.log("getImgUrl - URL has signed params, returning as-is:", url);
    return url;
  }
  if (url?.includes("s3.ap-south-1.amazonaws.com")) {
    const baseDomain = window?.location?.origin;
    const transformed = url.replace("https://s3.ap-south-1.amazonaws.com", baseDomain);
    console.log("getImgUrl - Transforming URL from:", url, "to:", transformed);
    return transformed;
  }
  console.log("getImgUrl - Returning URL unchanged:", url);
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
      const bannerUrl = await Digit.UploadServices.Filefetch(bannerArray, tenantConfigSearch?.[0]?.code);

      console.log("=== FILESTORE API RESPONSE ===");
      console.log("Full logoUrl Response:", logoUrl);
      console.log("logoUrl.data:", logoUrl?.data);
      console.log("logoUrl.data.fileStoreIds:", logoUrl?.data?.fileStoreIds);
      console.log("logoUrl.data.fileStoreIds[0]:", logoUrl?.data?.fileStoreIds?.[0]);
      console.log("EXTRACTED URL from logoUrl.data.fileStoreIds[0].url:", logoUrl?.data?.fileStoreIds?.[0]?.url);
      console.log("Full bannerUrl Response:", bannerUrl);
      console.log("EXTRACTED URL from bannerUrl.data.fileStoreIds[0].url:", bannerUrl?.data?.fileStoreIds?.[0]?.url);
      console.log("=== END FILESTORE API RESPONSE ===");

      const formattedLanguages = tenantConfigSearch?.[0]?.languages?.map(lang => ({
        label: lang,
        value: lang
      })) || [];

      const extractedLogoUrl = logoUrl?.data?.fileStoreIds?.[0]?.url;
      const extractedBannerUrl = bannerUrl?.data?.fileStoreIds?.[0]?.url;
      const fallbackLogoUrl = tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrl")?.url;
      const fallbackBannerUrl = tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "bannerUrl")?.url;

      // Get fileStore IDs for constructing proxy URLs if needed
      const logoFileStoreId = logoUrl?.data?.fileStoreIds?.[0]?.id;
      const bannerFileStoreId = bannerUrl?.data?.fileStoreIds?.[0]?.id;

      // Transform unsigned S3 URLs to use filestore service as proxy
      const transformS3Url = (url, fileStoreId) => {
        if (!url) return url;

        // If URL has signed parameters (X-Amz-*), use it as-is - it will work
        if (url.includes("X-Amz-")) {
          console.log("URL has signed params, using as-is:", url);
          return url;
        }

        // If URL is unsigned S3 URL and we have fileStoreId, use filestore service as proxy
        if (url.includes(".s3.ap-south-1.amazonaws.com/") && fileStoreId) {
          const tenantId = tenantConfigSearch?.[0]?.code;
          const proxyUrl = `/filestore/v1/files/id?tenantId=${tenantId}&fileStoreId=${fileStoreId}`;
          console.log("Transforming unsigned S3 URL to filestore proxy:", url, "->", proxyUrl);
          return proxyUrl;
        }

        console.log("Returning URL unchanged:", url);
        return url;
      };

      const rawLogoUrl = tenantConfigFetch ? extractedLogoUrl ? extractedLogoUrl : fallbackLogoUrl : stateInfo.logoUrl;
      const rawBannerUrl = tenantConfigFetch ? extractedBannerUrl ? extractedBannerUrl : fallbackBannerUrl : stateInfo.bannerUrl;

      const finalLogoUrl = transformS3Url(rawLogoUrl, logoFileStoreId);
      const finalBannerUrl = transformS3Url(rawBannerUrl, bannerFileStoreId);

      console.log("=== FINAL URLs ===");
      console.log("finalLogoUrl to be set:", finalLogoUrl);
      console.log("finalBannerUrl to be set:", finalBannerUrl);
      console.log("Has X-Amz in logoUrl?", finalLogoUrl?.includes("X-Amz-"));
      console.log("Has X-Amz in bannerUrl?", finalBannerUrl?.includes("X-Amz-"));
      console.log("=== END FINAL URLs ===");

      return {
        languages: tenantConfigSearch?.[0]?.languages? formattedLanguages : [{ label: "ENGLISH", value: Digit.Utils.getDefaultLanguage() }],
        stateInfo: {
          code: tenantConfigFetch ? tenantConfigSearch?.[0]?.code : stateInfo.code,
          name: tenantConfigFetch ? tenantConfigSearch?.[0]?.name : stateInfo.name,
          logoUrl: finalLogoUrl,
          statelogo: tenantConfigFetch ? tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "statelogo")?.url : stateInfo.statelogo,
          logoUrlWhite: tenantConfigFetch
            ? tenantConfigSearch?.[0]?.documents?.find((item) => item.type === "logoUrlWhite")?.url
            : stateInfo.logoUrlWhite,
          bannerUrl: finalBannerUrl,
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
    setTimeout(() => {
      renderTenantLogos(stateInfo, initData.tenants);
    }, 0);
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
