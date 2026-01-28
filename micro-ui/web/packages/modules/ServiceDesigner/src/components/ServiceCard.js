import { CustomSVG, Button, PopUp, TextInput, TextBlock, AlertCard, Toast } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, useRef, use } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDuplicateServiceAPI } from "../hooks/useDuplicateServiceAPI";

// Color palette for service cards - matching Figma exactly
const cardColorPalette = [
  { header: "rgba(246, 240, 232, 1)", dateBg: "#FDF6F0", dateText: "#9E6D3F" }, // Peach/Cream
  { header: "rgba(232, 246, 233, 1)", dateBg: "#EBF5EB", dateText: "#3D7B3D" }, // Light Green
  { header: "rgba(235, 232, 246, 1)", dateBg: "#F3EBF8", dateText: "#6B4D7D" }, // Light Purple
  { header: "rgba(249, 243, 243, 1)", dateBg: "#EBF3F8", dateText: "#3D6B8A" }, // Light pink
  // { header: "#FDF0EB", dateBg: "#FDF0EB", dateText: "#9E5D3F" }, // Light Orange
  // { header: "#EBF8F5", dateBg: "#EBF8F5", dateText: "#3D7B6B" }, // Light Teal
];

const ServiceCard = ({ 
  icon, 
  cardHeader, 
  cardBody, 
  createdDate, 
  link, 
  className, 
  onClick, 
  module, 
  service, 
  uiworkflow,
  colorIndex = 0 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showConfigButton, setShowConfigButton] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [showBodyTooltip, setShowBodyTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const { duplicateServiceConfig } = useDuplicateServiceAPI();

  // Restricted characters for module/service names (URL-unsafe characters)
  const RESTRICTED_CHARS = /[?&=\/:#+]/g;

  // Helper function to sanitize input by removing restricted characters
  const sanitizeInput = (value) => value.replace(RESTRICTED_CHARS, "");

  // Get color scheme based on colorIndex (handle negative/undefined values)
const safeColorIndex = (colorIndex !== undefined && colorIndex >= 0) ? colorIndex : 0;
const colorScheme = cardColorPalette[safeColorIndex % cardColorPalette.length];

  // Check if this is a create card
  const isCreateCard = className?.includes("create-card");

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleMouseEnter = (ref, isHeader) => {
    if (ref.current) {
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const isOverflowing = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

      if (isOverflowing) {
        setTooltipPos({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2
        });
        if (isHeader) {
          setShowHeaderTooltip(true);
        } else {
          setShowBodyTooltip(true);
        }
      }
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      if (uiworkflow?.canvasElements) {
        try {
          localStorage.setItem("canvasElements", JSON.stringify(uiworkflow.canvasElements));
        } catch (error) {
          console.warn('Failed to save canvasElements to localStorage:', error);
        }
      }
      if (uiworkflow?.connections) {
        try {
          localStorage.setItem("connections", JSON.stringify(uiworkflow.connections));
        } catch (error) {
          console.warn('Failed to save connections to localStorage:', error);
        }
      }
      navigate(`/${window.contextPath}/${link}`);
    }
  };

  const handleConfigClick = (e) => {
    e.stopPropagation();
    setShowDuplicatePopup(true);
  };

  const handleDuplicateService = async () => {
    if (!newModuleName.trim() || !newServiceName.trim()) {
      if (!newModuleName.trim() && !newServiceName.trim()) {
        setShowToast({ type: "error", label: "MODULE_AND_SERVICE_NAME_REQUIRED" });
      } else if (!newModuleName.trim()) {
        setShowToast({ type: "error", label: "MODULE_NAME_REQUIRED" });
      } else if (!newServiceName.trim()) {
        setShowToast({ type: "error", label: "SERVICE_NAME_REQUIRED" });
      }
      return;
    }

    if (!module || !service) {
      return;
    }

    setIsDuplicating(true);
    try {
      const sanitizedNewModule = newModuleName.trim().replace(/\s+/g, "_");
      const sanitizedNewService = newServiceName.trim().replace(/\s+/g, "_");
      const duplicatedConfig = await duplicateServiceConfig.mutateAsync({
        originalModule: module,
        originalService: service,
        newModule: sanitizedNewModule,
        newService: sanitizedNewService,
      });

      if (duplicatedConfig?.uiworkflow?.canvasElements || duplicatedConfig?.mdms?.[0]?.data?.uiworkflow?.canvasElements) {
        try {
          localStorage.setItem("canvasElements", JSON.stringify(duplicatedConfig?.uiworkflow?.canvasElements || duplicatedConfig?.mdms?.[0]?.data?.uiworkflow?.canvasElements));
        } catch (error) {
          console.warn('Failed to save canvasElements to localStorage:', error);
        }
      }
      if (duplicatedConfig?.uiworkflow?.connections || duplicatedConfig?.mdms?.[0]?.data?.uiworkflow?.connections) {
        try {
          localStorage.setItem("connections", JSON.stringify(duplicatedConfig?.uiworkflow?.connections || duplicatedConfig?.mdms?.[0]?.data?.uiworkflow?.connections));
        } catch (error) {
          console.warn('Failed to save connections to localStorage:', error);
        }
      }

      setShowDuplicatePopup(false);
      setNewModuleName("");
      setNewServiceName("");

      const url = `employee/servicedesigner/Service-Builder-Home?module=${encodeURIComponent(
        sanitizedNewModule
      )}&service=${encodeURIComponent(sanitizedNewService)}`;
      
      navigate(`/${window.contextPath}/${url}`);

    } catch (error) {
      console.error("Error duplicating service:", error);
    } finally {
      setIsDuplicating(false);
    }
  };

  // ============================================
  // RENDER: Create a New Application Card
  // ============================================
  if (isCreateCard) {
    return (
      <div
        onClick={handleClick}
        style={{
          width: "303px",
          height: "247px",
          cursor: "pointer",
          gap: "16px",
          border: "2px dashed #C84C0E",
          borderRadius: "12px",
          backgroundColor: "#FFFAF7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#FFF0E5";
          e.currentTarget.style.borderColor = "#A33D0B";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFAF7";
          e.currentTarget.style.borderColor = "#C84C0E";
        }}
      >
        {/* Plus Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill="#C84C0E"/>
            <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="#C84C0E"/>
          </svg>
        </div>

        {/* Text */}
        <span
          style={{
            color: "#C84C0E",
            fontSize: "20px",
            fontWeight: 700,
            fontStyle: "bold",
            textAlign: "center",
            lineHeight: "1.3",
          }}
        >
          Create a New Service
        </span>
      </div>
    );
  }

  // ============================================
  // RENDER: Service Card
  // ============================================
  return (
    <React.Fragment>
      <div
        onClick={handleClick}
        onMouseEnter={() => setShowConfigButton(true)}
        onMouseLeave={() => setShowConfigButton(false)}
        style={{
          width: "303px",
          height: "247px",
          padding: "16px",
          gap: "16px",
          cursor: link || onClick ? "pointer" : "default",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseOver={(e) => {
          if (link || onClick) {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Duplicate Button */}
        {showConfigButton && module && service && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 10,
            }}
          >
            <Button
              style={{
                minWidth: "auto",
                height: "auto",
                padding: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E0E0E0",
                borderRadius: "4px",
              }}
              onClick={handleConfigClick}
              title="Duplicate Service"
              label={<CustomSVG.DuplicateIcon height="21" width="21" styles={{fill: "#c84c0e"}} fill="#c84c0e" viewBox="0 0 40 40" />}
            />
          </div>
        )}

        {/* Colored Header Section */}
<div
  style={{
    backgroundColor: colorScheme.header,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    minHeight: "90px",
  }}
>
  <div style={{ width: "100px", height: "54px" }}>
    {icon || <svg width="100" height="54" viewBox="0 0 100 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M97.9007 0H1.69594C1.24245 0.0034017 0.809218 0.145468 0.49129 0.395036C0.173363 0.644604 -0.00330655 0.981292 4.68817e-05 1.33124V51.7682C-0.00257673 52.1177 0.174443 52.4538 0.492317 52.7028C0.810191 52.9518 1.24301 53.0934 1.69594 53.0966H97.9007C98.3537 53.0934 98.7865 52.9517 99.1043 52.7027C99.4222 52.4537 99.5992 52.1177 99.5966 51.7682V1.33124C99.6 0.981325 99.4234 0.644666 99.1055 0.395103C98.7876 0.145541 98.3544 0.00345228 97.901 0H97.9007Z" fill="#0B4B66"/>
<path d="M95.1189 0.303894H1.85928C1.42291 0.304531 1.00469 0.438731 0.696393 0.677046C0.388097 0.91536 0.214909 1.23832 0.214844 1.57505V49.7382C0.21547 50.0746 0.388927 50.397 0.697183 50.6349C1.00544 50.8728 1.42334 51.0066 1.85928 51.0071H95.1189C95.5549 51.0066 95.9728 50.8728 96.281 50.6349C96.5893 50.397 96.7627 50.0746 96.7634 49.7382V1.57515C96.7633 1.23851 96.5903 0.915621 96.2821 0.677317C95.974 0.439014 95.5559 0.304753 95.1197 0.303989L95.1189 0.303894Z" fill="white"/>
<path d="M72.4533 28.9422C72.7801 29.0727 73.2093 28.9532 73.412 28.6751C73.6148 28.3971 73.5142 28.0658 73.1874 27.9353C72.8606 27.8047 72.4314 27.9243 72.2286 28.2024C72.0259 28.4804 72.1265 28.8116 72.4533 28.9422Z" fill="#FF6584"/>
<path d="M71.9396 35.0507C72.2664 35.1812 72.6956 35.0616 72.8984 34.7836C73.1011 34.5055 73.0005 34.1743 72.6737 34.0437C72.3469 33.9132 71.9177 34.0328 71.715 34.3108C71.5123 34.5889 71.6128 34.9201 71.9396 35.0507Z" fill="#6C63FF"/>
<path d="M70.0719 20.6579C70.6852 20.9474 71.1865 21.3578 71.5347 21.8555C71.8828 22.3532 72.0679 22.9241 72.0747 23.5212C72.0756 23.69 72.0964 23.8833 71.913 24.0176C71.845 24.07 71.7594 24.1043 71.6702 24.115C71.5809 24.1257 71.4932 24.1121 71.4215 24.0764C71.3394 24.0216 71.2854 23.9443 71.2681 23.8567C71.2508 23.769 71.271 23.6758 71.3257 23.5915C71.3803 23.5072 71.4664 23.4365 71.5705 23.3904C71.6745 23.3443 71.7908 23.3254 71.9013 23.3366C72.461 23.3527 72.7264 23.7798 72.9429 24.1224C73.4355 24.903 74.0416 25.6731 74.9993 26.1224C75.8857 26.5382 77.0974 26.6254 78.1049 26.1497C78.2809 26.067 78.1388 25.8675 77.9633 25.9503C76.9638 26.4225 75.7605 26.2539 74.9432 25.7925C74.463 25.5082 74.0572 25.1541 73.7435 24.7455C73.577 24.5388 73.4264 24.3234 73.2852 24.1036C73.1593 23.883 73.0076 23.674 72.832 23.4792C72.5264 23.1719 71.9751 22.9658 71.4487 23.1819C70.9571 23.3833 70.7903 23.9789 71.1742 24.2442C71.2602 24.2998 71.3648 24.3357 71.4785 24.3487C71.5922 24.3617 71.7115 24.3514 71.8256 24.3188C71.9398 24.2861 72.0453 24.2322 72.1327 24.1617C72.2201 24.0912 72.2866 24.0063 72.3264 23.9148C72.4139 23.7155 72.3827 23.4738 72.3665 23.2758C72.3189 22.6797 72.1024 22.1154 71.7328 21.6244C71.3633 21.1335 70.8502 20.7284 70.2312 20.4389C70.0708 20.3658 69.9118 20.5852 70.0719 20.6579Z" fill="#CCCCCC"/>
<path d="M90.0428 19.7578C89.5549 19.5276 89.1562 19.2012 88.8793 18.8054C88.6024 18.4096 88.4551 17.9557 88.4496 17.4807C88.4489 17.3464 88.4324 17.1926 88.5782 17.086C88.6322 17.0443 88.7003 17.017 88.7713 17.0085C88.8423 17 88.912 17.0108 88.9691 17.0391C89.0341 17.0829 89.0767 17.1443 89.0902 17.214C89.1038 17.2836 89.0877 17.3576 89.0443 17.4245C89.0009 17.4914 88.9327 17.5475 88.8501 17.5842C88.7676 17.6209 88.6753 17.6361 88.5875 17.6275C88.1425 17.6145 87.9315 17.2751 87.759 17.0025C87.3673 16.3817 86.8852 15.7692 86.1232 15.4117C85.4187 15.081 84.4545 15.0115 83.6531 15.3899C83.5128 15.4561 83.626 15.6146 83.7657 15.5484C84.5604 15.1732 85.5178 15.3065 86.1677 15.6739C86.5496 15.9001 86.8723 16.1817 87.1219 16.5067C87.2543 16.6711 87.374 16.8425 87.4862 17.0175C87.5864 17.1931 87.707 17.3593 87.8467 17.5142C88.0897 17.7587 88.5279 17.9223 88.9467 17.7505C89.0403 17.7075 89.1226 17.6487 89.1869 17.5787C89.2512 17.5087 89.2957 17.4295 89.317 17.3474C89.3382 17.2653 89.3355 17.1825 89.3091 17.1058C89.2828 17.0291 89.2334 16.9605 89.1651 16.9055C89.0966 16.8613 89.0135 16.8327 88.9231 16.8223C88.8326 16.812 88.7378 16.8202 88.6469 16.8461C88.5561 16.8721 88.4722 16.915 88.4027 16.9711C88.3332 17.0271 88.2802 17.0946 88.2486 17.1674C88.1967 17.3374 88.1859 17.51 88.2167 17.6756C88.2546 18.1499 88.427 18.5988 88.721 18.9893C89.0151 19.3798 89.4234 19.702 89.9159 19.9322C90.0434 19.9903 90.1701 19.8157 90.0428 19.7578Z" fill="#CCCCCC"/>
<path d="M87.1657 25.0742L86.5996 24.8438L85.446 26.4571L86.0121 26.6876L87.1657 25.0742Z" fill="#CCCCCC"/>
<path d="M77.7169 19.8396L78.4746 19.6579L77.8955 17.9919L77.1379 18.1737L77.7169 19.8396Z" fill="#B3B3B3"/>
<path d="M65.8772 36.8621L66.0352 37.336L68.2717 36.7784L68.1137 36.3045L65.8772 36.8621Z" fill="#FF6584"/>
<path d="M23.9077 32.2597C24.4221 32.1607 24.7352 31.7586 24.6069 31.3616C24.4787 30.9647 23.9577 30.7231 23.4432 30.8221C22.9288 30.921 22.6157 31.3231 22.744 31.7201C22.8722 32.1171 23.3933 32.3586 23.9077 32.2597Z" fill="#6C63FF"/>
<path d="M15.3721 14.7056C15.7395 14.6349 15.9631 14.3477 15.8715 14.0642C15.7799 13.7806 15.4078 13.6081 15.0403 13.6788C14.6729 13.7495 14.4493 14.0366 14.5409 14.3202C14.6325 14.6037 15.0046 14.7762 15.3721 14.7056Z" fill="#FF6584"/>
<path d="M19.3213 28.5613C19.6887 28.4906 19.9123 28.2035 19.8207 27.9199C19.7291 27.6364 19.357 27.4638 18.9895 27.5345C18.6221 27.6052 18.3985 27.8924 18.4901 28.1759C18.5817 28.4595 18.9539 28.632 19.3213 28.5613Z" fill="#6C63FF"/>
<path d="M22.8408 36.8278C23.2083 36.7571 23.4319 36.4699 23.3403 36.1864C23.2486 35.9029 22.8765 35.7303 22.5091 35.801C22.1416 35.8717 21.918 36.1589 22.0096 36.4424C22.1012 36.726 22.4734 36.8985 22.8408 36.8278Z" fill="#E6E6E6"/>
<path d="M11.0791 19.6768C11.4465 19.6061 11.6702 19.3189 11.5785 19.0354C11.4869 18.7519 11.1148 18.5793 10.7473 18.65C10.3799 18.7207 10.1563 19.0079 10.2479 19.2914C10.3395 19.575 10.7117 19.7475 11.0791 19.6768Z" fill="#CCCCCC"/>
<path d="M29.2249 29.1482C28.6832 29.0061 28.1928 28.767 27.7939 28.4504C27.3951 28.1338 27.0991 27.7488 26.9303 27.3269C26.8833 27.2071 26.8148 27.0727 26.9163 26.959C26.9532 26.915 27.0083 26.882 27.0727 26.8653C27.1371 26.8486 27.2069 26.8493 27.2707 26.8672C27.3474 26.8977 27.4089 26.9469 27.4458 27.0072C27.4826 27.0674 27.4928 27.1353 27.4747 27.2004C27.4566 27.2655 27.4113 27.3242 27.3457 27.3675C27.2801 27.4108 27.1978 27.4362 27.1117 27.4398C26.6852 27.4857 26.3679 27.2105 26.111 26.9902C25.5253 26.4887 24.8577 26.0051 24.0122 25.7849C23.2297 25.5812 22.2921 25.6435 21.6627 26.0832C21.5526 26.1602 21.7145 26.2864 21.8244 26.2098C22.4486 25.7737 23.4027 25.7697 24.145 26.0126C24.5849 26.1648 24.9879 26.3739 25.3364 26.6309C25.5186 26.7601 25.6911 26.8972 25.8579 27.0383C26.0134 27.1817 26.185 27.314 26.3709 27.4339C26.6855 27.6202 27.1572 27.7096 27.4954 27.5028C27.5693 27.4526 27.627 27.3896 27.6638 27.3191C27.7007 27.2486 27.7156 27.1723 27.7074 27.0966C27.6993 27.0208 27.6682 26.9475 27.6168 26.8826C27.5654 26.8178 27.495 26.7631 27.4113 26.7229C27.3312 26.6923 27.2425 26.6776 27.1532 26.68C27.0638 26.6824 26.9766 26.7018 26.8995 26.7366C26.8223 26.7714 26.7575 26.8204 26.7108 26.8792C26.6642 26.9381 26.6373 27.0049 26.6324 27.0738C26.6417 27.2317 26.6909 27.3867 26.7771 27.5301C26.9764 27.9473 27.2945 28.3246 27.7079 28.6343C28.1212 28.944 28.6194 29.1782 29.1656 29.3196C29.3066 29.355 29.3665 29.1835 29.2258 29.1482L29.2249 29.1482Z" fill="#CCCCCC"/>
<path d="M12.6567 25.5492L13.2344 25.8171L14.3749 24.3524L13.7972 24.0845L12.6567 25.5492Z" fill="#B3B3B3"/>
<path d="M12.5718 37.9028C13.0862 37.8038 13.3993 37.4017 13.271 37.0048C13.1427 36.6078 12.6217 36.3662 12.1073 36.4652C11.5928 36.5642 11.2798 36.9662 11.408 37.3632C11.5363 37.7602 12.0573 38.0018 12.5718 37.9028Z" fill="#6C63FF"/>
</svg>}
  </div>
</div>

        {/* Body Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1
          }}
        >
          {/* Title */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter(headerRef, true)}
            onMouseLeave={() => setShowHeaderTooltip(false)}
          >
            <h3
              ref={headerRef}
              style={{
                color: "rgba(11, 75, 102, 1)",
                fontSize: "16px",
                fontWeight: 700,
                fontStyle: "bold",
                margin: "0 0 8px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: "1.3",
              }}
            >
              {cardHeader || "Service Name"}
            </h3>
            {showHeaderTooltip && (
              <span
                style={{
                  position: "fixed",
                  top: `${tooltipPos.top}px`,
                  left: `${tooltipPos.left}px`,
                  transform: "translateX(-50%)",
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  zIndex: 1000,
                  whiteSpace: "nowrap",
                }}
              >
                {cardHeader}
              </span>
            )}
          </div>

          {/* Description */}
          <div
            style={{ position: "relative", flex: 1 }}
            onMouseEnter={() => handleMouseEnter(bodyRef, false)}
            onMouseLeave={() => setShowBodyTooltip(false)}
          >
            <p
              ref={bodyRef}
              style={{
                color: "rgba(120, 120, 120, 1)",
                fontSize: "14px",
                fontWeight: 400,
                margin: "0 0 12px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.4",
              }}
            >
              {cardBody || t("STUDIO_CREATE_SERVICE_DESCRIPTION")}
            </p>
            {showBodyTooltip && (
              <span
                style={{
                  position: "fixed",
                  top: `${tooltipPos.top}px`,
                  left: `${tooltipPos.left}px`,
                  transform: "translateX(-50%)",
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  zIndex: 1000,
                  maxWidth: "200px",
                  whiteSpace: "normal",
                }}
              >
                {cardBody}
              </span>
            )}
          </div>

          {/* Date Badge */}
          {createdDate && (
            <div
              style={{
                backgroundColor: "rgba(239, 248, 255, 1)",
                color: "rgba(11, 75, 102, 1)",
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                textAlign: "center",
                fontWeight: "400",
              }}
            >
              Created on {createdDate}
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Popup */}
      {showDuplicatePopup && (
        <PopUp
          // header={t("DUPLICATE_SERVICE")}
          // headerBarMain={t("ENTER_NEW_SERVICE_DETAILS")}
          heading={t("CREATE_DUPLICATE_SERVICE_HEADER")}
          subheading={t("CREATE_DUPLICATE_SERVICE_SUB_HEADER")}
          actionCancelLabel={t("CANCEL")}
          actionCancelOnSubmit={() => setShowDuplicatePopup(false)}
          onClose={() => setShowDuplicatePopup(false)}
          style={{maxWidth:"47%"}}
          children={[
            <div>
               {/* <TextBlock
                header={t("CREATE_DUPLICATE_SERVICE_HEADER")}
                subHeader={t("CREATE_DUPLICATE_SERVICE_SUB_HEADER")}
                subHeaderClasName="header-popup"
                className="typography heading-m"
              /> */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    gap: "1rem",
                  }}
                >
                  <label style={{ minWidth: "204px", fontWeight: "500", color: "#333" }}>
                    {t("NEW_MODULE_NAME")} <span className="mandatory-span-popup">*</span>
                  </label>
                  <TextInput
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(sanitizeInput(e.target.value))}
                    style={{ flex: 1 }}
                    placeholder={t("ENTER_NEW_MODULE_NAME")}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <label style={{ minWidth: "204px", fontWeight: "500", color: "#333" }}>
                    {t("NEW_SERVICE_NAME")} <span className="mandatory-span-popup">*</span>
                  </label>
                  <TextInput
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(sanitizeInput(e.target.value))}
                    style={{ flex: 1 }}
                    placeholder={t("ENTER_NEW_SERVICE_NAME")}
                  />
                </div>
              </div>
              <AlertCard label={t("DUPLICATE_INFO")} text={t("DUPLICATE_INFO_DEFINITION")} />
            </div>,
          ]}
          footerChildren={[
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <Button
                variation="secondary"
                label={t("CANCEL")}
                onClick={() => setShowDuplicatePopup(false)}
                disabled={isDuplicating}
              />
              <Button
                variation="primary"
                label={isDuplicating ? t("DUPLICATING") : t("DUPLICATE")}
                onClick={handleDuplicateService}
                disabled={!newModuleName.trim() || !newServiceName.trim() || isDuplicating}
              />
            </div>,
          ]}
        />
      )}
      {showToast && (
        <Toast
          type={showToast.type}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
          style={{ zIndex: 10001 }}
        />
      )}
    </React.Fragment>
  );
};

export default ServiceCard;