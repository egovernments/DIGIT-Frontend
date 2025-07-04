import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { CustomSVG } from "./CustomSVG";
import { useTranslation } from "react-i18next";

const SummaryCardFieldPair = ({
  label,
  value,
  inline,
  className,
  style,
  type,
  renderCustomContent,
}) => {
  const { t } = useTranslation();
  const renderFileIcon = (fileType, onClick) => {
    const handleClick =
      onClick && typeof onClick === "function" ? onClick : undefined;

    switch (fileType) {
      case "pdf":
        return (
          <CustomSVG.PdfFile
            className="uploadWidget-icon"
            onClick={handleClick}
          />
        );
      case "png":
        return (
          <CustomSVG.PngFile
            className="uploadWidget-icon"
            onClick={handleClick}
          />
        );
      case "jpeg":
      case "pjpeg":
        return (
          <CustomSVG.JpgFile
            className="uploadWidget-icon"
            onClick={handleClick}
          />
        );
      case "excel":
        return (
          <CustomSVG.XlsxFile
            className="uploadWidget-icon"
            onClick={handleClick}
          />
        );
      case "word":
        return (
          <CustomSVG.DocFile
            className="uploadWidget-icon"
            onClick={handleClick}
          />
        );
      default:
        return (
          <CustomSVG.DocumentSVG
            className="uploadWidget-icon"
            fill={"#505A5F"}
            onClick={handleClick}
          />
        );
    }
  };

  const renderValue = () => {
    switch (type) {
      case "text":
        return <div className="digit-viewcard-value">{t(value)}</div>;
      case "image":
        return (
          <img
            src={value?.src}
            alt={value?.alt}
            className="digit-viewcard-image"
            width={value?.width}
            height={value?.height}
          />
        );
      case "document":
        return renderFileIcon(value?.fileType, value?.onClick);
      case "action":
        return (
          <Button
            className={"digit-viewcard-action"}
            onClick={value?.onClick}
            label={value?.label}
            size={value?.size}
            variation={value?.variation}
            style={value?.style}
            icon={value?.icon}
          />
        );
      case "custom":
        return renderCustomContent ? renderCustomContent(value) : null;
      default:
        return <div className="digit-viewcard-value">{t(value)}</div>;
    }
  };

  return (
    <div
      style={style}
      className={`digit-viewcard-field-pair ${className || ""} ${
        inline ? "inline" : ""
      }`}
      role="group"
      aria-labelledby={label}
    >
      <div className="digit-viewcard-label" id={label}>{label}</div>
      {renderValue()}
    </div>
  );
};

SummaryCardFieldPair.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.oneOf(["text", "image", "document", "action", "custom"]),
  inline: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  renderCustomContent: PropTypes.func,
};

export default SummaryCardFieldPair;