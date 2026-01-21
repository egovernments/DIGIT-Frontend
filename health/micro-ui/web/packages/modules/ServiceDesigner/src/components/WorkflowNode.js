import React, { useState } from "react";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const WorkflowNode = ({
  type,
  State,
  desc,
  elementId,
  icon,
  nodetype,
  roles = [],
  sla,
  checklist,
  generatedoc,
  sendnotif,
  onLeftAction,
  onRightAction,
  onEditAction,
  onDeleteAction,
  roleModule,
  roleService,
  leftButtonTooltip = "Left Action",
  rightButtonTooltip = "Right Action",
  editButtonTooltip = "Edit Action",
  deleteButtonTooltip = "Delete Action"
}) => {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const {t} = useTranslation();

  // Format role name for display: remove module_service prefix
  const formatRoleNameForDisplay = (roleName) => {
    if (!roleName) return "";

    // Don't format STUDIO_CITIZEN or STUDIO_ADMIN
    if (roleName === "STUDIO_CITIZEN" || roleName === "STUDIO_ADMIN") {
      return roleName;
    }

    // Remove module_service prefix if present
    const prefix = roleModule && roleService ? `${roleModule.toUpperCase()}_${roleService.toUpperCase()}_` : "";
    let formattedRole = roleName;

    if (prefix && formattedRole.startsWith(prefix)) {
      formattedRole = formattedRole.substring(prefix.length);
    }

    // Convert underscores to spaces and capitalize each word
    return formattedRole
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const iconMap = {
    start : <CustomSVG.StartStateIcon width={24} height={24}/>,
    intermediate : <CustomSVG.IntermediateStateIcon width={24} height={24}/>,
    end: <CustomSVG.EndStateIcon width={24} height={24}/>,
  }

  // Get display label - show default labels only for display, not for actual data
  const getDisplayLabel = (t) => {
    if (State && State.trim() !== "") {
      return State;
    }
    // Return default display labels based on node type
    switch(nodetype) {
      case "start":
        return t("START_STATE");
      case "end":
        return t("END_STATE");
      case "intermediate":
        return t("INTER_STATE");
      default:
        return "State";
    }
  };


  const handleLeftClick = (elementId, e) => {
    e.stopPropagation();
    if (onLeftAction) onLeftAction(elementId, e);
  };

  const handleRightClick = (elementId, e) => {
    e.stopPropagation();
    if (onRightAction) onRightAction(elementId, e);
  };

  const handleEditClick = (elementId, e) => {
    e.stopPropagation();
    onEditAction(elementId, e);
  }

  const handleDeleteClick = (elementId, e) => {
    e.stopPropagation();
    onDeleteAction(elementId,e);
  }

  // Function to render roles with view more functionality
  const renderRoles = () => {
    if (!roles || roles.length === 0) return null;

    const maxVisibleRoles = 1;
    const visibleRoles = showAllRoles ? roles : roles.slice(0, maxVisibleRoles);
    const hasMoreRoles = roles.length > maxVisibleRoles;
    const {t} = useTranslation()

    return (
      <div className="conditional-icons-container">
        <div className="roles-list">
          {visibleRoles.map((role, index) => (
            <p key={index} className={`state-description`}>
              {formatRoleNameForDisplay(role.code || role.name)}
            </p>
          ))}
          {hasMoreRoles && !showAllRoles && (
            <button 
              className="view-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllRoles(true);
              }}
              title={`View ${roles.length - maxVisibleRoles} more roles`}
            >
              +{roles.length - maxVisibleRoles} more
            </button>
          )}
          {showAllRoles && hasMoreRoles && (
            <button 
              className="view-less-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllRoles(false);
              }}
            >
              Show less
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="card-container">
      {/* Top right buttons - Edit and Remove */}
      <div className="top-actions">
        {/* Edit Button */}
        {onEditAction && (
          <button
            onClick={(e) => handleEditClick(elementId, e)}
            title={editButtonTooltip}
            className="node-buttons"
          >
            <CustomSVG.EditIcon />
          </button>
        )}

        {/* Remove Button */}
        {onDeleteAction && (
          <button
            onClick={(e)=>handleDeleteClick(elementId,e)}
            title={deleteButtonTooltip}
            className="node-buttons"
          >
            <CustomSVG.DustbinIcon />
          </button>
        )}
      </div>
      <div className="state-card" style={{ width: "215px", whiteSpace: "nowrap", textOverflow: "ellipsis"}} >
        {/* Left Action Button */}
        {onLeftAction && (
          <button
            className="action-button left-action"
            onClick={(e) => handleLeftClick(elementId, e)}
            title={leftButtonTooltip}
          >
          </button>
        )}

        <div className="state-card-content">
          <div className="text-section state-desc">
            <h3 className="state-title">
              <div className="state-icon">
                {iconMap[nodetype] || <CustomSVG.EditIcon />}
              </div>
              {getDisplayLabel(t)}
            </h3>
            <p className="state-description state-desc">{desc}</p>
            {renderRoles()}
          </div>
        </div>

        {/* Right Action Button */}
        {onRightAction && (
          <button
            className="action-button right-action"
            onClick={(e) => handleRightClick(elementId, e)}
            title={rightButtonTooltip}
            style={{padding:"0px"}}
          >
            <CustomSVG.AddIcon height="15" width="15" fill="white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkflowNode;