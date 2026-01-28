import React from "react";
import PropTypes from "prop-types";
import { Card, StringManipulator } from "../atoms";
import { iconRender } from "../utils/iconRender";
import { Colors } from "../constants/colors/colorconstants";
import { Spacers } from "../constants/spacers/spacers";
import { useTranslation } from "react-i18next";

const MenuCard = ({
  icon,
  menuName,
  className,
  styles,
  description,
  onClick,
}) => {
  const { t } = useTranslation();
  const primaryIconColor = Colors.lightTheme.primary[1];
  const iconSize = Spacers.spacer8;

  return (
    <Card
      className={`digit-menu-card ${className} ${onClick ? "clickable" : ""}`}
      style={styles}
      onClick={onClick}
    >
      <div className={`icon-menu-header`}>
        {icon && (
          <div className={`digit-menucard-icon`}>
            {iconRender(
              icon,
              primaryIconColor,
              iconSize,
              iconSize,
              `digit-menucard-icon`
            )}
          </div>
        )}
        {menuName && (
          <div className="digit-menuacard-menuName">
            {StringManipulator(
              "TOSENTENCECASE",
              StringManipulator("TRUNCATESTRING", t(menuName), {
                maxLength: 64,
              })
            )}
          </div>
        )}
      </div>
      {description && (
        <div className="digit-menucard-description">
          {StringManipulator(
            "TOSENTENCECASE",
            StringManipulator("TRUNCATESTRING", t(description), {
              maxLength: 256,
            })
          )}
        </div>
      )}
    </Card>
  );
};

MenuCard.propTypes = {
  icon: PropTypes.node.isRequired,
  menuName: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  styles: PropTypes.object,
  onClick: PropTypes.func,
};

MenuCard.defaultProps = {
  className: "",
  styles: {},
  menuName: "",
  description: "",
  icon: "",
  onClick: () => {},
};

export default MenuCard;
