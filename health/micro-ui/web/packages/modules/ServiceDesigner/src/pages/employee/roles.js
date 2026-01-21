import React, { useState, useEffect, useRef } from "react";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardText, Loader, Toast } from "@egovernments/digit-ui-components";
import RoleCard from "../../components/RoleCard";
import { useTranslation } from "react-i18next";
import { PopUp } from "@egovernments/digit-ui-components";
import { FieldV1 } from "@egovernments/digit-ui-components";
import AccessCard from "../../components/AccessCard";
import { CardHeader } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { Switch } from "@egovernments/digit-ui-components";
import { useRoleConfigAPI } from "../../hooks/useRoleConfigAPI";
import { AlertCard } from "@egovernments/digit-ui-components";

const Roles = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const roleModule = searchParams.get("module") || "Studio";
    const roleService = searchParams.get("service") || "Service";
    const roleCategory = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;
    const [showToast, setShowToast] = useState(null);
    const [selectedElement, setSelectedElement] = useState(false);
    const [stateData, setStateData] = useState({
        name: "",
        desc: "",
        isNew: false,
        editor: false,
        viewer: false,
        creater: false,
        selfRegistration: false,
        originalName: "" // Store the original role name for updates
    });
    const [rolePopup, setRolePopup] = useState(false);
    const [editPopup, setEditPopup] = useState(false);

    // Use the new role config API hook
    const { saveRoleConfig, updateRoleConfig, searchRoleConfigs, searchRoleConfigByName } = useRoleConfigAPI();
    const { data: roleConfigs, isLoading: moduleListLoading } = searchRoleConfigs(roleModule, roleService);
    const roleCodes = roleConfigs?.map(role => role?.data) || [];

    const onDataChange = (e) => {
        if (Array.isArray(e)) {
            setStateData(prev => ({
                ...prev,
                [e[0]]: e[1].target.checked
            }));
        }
        else if (e?.target) {
            const { name, type, value, checked } = e.target;
            setStateData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleCreateClick = () => {
        setRolePopup(true);
        setStateData({
            name: "",
            desc: "",
            isNew: true,
            editor: false,
            viewer: false,
            creater: false,
            selfRegistration: false,
            originalName: "",
            isDefaultRole: false
        });
    };

    const handleEditClick = (roleData) => {
        setEditPopup(true);
        const originalRoleName = roleData?.code || roleData?.name;
        // STUDIO_CITIZEN is always a default role, regardless of the isDefaultRole flag
        const isDefaultRole = Boolean(roleData?.additionalDetails?.isDefaultRole) || originalRoleName === "STUDIO_CITIZEN";
        setStateData({
            name: formatRoleName(originalRoleName), // Display formatted name
            desc: roleData?.description || "",
            isNew: false,
            editor: Boolean(roleData?.additionalDetails?.access?.editor),
            viewer: Boolean(roleData?.additionalDetails?.access?.viewer),
            creater: Boolean(roleData?.additionalDetails?.access?.creater),
            selfRegistration: Boolean(roleData?.additionalDetails?.selfRegistration),
            originalName: originalRoleName, // Store the original name for updates
            isDefaultRole: isDefaultRole // Track if this is a default role
        });
    };

    const normalizeRoleName = (roleName) => {
        return roleName.toLowerCase().replace(/[\s_]/g, '');
    };

    // Format role name: remove module_service prefix, underscores and convert to camel case
    const formatRoleName = (roleName) => {
        // Display STUDIO_CITIZEN as "Citizen"
        if (roleName === "STUDIO_CITIZEN") {
            return "Citizen";
        }

        let formattedRole = roleName;

        // Remove module_service prefix if module and service are provided
        const prefix = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}_`;
        if (formattedRole.startsWith(prefix)) {
            formattedRole = formattedRole.substring(prefix.length);
        }

        // Remove underscores, split into words, and convert to camel case
        return formattedRole
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Convert formatted name back to original format (uppercase with underscores)
    const unformatRoleName = (formattedName, originalName) => {
        // If it's "Citizen", convert back to STUDIO_CITIZEN
        if (formattedName === "Citizen") {
            return "STUDIO_CITIZEN";
        }

        // If it's STUDIO_CITIZEN, return as-is
        if (formattedName === "STUDIO_CITIZEN") {
            return formattedName;
        }

        // Convert spaces to underscores and make uppercase
        let unformatted = formattedName.replace(/ /g, "_").toUpperCase();

        // If the original name had the module_service prefix, add it back
        const prefix = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}_`;
        if (originalName && originalName.startsWith(prefix) && !unformatted.startsWith(prefix)) {
            unformatted = prefix + unformatted;
        }

        return unformatted;
    };

    const updateWorkflowRoleReferencesInLocalStorage = (oldRoleCode, newRoleCode) => {
        try {
            let canvasUpdated = false;
            let connectionsUpdated = false;

            // Get canvasElements from localStorage
            const canvasElementsStr = localStorage.getItem("canvasElements");
            if (canvasElementsStr && canvasElementsStr !== "undefined") {
                const canvasElements = JSON.parse(canvasElementsStr);

                // Update roles in canvas elements (states)
                canvasElements.forEach(element => {
                    if (element.roles && Array.isArray(element.roles)) {
                        element.roles.forEach(role => {
                            if (role.code === oldRoleCode) {
                                role.code = newRoleCode;
                                canvasUpdated = true;
                            }
                        });
                    }
                });

                // Save back to localStorage if updated
                if (canvasUpdated) {
                    localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
                }
            }

            // Get connections from localStorage
            const connectionsStr = localStorage.getItem("connections");
            if (connectionsStr && connectionsStr !== "undefined") {
                const connections = JSON.parse(connectionsStr);

                // Update roles in connections (actions)
                connections.forEach(connection => {
                    if (connection.aroles && Array.isArray(connection.aroles)) {
                        connection.aroles.forEach(role => {
                            if (role.code === oldRoleCode) {
                                role.code = newRoleCode;
                                connectionsUpdated = true;
                            }
                        });
                    }
                });

                // Save back to localStorage if updated
                if (connectionsUpdated) {
                    localStorage.setItem("connections", JSON.stringify(connections));
                }
            }

            return canvasUpdated || connectionsUpdated;
        } catch (error) {
            console.error("Failed to update workflow role references in localStorage:", error);
            return false;
        }
    };

    const generateRolePayload = (roleName, description, access, oldRoleName = null, selfRegistration = false, isDefaultRole = false) => {
        return {
            module: roleModule,
            service: roleService,
            roleName: roleName,
            description: description,
            access: access,
            oldRoleName: oldRoleName,
            selfRegistration: selfRegistration,
            isDefaultRole: isDefaultRole
        };
    };

    const createRole = async (e) => {
        if (stateData.name != "" && (stateData.creater || stateData.editor || stateData.viewer)) {
            // Validate role name - only alphanumeric, spaces, and underscores allowed
            const roleNameRegex = /^[a-zA-Z0-9_ ]+$/;
            if (!roleNameRegex.test(stateData.name)) {
                setShowToast({ key: true, type: "error", label: "ROLE_NAME_INVALID_CHARACTERS" });
                return;
            }

            // Prevent creating a role with the name "Citizen" (reserved for STUDIO_CITIZEN)
            if (stateData.name.trim().toLowerCase() === "citizen" && stateData.originalName !== "STUDIO_CITIZEN") {
                setShowToast({ key: true, type: "error", label: "ROLE_NAME_CITIZEN_RESERVED" });
                return;
            }

            const access = {
                editor: stateData.editor,
                viewer: stateData.viewer,
                creater: stateData.creater
            };

            if (stateData.isNew == true) {
                const normalizedNewName = normalizeRoleName(stateData.name);
                const existingRole = roleCodes.find(role => normalizeRoleName(role.code) === normalizedNewName);
                const existingSelfRegRole = roleCodes.find(role => role?.additionalDetails?.selfRegistration === true);
                if (existingRole) {
                    setShowToast({ key: true, type: "error", label: "ROLE_NAME_EXISTS" });
                }
                else {
                    if (stateData.selfRegistration === true && existingSelfRegRole) {
                        setShowToast({ key: true, type: "error", label: "ONLY_ONE_SELF_REGISTRATION_ROLE_ALLOWED" });
                        return;
                    }
                    try {
                        const rolePayload = generateRolePayload(stateData.name, stateData.desc, access, null, stateData.selfRegistration, false);
                        const response = await saveRoleConfig.mutateAsync(rolePayload);
                        
                        if (response?.mdms) {
                            setShowToast({ key: true, type: "success", label: "ROLE_ADDED_SUCCESSFULLY" });
                            setStateData({
                                name: "",
                                desc: "",
                                isNew: false,
                                viewer: false,
                                editor: false,
                                creater: false,
                                selfRegistration: false,
                                originalName: "",
                            });
                            setRolePopup(false);
                            setSelectedElement(false);
                            window.location.reload();
                        }
                        else {
                            setShowToast({ key: true, type: "error", label: "ERROR_OCCURED_DURING_CREATION" });
                            setStateData({
                                name: "",
                                desc: "",
                                isNew: false,
                                viewer: false,
                                editor: false,
                                creater: false,
                                selfRegistration: false,
                                originalName: "",
                            });
                            setRolePopup(false);
                        }
                    } catch (error) {
                        setShowToast({ key: true, type: "error", label: "ERROR_OCCURED_DURING_CREATION" });
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: false,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                        });
                        setRolePopup(false);
                    }
                }
            }
            else {
                try {
                    // Convert formatted name back to original format
                    const unformattedName = unformatRoleName(stateData.name, stateData.originalName);
                    const formattedOriginalName = formatRoleName(stateData.originalName);

                    // Prevent name changes for default roles
                    const isNameUnchanged = stateData.name === formattedOriginalName ||
                                          (stateData.originalName === "STUDIO_CITIZEN" && stateData.name === "Citizen");
                    if (stateData.isDefaultRole && !isNameUnchanged) {
                        setShowToast({ key: true, type: "error", label: "DEFAULT_ROLE_NAME_CANNOT_BE_CHANGED" });
                        return;
                    }

                    // Validate role name on update
                    const roleNameRegex = /^[a-zA-Z0-9_ ]+$/;
                    if (!roleNameRegex.test(stateData.name)) {
                        setShowToast({ key: true, type: "error", label: "ROLE_NAME_INVALID_CHARACTERS" });
                        return;
                    }

                    const normalizedNewName = normalizeRoleName(unformattedName);
                    const normalizedOriginalName = normalizeRoleName(stateData.originalName);
                    if (normalizedNewName !== normalizedOriginalName) {
                        const existingRole = roleCodes.find(role =>
                            normalizeRoleName(role.code) === normalizedNewName &&
                            role.code !== stateData.originalName
                        );
                        if (existingRole) {
                            setShowToast({ key: true, type: "error", label: "ROLE_NAME_EXISTS" });
                            return;
                        }
                    }

                    const existingSelfRegRole = roleCodes.find(role => role?.additionalDetails?.selfRegistration === true);
                    if (stateData.selfRegistration === true && existingSelfRegRole && existingSelfRegRole.code !== stateData.originalName) {
                        setShowToast({ key: true, type: "error", label: "ONLY_ONE_SELF_REGISTRATION_ROLE_ALLOWED" });
                        return;
                    }
                    const rolePayload = generateRolePayload(unformattedName, stateData.desc, access, stateData.originalName, stateData.selfRegistration, stateData.isDefaultRole);
                    const response = await updateRoleConfig.mutateAsync(rolePayload);
                    
                    if (response?.mdms) {
                        // Update workflow references in localStorage if role name changed
                        const normalizedNewName = normalizeRoleName(unformattedName);
                        const normalizedOriginalName = normalizeRoleName(stateData.originalName);

                        if (normalizedNewName !== normalizedOriginalName) {
                            const updated = updateWorkflowRoleReferencesInLocalStorage(stateData.originalName, unformattedName);
                        }

                        setShowToast({ key: true, type: "success", label: "ROLE_UPDATED_SUCCESSFULLY" });
                        setEditPopup(false);
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: false,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                            isDefaultRole: false
                        });
                        window.location.reload();
                    }
                    else {
                        setShowToast({ key: true, type: "error", label: "ERROR_OCCURED_DURING_UPDATION" });
                    }
                } catch (error) {
                    setShowToast({ key: true, type: "error", label: "ERROR_OCCURED_DURING_UPDATION" });
                }
            }
        }
        else {
            if (stateData.name == "") {
                setShowToast({ key: true, type: "error", label: "ROLE_NAME_IS_REQUIRED" });
            }
            else {
                setShowToast({ key: true, type: "error", label: "ATLEAST_ONE_IS_SELECTED" });
            }
        }
    }

    const cancel = (e) => {
        setEditPopup(false);
        setStateData({
            name: "",
            desc: "",
            isNew: false,
            editor: false,
            viewer: false,
            creater: false,
            selfRegistration: false,
            originalName: "",
            isDefaultRole: false
        });
    }

    if (moduleListLoading) {
        return <Loader />
    }

    return (
        <React.Fragment>
            <div style={{ 
                fontSize: "2rem",
                fontWeight: 700,
                color: "#0B4B66",
                fontFamily: "Roboto condensed" 
            }}>
                {t("ROLES_HEADER")}
            </div> 
      
            <div style={{
                fontSize: "1rem",
                color: "#505A5F",
                margin: "1rem 0",
            }}>
                {t("ROLES_HEADER_DESCRIPTION")}
            </div>

            <div style={{ display: "flex", minHeight: "670px" }}>
                <Card style={{ flex: 1, minHeight: "670px", display: "flex", flexDirection: "column" }} className="Workflow-card">
                    <div style={{ flex: 1, overflow: "auto" }}>
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", padding: "24px", gap: "16px" }}>
                            {/* Create New Role Card */}
                            <RoleCard 
                                isNew={true}
                                onClick={handleCreateClick}
                            />
                            
                            {/* Existing Role Cards */}
                            {roleCodes.map((role, index) => (
                                <RoleCard 
                                    key={role.code || index}
                                    roleName={formatRoleName(role.code)}
                                    roleCode={role.code}
                                    description={role.description}
                                    colorIndex={index}
                                    access={role?.additionalDetails?.access || {}}
                                    isDefaultRole={Boolean(role?.additionalDetails?.isDefaultRole) || role.code === "STUDIO_CITIZEN"}
                                    selfRegistration={Boolean(role?.additionalDetails?.selfRegistration)}
                                    module={roleModule}
                                    service={roleService}
                                    onClick={() => handleEditClick(role)}
                                    onEditClick={() => handleEditClick(role)}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Create role Popup */}
            {rolePopup && (
                <PopUp
                    type={"default"}
                    heading={t("CREATE_NEW_ROLE")}
                    children={[]}
                    style={{ width: "30rem", zIndex: 9999 }}
                    footerStyles={{ width: "100%" }}
                    onOverlayClick={() => {
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: true,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                        });
                        setRolePopup(false);
                    }}
                    onClose={() => {
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: true,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                        });
                        setRolePopup(false);
                    }}
                    footerChildren={[
                        <div style={{ display: "flex", width: "100%" }}>
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                style={{ margin: "0 8px", borderRadius: "6px", width: "100%" }}
                                label={t("CANCEL")}
                                onClick={(e) => setRolePopup(false)}
                            />
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"primary"}
                                label={t("CREATE_ROLE")}
                                style={{ margin: "0 8px", borderRadius: "6px", width: "100%" }}
                                onClick={(e) => { createRole(e) }}
                            />
                        </div>
                    ]}
                    sortFooterChildren={true}
                >
                    <FieldV1
                        label={t("ROLE_NAME")}
                        onChange={(e) => onDataChange(e)}
                        populators={{
                            name: "name",
                            alignFieldPairVerically: true,
                            fieldPairClassName: "workflow-field-pair",
                        }}
                        props={{
                            fieldStyle: { width: "100%" }
                        }}
                        required
                        type="text"
                        infoMessage={t("ROLE_NAME_ALPHANUMERIC_INFO")}
                        value={stateData.name}
                    />
                    <FieldV1
                        label={t("ROLE_DESC")}
                        onChange={(e) => onDataChange(e)}
                        populators={{
                            name: "desc",
                            alignFieldPairVerically: true,
                            fieldPairClassName: "workflow-field-pair",
                        }}
                        props={{
                            fieldStyle: { width: "100%" }
                        }}
                        type="text"
                        infoMessage={t("ROLE_DESC_INFO")}
                        value={stateData.desc}
                    />
                    <AccessCard isRequired={true} data={stateData} onChange={onDataChange} />
                </PopUp>
            )}

            {/* Edit role Popup */}
            {editPopup && (
                <PopUp
                    type={"default"}
                    heading={t("EDIT_HEADING")}
                    children={[]}
                    style={{ width: "30rem", zIndex: 9999 }}
                    footerStyles={{ width: "100%" }}
                    onOverlayClick={() => {
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: false,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                            isDefaultRole: false
                        });
                        setEditPopup(false);
                    }}
                    onClose={() => {
                        setStateData({
                            name: "",
                            desc: "",
                            isNew: false,
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                            originalName: "",
                            isDefaultRole: false
                        });
                        setEditPopup(false);
                    }}
                    footerChildren={[
                        <div style={{ display: "flex", width: "100%" }}>
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                style={{ margin: "0 8px", borderRadius: "6px", width: "100%" }}
                                label={t("CANCEL")}
                                onClick={(e) => setEditPopup(false)}
                            />
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"primary"}
                                label={t("EDIT_ROLE")}
                                style={{ margin: "0 8px", borderRadius: "6px", width: "100%" }}
                                onClick={(e) => { createRole(e) }}
                            />
                        </div>
                    ]}
                    sortFooterChildren={true}
                >
                    <FieldV1
                        label={t("ROLE_NAME")}
                        onChange={(e) => onDataChange(e)}
                        populators={{
                            name: "name",
                            alignFieldPairVerically: true,
                            fieldPairClassName: "workflow-field-pair",
                        }}
                        props={{
                            fieldStyle: { width: "100%" }
                        }}
                        required
                        infoMessage={stateData.isDefaultRole ? t("DEFAULT_ROLE_NAME_CANNOT_BE_CHANGED") : t("ROLE_NAME_ALPHANUMERIC_INFO")}
                        type="text"
                        value={stateData.name}
                        disabled={stateData.isDefaultRole}
                    />
                    <FieldV1
                        label={t("ROLE_DESC")}
                        onChange={(e) => onDataChange(e)}
                        populators={{
                            name: "desc",
                            alignFieldPairVerically: true,
                            fieldPairClassName: "workflow-field-pair",
                        }}
                        props={{
                            fieldStyle: { width: "100%" }
                        }}
                        type="text"
                        infoMessage={t("ROLE_DESC_INFO")}
                        value={stateData.desc}
                    />
                    <AccessCard isRequired={true} data={stateData} onChange={onDataChange} />
                </PopUp>
            )}

            {showToast && (
                <Toast
                    type={showToast?.type}
                    label={t(showToast?.label)}
                    onClose={() => {
                        setShowToast(null);
                    }}
                    isDleteBtn={showToast?.isDleteBtn}
                    style={{ zIndex: 99999 }}
                />
            )}
        </React.Fragment>
    );
};

export default Roles;