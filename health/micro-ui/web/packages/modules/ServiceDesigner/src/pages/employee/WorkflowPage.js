import React, { useState, useEffect, useRef } from "react";
import { SidePanel, PopUp, TextInput, Dropdown, FieldV1, TextArea, Switch, AlertCard } from "@egovernments/digit-ui-components";
import { Card } from "@egovernments/digit-ui-react-components";
import InfiniteCanvas from "../../components/Canvas";
import { useTranslation } from "react-i18next";
import WorkflowNode from "../../components/WorkflowNode";
import { Button, Footer } from "@egovernments/digit-ui-components";
import { Toast } from "@egovernments/digit-ui-components";
import StateComp from "../../components/StateComponent";
import { Loader } from "@egovernments/digit-ui-react-components";
import QuickStart from "../../components/QuickStart";
import StageActions from "../../components/StageActions";
import { useServiceConfigAPI } from "../../hooks/useServiceConfigAPI";
import { useChecklistConfigAPI } from "../../hooks/useChecklistConfigAPI";
import { useRoleConfigAPI } from "../../hooks/useRoleConfigAPI";
import generateMdmsRolePayload from "../../config/rolecreateConfig";
import AccessCard from "../../components/AccessCard";
import { useHistory } from "react-router-dom";
import { useNotificationConfigAPI } from "../../hooks/useNotificationConfigAPI";
import { useQueryClient } from "react-query";

const Workflow = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const queryClient = useQueryClient();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    // Restricted characters for state/action names (URL-unsafe characters)
    const RESTRICTED_CHARS = /[?&=\/:#+]/g;
    const sanitizeInput = (value) => value.replace(RESTRICTED_CHARS, "");
    const searchParams = new URLSearchParams(location.search);
    const roleModule = searchParams.get("module") || "Studio";
    const roleService = searchParams.get("service") || "Service";
    const servicemodule = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;
    const [selectedElement, setSelectedElement] = useState(null);
    const [canvasElements, setCanvasElements] = useState(() => {
        try {
            const stored = localStorage.getItem("canvasElements");
            return (stored && stored !== "undefined") ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load canvasElements from localStorage:', error);
            return [];
        }
    });
    const [coords, setCoords] = useState([{ x: 100, y: 300 }]);
    const [showToast, setShowToast] = useState(null);
    const [hasStart, setHasStart] = useState(false);
    const [endStateCount, setEndStateCount] = useState(0);
    const [connectionStart, setConnectionStart] = useState(null);
    const [connections, setConnections] = useState(() => {
        try {
            const stored = localStorage.getItem("connections");
            return (stored && stored !== "undefined") ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load connections from localStorage:', error);
            return [];
        }
    });
    const [connecting, setConnecting] = useState(null);
    const [labelOffsets, setLabelOffsets] = useState(() => {
        try {
            const stored = localStorage.getItem("labelOffsets");
            return (stored && stored !== "undefined") ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Failed to load labelOffsets from localStorage:', error);
            return {};
        }
    });

    // New state for service configuration popup
    const [showServiceConfigPopup, setShowServiceConfigPopup] = useState(false);
    const [serviceConfigData, setServiceConfigData] = useState(null);
    const [isGeneratingConfig, setIsGeneratingConfig] = useState(false);
    const [editableServiceConfig, setEditableServiceConfig] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [existingServiceConfigId, setExistingServiceConfigId] = useState(null);
    const [rolePopup, setRolePopup] = useState(false);
    const [loadSamplePopup, setLoadSamplePopup] = useState(false);
    const [showStateErrors, setShowStateErrors] = useState(false);
    const [showActionErrors, setShowActionErrors] = useState(false);

    // Service creation mutation hook
    //changes for publish
    const serviceCreationMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: "/public-service-init/v1/service",
        method: "POST",
        headers: {
            "X-Tenant-Id": tenantId
        },
        config: { enable: false }
    });
    const MDMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "egov-mdms-service";

    // Check if we're in edit mode
    const isEditMode = searchParams.get("edit") === "true";

    // Service configuration API hooks
    const { saveServiceConfig, updateServiceConfig, fetchServiceConfig } = useServiceConfigAPI();
    const { data: existingServiceConfig } = fetchServiceConfig(roleModule, roleService);

    // Use the new role config API hook
    const { searchRoleConfigs, saveRoleConfig } = useRoleConfigAPI();
    const { data: roleConfigs, isLoading } = searchRoleConfigs(roleModule, roleService);

    // Get all role codes that are already being used in the existing workflow
    const existingRoleCodes = new Set();
    canvasElements.forEach(element => {
        if (element.roles && Array.isArray(element.roles)) {
            element.roles.forEach(role => {
                if (role.code) {
                    existingRoleCodes.add(role.code);
                }
            });
        }
    });
    connections.forEach(connection => {
        if (connection.aroles && Array.isArray(connection.aroles)) {
            connection.aroles.forEach(role => {
                if (role.code) {
                    existingRoleCodes.add(role.code);
                }
            });
        }
    });

    // Include roles that are already being used in the workflow, even if they don't match current service module
    const allRoleConfigs = roleConfigs || [];
    const existingRoles = allRoleConfigs.filter(item =>
        existingRoleCodes.has(item.data.code)
    );

    // Combine current service roles with existing roles, removing duplicates
    const allRoles = [...allRoleConfigs];
    existingRoles.forEach(existingRole => {
        if (!allRoles.some(role => role.data.code === existingRole.data.code)) {
            allRoles.push(existingRole);
        }
    });

    const data = allRoles || [];

    // Use the new checklist config API hook
    const { searchChecklistConfigs } = useChecklistConfigAPI();
    const { data: checklistConfigs, isLoading: moduleListLoading } = searchChecklistConfigs(roleModule, roleService);

    // Get all checklist codes that are already being used in the existing workflow
    const existingChecklistCodes = new Set();
    canvasElements.forEach(element => {
        if (element.checklist && Array.isArray(element.checklist)) {
            element.checklist.forEach(checklist => {
                if (checklist.code) {
                    existingChecklistCodes.add(checklist.code);
                }
            });
        }
    });

    // Include checklists that are already being used in the workflow, even if they don't match current service module
    const allChecklistConfigs = checklistConfigs || [];
    const existingChecklists = allChecklistConfigs.filter(item =>
        existingChecklistCodes.has(item.data.name)
    );

    // Combine current service checklists with existing checklists, removing duplicates
    const allChecklists = [...allChecklistConfigs];
    existingChecklists.forEach(existingChecklist => {
        if (!allChecklists.some(checklist => checklist.data.name === existingChecklist.data.name)) {
            allChecklists.push(existingChecklist);
        }
    });

    const checklistData = allChecklists?.map((item) => ({
        code: item.data.name,
        name: item.data.name,
    })) || [];

    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const requestCriteriaForm = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
            MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: "Studio.ServiceConfigurationDrafts",
                filters: {
                    module: roleModule,
                    service: roleService,
                },
            },
        },
        config: {
            // Always fetch fresh data to ensure updated forms are used
            staleTime: 0,
            cacheTime: 0,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    };
    const { isLoading: FormsLoading, data: FormData, refetch: refetchFormData } = Digit.Hooks.useCustomAPIHook(requestCriteriaForm);
    const draft = FormData?.mdms?.[0];

    // Get all form codes that are already being used in the existing workflow
    const existingFormCodes = new Set();
    canvasElements.forEach(element => {
        if (element.form && element.form.code) {
            existingFormCodes.add(element.form.code);
        }
    });

    // Include forms that are already being used in the workflow, even if they don't match current service module
    const currentServiceForms = draft?.data?.uiforms?.map((form) => ({
        code: form.formName,
        name: form.formName,
    })) || [];

    // For forms, we need to search for forms that match the existing form codes
    // Since forms are stored in the draft data, we'll need to search for drafts that contain these forms
    const existingFormOptions = [];
    if (existingFormCodes.size > 0) {
        // This would require additional API calls to search for forms across all drafts
        // For now, we'll just use the current service forms and add a note
    }

    // Combine current service forms with existing forms, removing duplicates
    const allFormOptions = [...currentServiceForms];
    existingFormOptions.forEach(existingForm => {
        if (!allFormOptions.some(form => form.code === existingForm.code)) {
            allFormOptions.push(existingForm);
        }
    });

    const formOptions = allFormOptions;

    // Use the new notification config API hook
    const { searchNotificationConfigs } = useNotificationConfigAPI();
    const { data: notificationConfigs, isLoading: isConfigLoad } = searchNotificationConfigs(roleModule, roleService);

    const currentServiceNotifications = notificationConfigs?.filter(item => item.additionalDetails?.category?.toLowerCase() === servicemodule?.toLowerCase()) || [];
    // Get all notification codes that are already being used in the existing workflow
    const existingNotificationCodes = new Set();
    canvasElements.forEach(element => {
        if (element.sendnotif && Array.isArray(element.sendnotif)) {
            element.sendnotif.forEach(notification => {
                if (notification.code) {
                    existingNotificationCodes.add(notification.code);
                }
            });
        }
    });

    // Include notifications that are already being used in the workflow, even if they don't match current service module
    const existingNotifications = notificationConfigs?.filter(item =>
        existingNotificationCodes.has(item.title)
    ) || [];

    // Combine current service notifications with existing notifications, removing duplicates
    const allNotifications = [...currentServiceNotifications];
    existingNotifications.forEach(existingNotif => {
        if (!allNotifications.some(notif => notif.title === existingNotif.title)) {
            allNotifications.push(existingNotif);
        }
    });

    const notif = allNotifications;

    const [stateData, setStateData] = useState({
        name: "",
        desc: "",
        roles: [],
        sla: 0,
        form: [],
        checklist: [],
        sendnotif: [],
        generatedoc: [],
    });

    const [actionData, setActionData] = useState({
        label: "",
        desc: "",
        aroles: [],
        aaskfordoc: false,
        aassign: false,
        aaskfordoc: false
    });

    const [roleData, setRoleData] = useState({
        name: "",
        desc: "",
        viewer: false,
        editor: false,
        creater: false,
        selfRegistration: false,
    });

    setTimeout(() => {
        setShowToast(null);
    }, 20000);

    // Handle edit mode initialization
    useEffect(() => {
    if (isEditMode && existingServiceConfig) {
        setExistingServiceConfigId(existingServiceConfig.id);

        const localCanvasStr = localStorage.getItem("canvasElements");
        const localConnectionsStr = localStorage.getItem("connections");

        const hasLocalData = localCanvasStr && localCanvasStr !== "undefined" && localCanvasStr !== "[]" &&
                             localConnectionsStr && localConnectionsStr !== "undefined";

        if (!hasLocalData && existingServiceConfig.data) {
            const configData = existingServiceConfig.data;

            // Helper function to extract base role type
            const extractRoleType = (roleCode) => {
                if (!roleCode) return roleCode;
                
                // System roles remain unchanged
                if (roleCode === 'STUDIO_CITIZEN' || roleCode === 'STUDIO_ADMIN') {
                    return roleCode;
                }
                
                // Remove all module_service prefixes to get the core role type
                let cleanedRole = roleCode;
                while (true) {
                    const beforeCleaning = cleanedRole;
                    cleanedRole = cleanedRole.replace(/^[A-Z0-9]+_[A-Z0-9]+_/, '');
                    if (beforeCleaning === cleanedRole) break;
                }
                
                return cleanedRole;
            };

            // Clean role codes in canvas elements when loading
            if (configData.uiworkflow && configData.uiworkflow.canvasElements) {
                const cleanedElements = configData.uiworkflow.canvasElements.map(element => {
                    if (element.roles && Array.isArray(element.roles)) {
                        // Preserve ALL roles, just clean their codes
                        element.roles = element.roles.map(role => {
                            if (typeof role === 'string') {
                                // Handle legacy format where role might be just a string
                                const baseRoleType = extractRoleType(role);
                                return {
                                    code: baseRoleType,
                                    name: baseRoleType
                                };
                            } else if (role && role.code) {
                                const baseRoleType = extractRoleType(role.code);
                                return {
                                    ...role,
                                    code: baseRoleType,
                                    name: role.name || baseRoleType
                                };
                            }
                            return role;
                        }).filter(role => role); // Remove any null/undefined roles
                    }
                    return element;
                });
                
                setCanvasElements(cleanedElements);
                try {
                    localStorage.setItem("canvasElements", JSON.stringify(cleanedElements));
                } catch (error) {
                    console.warn('Failed to save canvasElements to localStorage:', error);
                }
            }

            // Clean role codes in connections when loading
            if (configData.uiworkflow && configData.uiworkflow.connections) {
                const cleanedConnections = configData.uiworkflow.connections.map(connection => {
                    if (connection.aroles && Array.isArray(connection.aroles)) {
                        // Preserve ALL roles in connections
                        connection.aroles = connection.aroles.map(role => {
                            if (typeof role === 'string') {
                                // Handle legacy format
                                const baseRoleType = extractRoleType(role);
                                return {
                                    code: baseRoleType,
                                    name: baseRoleType
                                };
                            } else if (role && role.code) {
                                const baseRoleType = extractRoleType(role.code);
                                return {
                                    ...role,
                                    code: baseRoleType,
                                    name: role.name || baseRoleType
                                };
                            }
                            return role;
                        }).filter(role => role); // Remove any null/undefined roles
                    }
                    return connection;
                });
                
                setConnections(cleanedConnections);
                try {
                    localStorage.setItem("connections", JSON.stringify(cleanedConnections));
                } catch (error) {
                    console.warn('Failed to save connections to localStorage:', error);
                }
            }

            // IMPORTANT: Also handle the fallback to old 'workflow' structure
            if (!configData.uiworkflow && configData.workflow) {
                if (configData.workflow.canvasElements) {
                    const cleanedElements = configData.workflow.canvasElements.map(element => {
                        if (element.roles && Array.isArray(element.roles)) {
                            element.roles = element.roles.map(role => {
                                if (typeof role === 'string') {
                                    const baseRoleType = extractRoleType(role);
                                    return {
                                        code: baseRoleType,
                                        name: baseRoleType
                                    };
                                } else if (role && role.code) {
                                    const baseRoleType = extractRoleType(role.code);
                                    return {
                                        ...role,
                                        code: baseRoleType,
                                        name: role.name || baseRoleType
                                    };
                                }
                                return role;
                            }).filter(role => role);
                        }
                        return element;
                    });
                    
                    setCanvasElements(cleanedElements);
                    localStorage.setItem("canvasElements", JSON.stringify(cleanedElements));
                }

                if (configData.workflow.connections) {
                    const cleanedConnections = configData.workflow.connections.map(connection => {
                        if (connection.aroles && Array.isArray(connection.aroles)) {
                            connection.aroles = connection.aroles.map(role => {
                                if (typeof role === 'string') {
                                    const baseRoleType = extractRoleType(role);
                                    return {
                                        code: baseRoleType,
                                        name: baseRoleType
                                    };
                                } else if (role && role.code) {
                                    const baseRoleType = extractRoleType(role.code);
                                    return {
                                        ...role,
                                        code: baseRoleType,
                                        name: role.name || baseRoleType
                                    };
                                }
                                return role;
                            }).filter(role => role);
                        }
                        return connection;
                    });
                    
                    setConnections(cleanedConnections);
                    localStorage.setItem("connections", JSON.stringify(cleanedConnections));
                }
            }
        }
    }
}, [isEditMode, existingServiceConfig]);

    const onLeftClick = (elementId, e) => {
        if (connectionStart) {
            setConnections((prev) => {
                const exists = prev.some(
                    (conn) => conn.from === connectionStart && conn.to === elementId
                );
                if (exists) {
                    setShowToast({ key: true, type: "error", label: t("CONNECTION_ALREADY_EXISTS") });
                    return prev;
                }
                return [
                    ...prev,
                    { id: Date.now(), from: connectionStart, to: elementId, label: "", type: "action", desc: "" }
                ];
            });
            setConnectionStart(null);
        }
        else {
            setShowToast({ key: true, type: "error", label: t("START_CONNECTION_FROM_OUTPUT_HANDLE") });
        }
        setConnecting(null);
    }

    const onRightClick = (elementId, e) => {
        e?.stopPropagation?.();

        if (connectionStart === elementId) {
            // Already drawing from this node → stop arrow mode
            setConnectionStart(null);
            setConnecting(null);
        } else {
            // Start drawing arrow from this node
            setConnectionStart(elementId);
            setConnecting(true);
        }
    };

    const DeleteClick = (elementId, e) => {
        setCanvasElements(prev => {
            return prev.filter(element => element.id !== elementId);
        });
        setConnections((prev) =>
            prev.filter((conn) => conn.to !== elementId && conn.from !== elementId)
        );
        if (selectedElement && selectedElement.id === elementId) {
            setSelectedElement(null);
            setStateData({ name: "", desc: "", roles: [], sla: 0 });
        }
    }

    const DeleteActionClick = (id, e) => {
        setConnections(prev => {
            return prev.filter(conn => conn.id !== id);
        });
        if (selectedElement && selectedElement.id === id) {
            setSelectedElement(null);
            setActionData({ label: "", desc: "", aroles: [], aaskfordoc: false, aassign: false, acomments: false });
        }
    }

    const EditClick = (id, e) => {
        const element = canvasElements.find(el => el.id === id);
        if (element) {
            handleElementClick(element);
        }
    }

    const onRoleChange = (e) => {
        if (Array.isArray(e)) {
            setRoleData(prev => ({
                ...prev,
                [e[0]]: e[1].target.checked
            }));
        }
        else if (e?.target) {
            const { name, type, value, checked } = e.target;
            setRoleData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const normalizeRoleName = (roleName) => {
        return roleName.toLowerCase().replace(/[\s_]/g, '');
    };

    const generateRolePayload = (roleName, description, access, selfRegistration = false) => {
        return {
            module: roleModule,
            service: roleService,
            roleName: roleName,
            description: description,
            access: access,
            selfRegistration: selfRegistration
        };
    };

    const createRole = async (e) => {
        if (roleData.name != "" && (roleData.creater || roleData.editor || roleData.viewer)) {
            // Validate role name - only alphanumeric, spaces, and underscores allowed
            const roleNameRegex = /^[a-zA-Z0-9_ ]+$/;
            if (!roleNameRegex.test(roleData.name)) {
                setShowToast({ key: true, type: "error", label: t("ROLE_NAME_INVALID_CHARACTERS") });
                return;
            }

            const access = {
                editor: roleData.editor,
                viewer: roleData.viewer,
                creater: roleData.creater
            };

            // Check for duplicate role names in existing roles from API
            const normalizedNewName = normalizeRoleName(roleData.name);
            const existingRoleFromAPI = data?.some(role => normalizeRoleName(role?.data?.code || '') === normalizedNewName);

            // Check for duplicate role names in current service configuration draft
            const existingRoleFromDraft = draft?.data?.uiroles?.some(role => normalizeRoleName(role?.code || '') === normalizedNewName);

            // Check if any existing role already has selfRegistration enabled
            const existingSelfRegRole = data?.find(role => role?.data?.additionalDetails?.selfRegistration === true);

            if (existingRoleFromAPI || existingRoleFromDraft) {
                setShowToast({ key: true, type: "error", label: t("ROLE_NAME_EXISTS") });
            }
            else {
                if (roleData.selfRegistration === true && existingSelfRegRole) {
                    setShowToast({ key: true, type: "error", label: t("ONLY_ONE_SELF_REGISTRATION_ROLE_ALLOWED") });
                    return;
                }
                try {
                    const rolePayload = generateRolePayload(roleData.name, roleData.desc, access, roleData.selfRegistration);
                    const response = await saveRoleConfig.mutateAsync(rolePayload);

                    if (response?.mdms) {
                        setShowToast({ key: true, type: "success", label: t("ROLE_ADDED_SUCCESSFULLY") });
                        setRoleData({
                            name: "",
                            desc: "",
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                        });
                        setRolePopup(false);
                        window.location.reload();
                    }
                    else {
                        setShowToast({ key: true, type: "error", label: t("ERROR_OCCURED_DURING_CREATION") });
                        setRoleData({
                            name: "",
                            desc: "",
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                        });
                        setRolePopup(false);
                    }
                } catch (error) {
                    setShowToast({ key: true, type: "error", label: t("ERROR_OCCURED_DURING_CREATION") });
                    setRoleData({
                        name: "",
                        desc: "",
                        viewer: false,
                        editor: false,
                        creater: false,
                        selfRegistration: false,
                    });
                    setRolePopup(false);
                }
            }
        }
        else {
            if (roleData.name == "") {
                setShowToast({ key: true, type: "error", label: t("ROLE_NAME_IS_REQUIRED") });
            }
            else {
                setShowToast({ key: true, type: "error", label: t("ATLEAST_ONE_IS_SELECTED") });
            }
        }
    }

    // Function to create WorkflowNode component
    const createWorkflowNode = (element) => {
        const displayStateName = element.name && element.name.length > 10
        ? `${element.name.substring(0, 10)}...` 
        : element.name;
        if (element.nodetype === "start") {
            return (
                <WorkflowNode
                    type={element.type}
                    elementId={element.id}
                    State={displayStateName}
                    desc={element.desc}
                    roles={element.roles}
                    sla={element.sla}
                    form={element.form}
                    checklist={element.checklist}
                    generatedoc={element.generatedoc}
                    sendnotif={element.sendnotif}
                    nodetype={element.nodetype}
                    roleModule={roleModule}
                    roleService={roleService}
                    onLeftAction={false}
                    onRightAction={onRightClick}
                    onDeleteAction={DeleteClick}
                    onEditAction={EditClick}
                />
            );
        } else {
            return (
                <WorkflowNode
                    type={element.type}
                    elementId={element.id}
                    State={displayStateName}
                    desc={element.desc}
                    roles={element.roles}
                    sla={element.sla}
                    checklist={element.checklist}
                    generatedoc={element.generatedoc}
                    sendnotif={element.sendnotif}
                    nodetype={element.nodetype}
                    roleModule={roleModule}
                    roleService={roleService}
                    onLeftAction={onLeftClick}
                    onRightAction={element.nodetype == "end" ? false : onRightClick}
                    onDeleteAction={DeleteClick}
                    onEditAction={EditClick}
                />
            );
        }
    };

    const CanvasClick = (x, y) => {
        if (connectionStart) {
            const elementId = AddState("intermediate", x, y - 90);
            if (connectionStart && connectionStart !== elementId) {
                setConnections((prev) => [
                    ...prev,
                    { id: Date.now(), from: connectionStart, to: elementId, label: "", type: "action", desc: "" }
                ]);
                setConnectionStart(null);
            }
            setConnecting(null);
        }
    }

    // Smart positioning function to avoid overlapping elements
    const findSmartPosition = (proposedX, proposedY, existingElements) => {
        const elementWidth = 250; // Approximate width of canvas elements
        const elementHeight = 120; // Approximate height of canvas elements
        const padding = 50; // Minimum distance between elements
        const viewportWidth = 1200; // Approximate viewport width
        const viewportHeight = 800; // Approximate viewport height

        // If no existing elements, use the proposed position
        if (existingElements.length === 0) {
            return { x: proposedX, y: proposedY };
        }

        // Check if proposed position overlaps with any existing element
        const isOverlapping = (x, y) => {
            return existingElements.some(element => {
                const elementX = element.position.x;
                const elementY = element.position.y;

                // Check if rectangles overlap
                return !(x + elementWidth + padding < elementX ||
                    elementX + elementWidth + padding < x ||
                    y + elementHeight + padding < elementY ||
                    elementY + elementHeight + padding < y);
            });
        };

        // If proposed position doesn't overlap, use it
        if (!isOverlapping(proposedX, proposedY)) {
            return { x: proposedX, y: proposedY };
        }

        // Try to find a position in a grid pattern around the proposed position
        const gridSpacing = elementWidth + padding;
        const maxAttempts = 20; // Limit search attempts

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            // Try positions in expanding circles around the proposed position
            const radius = attempt * gridSpacing;

            // Try 8 directions around the proposed position
            const directions = [
                { dx: 0, dy: -radius }, // North
                { dx: radius, dy: -radius }, // Northeast
                { dx: radius, dy: 0 }, // East
                { dx: radius, dy: radius }, // Southeast
                { dx: 0, dy: radius }, // South
                { dx: -radius, dy: radius }, // Southwest
                { dx: -radius, dy: 0 }, // West
                { dx: -radius, dy: -radius } // Northwest
            ];

            for (const direction of directions) {
                const testX = proposedX + direction.dx;
                const testY = proposedY + direction.dy;

                // Ensure position is within viewport bounds
                if (testX >= 0 && testX <= viewportWidth - elementWidth &&
                    testY >= 0 && testY <= viewportHeight - elementHeight) {

                    if (!isOverlapping(testX, testY)) {
                        return { x: testX, y: testY };
                    }
                }
            }
        }

        // If no position found, try to find the least crowded area
        const gridSize = 50;
        const grid = {};

        // Create a grid and count elements in each cell
        existingElements.forEach(element => {
            const gridX = Math.floor(element.position.x / gridSize);
            const gridY = Math.floor(element.position.y / gridSize);
            const key = `${gridX},${gridY}`;
            grid[key] = (grid[key] || 0) + 1;
        });

        // Find the least crowded area
        let bestX = proposedX;
        let bestY = proposedY;
        let minDensity = Infinity;

        for (let x = 0; x < viewportWidth; x += gridSize) {
            for (let y = 0; y < viewportHeight; y += gridSize) {
                const gridX = Math.floor(x / gridSize);
                const gridY = Math.floor(y / gridSize);
                const key = `${gridX},${gridY}`;
                const density = grid[key] || 0;

                if (density < minDensity && !isOverlapping(x, y)) {
                    minDensity = density;
                    bestX = x;
                    bestY = y;
                }
            }
        }

        return { x: bestX, y: bestY };
    };

    const AddState = (state, x, y) => {
        const currentX = x || coords[0].x;
        const currentY = y || coords[0].y;

        let type, nodetype, name, desc, form;

        if (state === "start") {
            type = "node";
            nodetype = "start";
            name = "";
            desc = "";
            form = "";
        } else if (state === "end") {
            type = "node";
            nodetype = "end";
            name = "";
            desc = "";
            form = null;
        } else {
            type = "node";
            nodetype = "intermediate";
            name = "";
            desc = "";
            form = null;
        }

        const elementId = Date.now();

        // Use smart positioning to find the best location
        const smartPosition = findSmartPosition(currentX, currentY, canvasElements);

        const newElement = {
            id: elementId,
            type: type,
            name: name,
            desc: desc,
            roles: [],
            sla: 24,
            form: form,
            checklist: [],
            generatedoc: [],
            sendnotif: [],
            nodetype: nodetype,
            position: smartPosition
        };

        setCanvasElements(prev => [...prev, newElement]);

        // Update coords for next element placement
        if (x === undefined) {
            setCoords([{ x: smartPosition.x + 265, y: smartPosition.y }]);
        }

        return newElement.id;
    };

    const onDataChange = (e) => {
        if (Array.isArray(e) && e.length === 0) {
            return;
        }

        // Handle array format [fieldName, selectedValue] from StageActions
        // if (Array.isArray(e) && e.length === 2 && typeof e[0] === 'string') {
        //     const [fieldName, selectedValue] = e;
        //     console.log("Setting", fieldName, "to", selectedValue);
        //     setStateData(prev => ({
        //         ...prev,
        //         [fieldName]: selectedValue
        //     }));
        //     return;
        // }

        if (Array.isArray(e) && e[0]?.code) {
            setStateData(prev => ({
                ...prev,
                roles: e
            }));
        } else if (Array.isArray(e)) {
            setStateData(prev => ({
                ...prev,
                [e[0]]: e[1]
            }));
        }
        else if (e?.target) {
            const { name, value } = e.target;
            // Sanitize state name to remove restricted characters
            const sanitizedValue = name === "name" ? sanitizeInput(value) : value;
            setStateData(prev => ({
                ...prev,
                [name]: sanitizedValue
            }));
        } else if (e?.code) {
            setStateData(prev => ({
                ...prev,
                form: e
            }));
        }
        else {
            setStateData(prev => ({
                ...prev,
                sla: e
            }));
        }
    };

    const onActionDataChange = (e) => {
        // CASE 1: multiselect dropdown cleared → e = []
        if (Array.isArray(e) && e.length === 0) {
            setActionData(prev => ({
                ...prev,
                aroles: []
            }));
            return;
        }

        // CASE 2: multiselect dropdown value
        if (Array.isArray(e) && e[0]?.code) {
            setActionData(prev => ({
                ...prev,
                aroles: e
            }));
            return;
        }

        // CASE 3: other FieldV1 formats
        if (Array.isArray(e)) {
            setActionData(prev => ({
                ...prev,
                [e[0]]: e[1]
            }));
            return;
        }

        // CASE 4: native input
        if (e?.target) {
            const { name, value } = e.target;
            // Sanitize action name (label) to remove restricted characters
            const sanitizedValue = name === "label" ? sanitizeInput(value) : value;
            setActionData(prev => ({
                ...prev,
                [name]: sanitizedValue
            }));
        }
    };


    const handleElementClick = (element) => {
        setSelectedElement(element);
        setStateData({ name: element.name, desc: element.desc, roles: element.roles, sla: element.sla, form: element.form || [], checklist: element.checklist || [], aaskfordoc: element.aaskfordoc, sendnotif: element.sendnotif });
        setShowStateErrors(false); // Reset error display when selecting a new element
    }

    const handleElementDrag = (element, newPosition) => {
        setCanvasElements(prev =>
            prev.map(el => el.id === element.id ? { ...el, position: newPosition } : el)
        );
    };

    const updateProperties = () => {
        setShowStateErrors(true); // Show errors when user attempts to save
        if (stateData.name === "" || stateData.sla < 1) {
            setShowToast({ key: true, type: "error", label: t("FILL_THE_REQUIRED_DETAILS") });
        }
        // Check for duplicate state name
        else if (canvasElements.some(el => el.id !== selectedElement.id && el.name?.toLowerCase() === stateData.name?.toLowerCase())) {
            setShowToast({ key: true, type: "error", label: t("DUPLICATE_STATE_NAME_NOT_ALLOWED") });
        }
        else {
            setCanvasElements(prev =>
                prev.map(element => {
                    if (element.id === selectedElement.id) {
                        const updatedElement = {
                            ...element,
                            name: stateData.name,
                            desc: stateData.desc,
                            roles: stateData.roles,
                            sla: stateData.sla,
                            form: stateData?.form,
                            checklist: stateData?.checklist,
                            sendnotif: stateData?.sendnotif,
                        };
                        setSelectedElement(updatedElement);
                        return updatedElement;
                    }
                    return element;
                })
            );
            setShowToast({ key: true, type: "success", label: t("STATE_DATA_UPDATED_SUCCESSFULLY") });
        }

    }

    const updateActionProperties = () => {
        setShowActionErrors(true);

        if (actionData.label === "") {
            setShowToast({
                key: true,
                type: "error",
                label: t("PLEASE_ENTER_ACTION_NAME")
            });
            return;
        }

        // 🔥 NEW VALIDATION — role must be selected
        if (!actionData.aroles || actionData.aroles.length === 0) {
            setShowToast({
                key: true,
                type: "error",
                label: t("PLEASE_SELECT_ATLEAST_ONE_ROLE")
            });
            return;
        }

        // existing code...
        setConnections(prev =>
            prev.map(element => {
                if (element.id === selectedElement.id) {
                    const updatedElement = {
                        ...element,
                        label: actionData.label,
                        desc: actionData.desc,
                        aroles: actionData.aroles,
                        aaskfordoc: actionData.aaskfordoc,
                        aassign: actionData.aassign,
                        acomments: actionData.acomments,
                    };
                    setSelectedElement(updatedElement);
                    return updatedElement;
                }
                return element;
            })
        );

        setShowToast({ key: true, type: "success", label: t("ACTION_DATA_UPDATED_SUCCESSFULLY") });
    };

    // Format role name for display: remove module_service prefix
    const formatRoleNameForDisplay = (roleName) => {
        if (!roleName) return "";

        // Display STUDIO_CITIZEN as "Citizen"
        if (roleName === "STUDIO_CITIZEN") {
            return "Citizen";
        }

        // Don't format STUDIO_ADMIN
        if (roleName === "STUDIO_ADMIN") {
            return roleName;
        }

        // Remove module_service prefix if present
        const prefix = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}_`;
        let formattedRole = roleName;

        if (formattedRole.startsWith(prefix)) {
            formattedRole = formattedRole.substring(prefix.length);
        }

        // Convert underscores to spaces and capitalize each word
        return formattedRole
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const elementsWithComponents = canvasElements.map(element => ({
        ...element,
        component: createWorkflowNode(element)
    }));

    // Helper function to get filtered roles based on action's source state

    const getAllAvailableRoles = () => {
        // Get roles from API
        const apiRoles = data?.map((role) => ({
            code: role?.data?.code,
            name: formatRoleNameForDisplay(role?.data?.code)
        })) || [];

        // Also include any roles currently in use in the workflow
        const usedRoles = new Set();

        // Collect from canvas elements
        canvasElements.forEach(element => {
            if (element.roles && Array.isArray(element.roles)) {
                element.roles.forEach(role => {
                    if (role.code) {
                        usedRoles.add(JSON.stringify({ code: role.code, name: role.name }));
                    }
                });
            }
        });

        // Collect from connections
        connections.forEach(connection => {
            if (connection.aroles && Array.isArray(connection.aroles)) {
                connection.aroles.forEach(role => {
                    if (role.code) {
                        usedRoles.add(JSON.stringify({ code: role.code, name: role.name }));
                    }
                });
            }
        });

        // Add used roles that aren't in API roles
        const apiRoleCodes = new Set(apiRoles.map(r => r.code));
        const usedRoleCodes = new Set();

        usedRoles.forEach(roleStr => {
            const role = JSON.parse(roleStr);
            usedRoleCodes.add(role.code);
            if (!apiRoleCodes.has(role.code)) {
                apiRoles.push({
                    code: role.code,
                    name: role.name || formatRoleNameForDisplay(role.code)
                });
            }
        });

        // Deduplicate roles based on display name
        // Priority: 1) Roles currently in use, 2) Shorter codes (simpler)
        const uniqueRoles = {};
        apiRoles.forEach(role => {
            const displayName = role.name;
            const isInUse = usedRoleCodes.has(role.code);
            const existingIsInUse = uniqueRoles[displayName] ? usedRoleCodes.has(uniqueRoles[displayName].code) : false;

            if (!uniqueRoles[displayName] ||
                (isInUse && !existingIsInUse) ||
                (isInUse === existingIsInUse && role.code.length < uniqueRoles[displayName].code.length)) {
                // Keep this role if:
                // 1. It's the first with this display name, OR
                // 2. It's in use and existing one isn't, OR
                // 3. Both have same usage status but this has shorter code
                uniqueRoles[displayName] = role;
            }
        });

        return Object.values(uniqueRoles);
    };

    const getFilteredRolesForAction = () => {
        if (!selectedElement || selectedElement.type !== "action") {
            return getAllAvailableRoles();
        }

        // Find the source state of the action
        const sourceStateId = selectedElement.from;
        const sourceState = canvasElements.find(element => element.id === sourceStateId);

        if (!sourceState) {
            return getAllAvailableRoles();
        }

        // Check if source is a start state
        const isFromStartState = sourceState.nodetype === "start";

        // Get roles from API
        const apiRoles = data?.filter((role) => {
            const access = role?.data?.additionalDetails?.access || {};
            if (isFromStartState) {
                return access.creater === true;
            } else {
                return access.editor === true;
            }
        }).map((role) => ({
            code: role?.data?.code,
            name: formatRoleNameForDisplay(role?.data?.code)
        })) || [];

        // IMPORTANT: Also include any roles that are already selected in this action
        // This ensures imported roles are preserved even if they don't exist in the new service
        const existingSelectedRoles = selectedElement.aroles || actionData.aroles || [];
        const existingRoleCodes = new Set(apiRoles.map(r => r.code));

        existingSelectedRoles.forEach(role => {
            if (role.code && !existingRoleCodes.has(role.code)) {
                // Add the imported role to the list if it's not already there
                apiRoles.push({
                    code: role.code,
                    name: role.name || formatRoleNameForDisplay(role.code)
                });
            }
        });

        return apiRoles;
    };

    const Workflow_Sections = [
        [
            <div>
                <div className="typography heading-m" style={{ color: "#0B4B66" }}>
                    <div >{t("WORKFLOW_STATES")}</div>
                </div>
                <div className="typography heading-sl" style={{ color: "#0B4B66", marginLeft: "16px" }}>
                    <div >{t("WORKFLOW_STATES_DESC")}</div>
                </div>
            </div>,
            <StateComp
                onStateClick={() => AddState("start")}
                type={"start"}
                State={t("START_STATE")}
                desc={t("START_STATE_DESC")}
                disabled={hasStart}
            />,
            <StateComp
                onStateClick={() => AddState("intermediate")}
                type={"intermediate"}
                State={t("INTER_STATE")}
                desc={t("INTER_STATE_DESC")}
            />,
            <StateComp
                onStateClick={() => AddState("end")}
                type={"end"}
                State={t("END_STATE")}
                desc={t("END_STATE_DESC")}
                disabled={false}
            />
        ],
        [
            <div className="typography heading-m" style={{ color: "#0B4B66", textAlign: "center" }}>
                <div>{t("HOW_TO_CONNECT")}</div>
            </div>,
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <QuickStart />
            </div>
        ],
    ];

    const Properties_Section = [
        [
            <div className="typography heading-m" style={{ color: "#0B4B66" }}>
                <div>{t("PROPERTIES")}</div>
            </div>,
        ],
        []
    ]

    const Node_Properties_Section = [
        [
            <FieldV1
                error={showStateErrors && stateData.name == "" ? t("PLEASE_ENTER_STATE_NAME") : ""}
                label={t("STATE_NAME")}
                onChange={(e) => onDataChange(e)}
                placeholder={t("ENTER_STATE_NAME")}
                populators={{
                    name: "name",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                required
                infoMessage={t("STATE_INFO")}
                type="text"
                value={stateData.name}
            />,
            <FieldV1
                label={t("DESCRIPTION")}
                onChange={onDataChange}
                placeholder={t("DESCRIPTION")}
                populators={{
                    name: "desc",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="textarea"
                infoMessage={t("DESC_INFO")}
                value={stateData.desc}
            />,
            // <FieldV1
            //     label={t("ROLES")}
            //     onChange={(e) => onDataChange(e)}
            //     populators={{
            //         name: "roles",
            //         isSearchable: true,
            //         alignFieldPairVerically: true,
            //         fieldPairClassName: "workflow-field-pair",
            //         optionsKey: "code",
            //         isSearchable: true,
            //         options: isLoading ? [] : data?.map((role) => ({ code: role?.data?.code, name: role?.data?.description || role?.data?.code })),
            //     }}
            //     props={{
            //         fieldStyle: { width: "100%" }
            //     }}
            //     type="multiselectdropdown"
            //     infoMessage={t("ROLES_INFO")}
            //     value={stateData.roles}
            // />,
            // Only show SLA for intermediate states (not start or end)
            selectedElement?.nodetype === "intermediate" ? (<FieldV1
                error={showStateErrors && stateData.sla < 1 ? t("PLEASE_ENTER_VALID_SLA_IN_HOURS(MIN 1)") : ""}
                label="SLA_TIMER(HOURS)"
                onChange={(e) => onDataChange(e)}
                populators={{
                    name: "sla",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                required
                type="numeric"
                infoMessage={t("SLA_INFO")}
                value={stateData.sla}
            />) : null,
            selectedElement?.nodetype == "start" ? (<FieldV1
                label={t("SERVICE_REQUEST_FORM")}
                onChange={(e) => onDataChange(e)}
                populators={{
                    name: "form",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                    optionsKey: "code",
                    options: FormsLoading ? [] : [...formOptions],
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="dropdown"
                required
                infoMessage={t("FORM_INFO")}
                required
                value={stateData.form}
            />) : null,
            // Update the checklist field in Node_Properties_Section (around line 1289-1306)
            selectedElement?.nodetype !== "start" ? (<FieldV1
                label={t("ASK_FOR_CHECKLIST")}
                onChange={(e) => {
                    // Handle single dropdown selection directly
                    setStateData(prev => ({
                        ...prev,
                        checklist: e ? [e] : []  // Wrap single value in array
                    }));
                }}
                populators={{
                    name: "dropdownField",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                    optionsKey: "code",
                    options: moduleListLoading ? [] : [...checklistData],
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="dropdown"  // Changed from "multiselectdropdown" to "dropdown"
                infoMessage={t("CHECKLIST_INFO")}
                value={stateData.checklist?.[0] || ""}  // Get first item from array or empty string
            />) : null,
            selectedElement?.nodetype !== "start" ? (<FieldV1
                label={t("SEND_NOTIFICATION")}
                onChange={(e) => onDataChange(["sendnotif", e])}
                populators={{
                    name: "dropdownField",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                    optionsKey: "code",
                    options: notif?.map((notification) => ({ code: notification?.title, name: notification?.title })) || [],
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="multiselectdropdown"
                infoMessage={t("NOTIF_INFO")}
                value={stateData.sendnotif}
            />) : null,
            //<StageActions label={t("ASK_FOR_CHECKLIST")} type="dropdown" name="checklist" options={checklistData} desc={t("CHECLIST_DESC")} onClick={(e) => onDataChange(e)} value={stateData.checklist}/>,
            //<StageActions label={t("SEND_NOTIFICATION")} type="dropdown" name="sendnotif" options={notif?.map(({ data }) => ({code: data?.title, name: data?.title}))} desc={t("NOFITICATION_DESC")} onClick={(e) => onDataChange(e)} value={stateData.sendnotif}/>,
            //<StageActions label={t("GENERATE_DOCUMENTS")} type="button" name="generatedoc" desc={t("GEN_DOC_DESC")}/>,
        ]
    ]

    // Check if the selected action leads to an end state
    const isActionToEndState = () => {
        if (!selectedElement || selectedElement.type !== "action") {
            return false;
        }
        const targetStateId = selectedElement.to;
        const targetState = canvasElements.find(element => element.id === targetStateId);
        return targetState?.nodetype === "end";
    };

    // Check if the selected action is coming from a start state
    const isActionFromStartState = () => {
        if (!selectedElement || selectedElement.type !== "action") {
            return false;
        }
        const sourceStateId = selectedElement.from;
        const sourceState = canvasElements.find(element => element.id === sourceStateId);
        return sourceState?.nodetype === "start";
    };

    const Action_Properties_Section = [
        [
            <FieldV1
                error={showActionErrors && actionData.label == "" ? t("PLEASE_ENTER_ACTION_NAME") : ""}
                label={t("ACTION_NAME")}
                onChange={onActionDataChange}
                placeholder={t("ENTER_ACTION_NAME")}
                populators={{
                    name: "label",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                required
                type="text"
                infoMessage={t("ACTION_STATE_INFO")}
                value={actionData.label}
            />,
            <FieldV1
                label={t("DESCRIPTION")}
                onChange={onActionDataChange}
                placeholder={t("DESCRIPTION")}
                populators={{
                    name: "desc",
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="textarea"
                value={actionData.desc}
                infoMessage={t("ACTION_DESC_INFO")}
            />,
            <FieldV1
                key={selectedElement?.id}
                label={t("ROLES")}
                onChange={(e) => onActionDataChange(e)}
                populators={{
                    name: "aroles",
                    isSearchable: true,
                    alignFieldPairVerically: true,
                    fieldPairClassName: "workflow-field-pair",
                    optionsKey: "name",
                    isSearchable: true,
                    options: isLoading ? [] : getFilteredRolesForAction(),
                }}
                props={{
                    fieldStyle: { width: "100%" }
                }}
                type="multiselectdropdown"
                required
                infoMessage={t("ACTION_ROLES_INFO")}
                required
                value={actionData.aroles || []}
            />,
            <span
                onClick={(e) => setRolePopup(true)}
                style={{
                    color: "#C84C0E",
                    cursor: "pointer",
                    fontWeight: "500",
                    textAlign: "right",
                    marginBottom: "1rem"
                }}
            >
                {t("ADD_NEW_ROLE")}
            </span>,
            // Only show "Add Comments" if the action is NOT from a start state
            !isActionFromStartState() && <StageActions label={t("ADD_COMMENTS")} type="switch" name="acomments" desc={t("COMMENTS_DESC")} onClick={(data) => onActionDataChange(data)} value={actionData.acomments} />,
            // Only show "Assign to User" if the action is NOT from a start state AND NOT leading to an end state
            !isActionFromStartState() && !isActionToEndState() && <StageActions label={t("ASSIGN_TO_USER")} type="switch" name="aassign" desc={t("ASSIGN_DESC")} onClick={(e) => onActionDataChange(e)} value={actionData.aassign} />
            // <StageActions label={t("ASK_FOR_DOCUMENTS")} type="switch" name="aaskfordoc" desc={t("DOC_DESC")} onClick={(e) => onActionDataChange(e)} value={actionData.aaskfordoc} />,
        ].filter(Boolean) // Filter out false/null values from the array
    ]

    const onconnectionClick = (conn, e) => {
        setSelectedElement(conn);

        // Don't filter - keep ALL roles that were saved
        setActionData({
            label: conn.label,
            desc: conn.desc,
            aroles: conn.aroles || [], // Keep ALL aroles without filtering
            aaskfordoc: conn.aaskfordoc,
            aassign: conn.aassign,
            acomments: conn.acomments
        });
        setShowActionErrors(false);
    };

    function documentConfig(connections, module) {
        // Get form data from start state to extract document configurations
        const formDataFromStartState = getFormDataFromStartState();
        const documentConfigs = [];

        // Process document configurations from form data
        if (formDataFromStartState) {
            formDataFromStartState.forEach(screen => {
                screen.cards?.forEach(card => {
                    card.fields?.forEach(field => {
                        if (field.type === 'documentUpload' || field.type === 'documentUploadAndDownload') {
                            // Create document config using the same logic as AppPreview
                            const action = field?.metaData?.action || "APPLY";
                            const moduleName = field?.metaData?.module || "DigitStudio";

                            // Ensure allowedFileTypes is an array
                            let allowedFileTypes = field?.allowedFileTypes || ["pdf", "doc", "docx", "jpeg", "jpg", "png"];

                            if (typeof allowedFileTypes === 'string') {
                                allowedFileTypes = allowedFileTypes
                                    .split(',')
                                    .map(type => type.trim().toLowerCase())
                                    .filter(type => type.length > 0);
                            } else if (!Array.isArray(allowedFileTypes)) {
                                allowedFileTypes = ["pdf", "doc", "docx", "jpeg", "jpg", "png"];
                            } else {
                                // Convert array elements to lowercase
                                allowedFileTypes = allowedFileTypes.map(type => type.toLowerCase());
                            }

                            const isDownloadEnabled = field?.type === "documentUploadAndDownload";

                            const documentConfig = {
                                code: field?.label.replaceAll(/\s+/g, '') || "DOCUMENT",
                                name: field?.label || "document",
                                active: true,
                                hintText: field?.metaData?.hintText || "",
                                isMandatory: field?.required || false,
                                maxSizeInMB: field?.maxFileSize || 5,
                                showHintBelow: field?.showHintBelow || false,
                                showTextInput: field?.showTextInput || false,
                                templatePDFKey: isDownloadEnabled
                                    ? (field?.templatePDFKey || null)
                                    : null,
                                maxFilesAllowed: field?.maxFiles || 1,
                                allowedFileTypes: allowedFileTypes,
                                templateDownloadURL: field?.templateDownloadURL || null,
                                documentType: field?.documentType || "Document"
                            };

                            documentConfigs.push(documentConfig);
                        }
                    });
                });
            });
        }

        const actions = connections.map(connection => {
            const actionName = connection.label;
            const showAssignee = connection.aassign || false;
            const showComments = connection.acomments || false;

            // For the first action, include document configurations from forms
            // For other actions, use empty documents array
            const documents = connection === connections[0] ? documentConfigs : [];

            return {
                "action": actionName.toUpperCase().replace(/\s+/g, '_'),
                "assignee": {
                    "show": showAssignee,
                    "isMandatory": false
                },
                "comments": {
                    "show": showComments,
                    "isMandatory": false
                },
                "documents": documents
            };
        });

        return [{
            "module": module,
            "actions": actions,
            "bannerLabel": "OBPS_BANNER",
            "maxSizeInMB": 5,
            "allowedFileTypes": [
                "pdf",
                "doc",
                "docx",
                "xlsx",
                "xls",
                "jpeg",
                "jpg",
                "png"
            ]
        }]
    }

    const extractRoleType = (roleCode) => {
        // System roles remain unchanged
        if (roleCode === 'STUDIO_CITIZEN' || roleCode === 'STUDIO_ADMIN') {
            return roleCode;
        }

        // Remove ALL module_service prefixes to get the core role type
        let cleanedRole = roleCode;

        // Keep removing prefixes until we get to the base role
        while (true) {
            const beforeCleaning = cleanedRole;
            // Remove one layer of MODULE_SERVICE_ prefix
            cleanedRole = cleanedRole.replace(/^[A-Z0-9]+_[A-Z0-9]+_/, '');

            // If nothing changed, we've removed all prefixes
            if (beforeCleaning === cleanedRole) {
                break;
            }
        }

        return cleanedRole;
    };

    // Fixed transformWorkflowData function - Replace the existing function (around line 1430) with this:

const transformWorkflowData = (statesData, connectionsData) => {
    const convertSlaToMs = (slaHours) => {
        return slaHours ? slaHours * 60 * 60 * 1000 : null;
    };

    const isStartState = (stateId, connections) => {
        const hasIncomingConnections = connections.some(conn => conn.to === stateId);
        const stateData = statesData.find(s => s.id === stateId);
        return !hasIncomingConnections || stateData?.nodetype === 'start';
    };

    const isTerminateState = (stateId, connections) => {
        const hasOutgoingConnections = connections.some(conn => conn.from === stateId);
        const stateData = statesData.find(s => s.id === stateId);
        return !hasOutgoingConnections || stateData?.nodetype === 'end';
    };

    // Calculate total SLA for businessServiceSla (sum of all intermediate states)
    let totalSlaInMs = 0;
    
    const states = statesData.map(state => {
        const outgoingConnections = connectionsData.filter(conn => conn.from === state.id);
        const isStart = isStartState(state.id, connectionsData);
        const isTerminate = isTerminateState(state.id, connectionsData);
        const moduleServicePrefix = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;
        
        // Determine SLA based on node type
        let stateSla = null;
        if (state.nodetype === 'start' || state.nodetype === 'end') {
            // Start and end states should have null SLA
            stateSla = null;
        } else {
            // Only intermediate states have SLA
            stateSla = convertSlaToMs(state.sla);
            // Add to total SLA only for intermediate states
            if (stateSla) {
                totalSlaInMs += stateSla;
            }
        }
        
        const actions = outgoingConnections.map(conn => {
            const targetState = statesData.find(s => s.id === conn.to);

            // Map roles - STUDIO_CITIZEN should be sent without prefix
            let roles = conn.aroles ? [
                ...conn.aroles?.map(role => {
                    const roleCode = role.code.toUpperCase().replace(/\s+/g, '_');

                    // Extract the base role type (removes ALL existing prefixes)
                    const baseRoleType = extractRoleType(roleCode);

                    // System roles don't get prefixes
                    if (baseRoleType === 'STUDIO_CITIZEN' || baseRoleType === 'STUDIO_ADMIN') {
                        return baseRoleType;
                    }

                    // Add current module_service prefix to the clean base role
                    return `${moduleServicePrefix}_${baseRoleType}`;
                }),
                "STUDIO_ADMIN"
            ] : ["STUDIO_ADMIN"];

            if (isStart) roles = [...roles];
            return {
                roles: roles,
                action: conn.label.toUpperCase().replace(/\s+/g, '_'),
                nextState: targetState ? targetState.name.toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN'
            };
        });

        // Prepare additional details for forms and checklists
        const additionalDetails = {};
        if (state.form && state.form.length > 0) {
            additionalDetails.form = {
                name: state.form.name,
                code: state.form.code
            };
        }
        if (state.checklist && state.checklist.length > 0) {
            additionalDetails.checklist = {
                name: state.checklist.name,
                code: state.checklist.code
            };
        }

        return {
            sla: stateSla,  // Will be null for start/end states, calculated value for intermediate states
            state: isStart ? null : state.name.toUpperCase().replace(/\s+/g, '_'),
            actions: actions,
            isStartState: isStart,
            isStateUpdatable: true,
            isTerminateState: isTerminate,
            applicationStatus: null,
            docUploadRequired: false,
            //additionalDetails: stateData
        };
    });

    // If no intermediate states have SLA, use a default value
    if (totalSlaInMs === 0) {
        totalSlaInMs = 5184000000; // Default: 60 days in milliseconds
    }

    const workflow = {
        ACTIVE: [],
        states: states,
        INACTIVE: [],
        business: 'public-services',
        businessService: `${roleModule}.${roleService}`,
        generateDemandAt: [],
        businessServiceSla: totalSlaInMs,  // Sum of all intermediate state SLAs
        nextActionAfterPayment: "",
        autoTransitionEnabledStates: []
    };

    return { workflow };
}

    // Function to get form data from start state
    const getFormDataFromStartState = () => {

        const startState = canvasElements.find(state => state.nodetype === "start");

        if (!startState || !startState.form) {
            return null;
        }

        // Get the selected form name from start state
        const selectedFormName = startState.form?.name;

        if (!selectedFormName) {
            return null;
        }

        // Find the form data from FormData
        const selectedForm = FormData?.mdms?.[0]?.data?.uiforms?.find(form => form.formName === selectedFormName);
        return selectedForm?.formConfig?.screens || null;
    };

    // Function to get role access mapping from existing role data
    const getRoleAccessMapping = () => {
        const accessMapping = {
            editor: [],
            viewer: [],
            creator: []
        };

        // Use the existing role data from searchRoleConfigs
        if (data && Array.isArray(data)) {
            data.forEach(role => {
                const roleCode = role?.data?.code;
                const access = role?.data?.additionalDetails?.access || {};

                if (roleCode) {
                    // STUDIO_CITIZEN should be sent without module_service prefix
                    const finalRoleCode = roleCode === 'STUDIO_CITIZEN'
                        ? 'STUDIO_CITIZEN'
                        : `${roleModule.toUpperCase()}_${roleService.toUpperCase()}_${roleCode.toUpperCase().replace(/\s+/g, '_')}`;

                    if (access.editor) {
                        accessMapping.editor.push(finalRoleCode);
                    }
                    if (access.viewer) {
                        accessMapping.viewer.push(finalRoleCode);
                    }
                    if (access.creater) { // Note: API has "creater" not "creator"
                        accessMapping.creator.push(finalRoleCode);
                    }
                }
            });
        }

        // Note: STUDIO_CITIZEN are hardcoded backend roles
        // STUDIO_CITIZEN is sent directly without prefix in access mapping

        return accessMapping;
    };

    // Function to transform form configuration to fields format
    const transformFormToFields = (formConfig) => {

        if (!formConfig) {
            return [];
        }

        const fields = [];

        formConfig.forEach((screen, screenIndex) => {
            screen.cards?.forEach((card, cardIndex) => {

                // Get section heading from headerFields
                const headerField = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING");
                const sectionName = headerField?.value || card.header || `Section ${cardIndex + 1}`;

                // Skip pre-defined sections using sectionType instead of sectionName
                if (sectionName.toUpperCase().includes("ADDRESS DETAILS") ||
                    sectionName.toUpperCase().includes("APPLICANT DETAILS") ||
                    card?.sectionType?.includes("document") || card.sectionType === "address" ||
                    card.sectionType === "applicant" ||
                    card.sectionType === "document") {
                    return;
                }

                // Create properties array for this card
                const properties = [];

                card.fields?.forEach((field, fieldIndex) => {

                    // Skip fields without proper configuration
                    if (!field || !field.type) {
                        return;
                    }

                    const fieldConfig = {
                        name: field.label?.replace(/\s+/g, '') || field.jsonPath || `field_${screenIndex}_${cardIndex}_${fieldIndex}`,
                        label: field.label || `Field ${fieldIndex + 1}`,
                        required: field.required || false,
                        orderNumber: fieldIndex + 1,
                        disable: field.readOnly || false,
                        defaultValue: field.defaultValue || field.value || "",
                        helpText: field.helpText || "",
                        tooltip: field.tooltip || "",
                        errorMessage: field.errorMessage || ""
                    };
                    // Handle different field types with enhanced mapping
                    switch (field.type) {
                        case "textInput":
                        case "text":
                            fieldConfig.type = "string";
                            fieldConfig.format = "text";
                            if (field?.charCount && field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field?.charCount && field.minLength) fieldConfig.minLength = Number(field.minLength);
                            if (field.regex && field.errorMessage) {
                                fieldConfig.validation = {
                                    regex: field.regex,
                                    message: field.errorMessage
                                }
                            } else {
                                // Default regex to allow only: A-Z, a-z, 0-9, space, underscore, period, apostrophe, comma
                                const defaultErrorMessage = "Only default characters allowed";
                                fieldConfig.validation = {
                                    regex: "^[A-Za-z0-9 _.',]*$",
                                    message: defaultErrorMessage
                                }
                                fieldConfig.errorMessage = defaultErrorMessage;
                            }
                            break;

                        case "number":
                            fieldConfig.type = "integer";
                            fieldConfig.format = "number";
                            if (field.regex && field.errorMessage) {
                                fieldConfig.validation = {
                                    regex: field.regex,
                                    message: field.errorMessage
                                }
                            }
                            break;

                        case "datePicker":
                        case "date":
                            fieldConfig.type = "date";
                            fieldConfig.format = "date";
                            break;

                        case "mobileNumber":
                            fieldConfig.type = "mobileNumber";
                            fieldConfig.format = "mobileNumber";
                            if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                            fieldConfig.prefix = field.isdCodePrefix || "91";
                            if (field.regex && field.errorMessage) {
                                fieldConfig.validation = {
                                    regex: field.regex,
                                    message: field.errorMessage
                                }
                            }
                            break;

                        case "dropdown":
                            // Check isMdms flag first - if false and has dropDownOptions, use enum options
                            if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum dropdown (custom options, not from MDMS)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else if (field.isMdms === true && field.schemaCode) {
                                // MDMS dropdown (explicitly marked as MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.schemaCode && field.isMdms !== false) {
                                // MDMS dropdown (has schemaCode and not explicitly non-MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.isBoundaryData) {
                                // Boundary data dropdown
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = "common-masters.BoundaryType";
                                fieldConfig.reference = "mdms";
                            } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum dropdown (fallback)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else {
                                // Default dropdown
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                            }
                            break;

                        case "radio":
                            // Check isMdms flag first - if false and has dropDownOptions, use enum options
                            if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum radio (custom options, not from MDMS)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radio";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else if (field.isMdms === true && field.schemaCode) {
                                // MDMS radio (explicitly marked as MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.schemaCode && field.isMdms !== false) {
                                // MDMS radio (has schemaCode and not explicitly non-MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum radio (fallback)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radio";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else {
                                // Default radio
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                            }
                            break;

                        case "textarea":
                            fieldConfig.type = "string";
                            fieldConfig.format = "textarea";
                            if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                            break;

                        case "checkbox":
                            fieldConfig.type = "boolean";
                            fieldConfig.format = "checkbox";
                            break;

                        case "fileUpload":
                            fieldConfig.type = "string";
                            fieldConfig.format = "file";
                            fieldConfig.maxSizeInMB = field.maxSizeInMB || 5;
                            fieldConfig.allowedFileTypes = field.allowedFileTypes || ["pdf", "doc", "docx", "jpg", "png"];
                            break;

                        case "amount":
                            fieldConfig.type = "number";
                            fieldConfig.format = "amount";
                            if (field.validation && Object.keys(field.validation).length > 0) {
                                fieldConfig.validation = field.validation;
                            }
                            break;

                        case "email":
                            fieldConfig.type = "string";
                            fieldConfig.format = "email";
                            if (field.validation && Object.keys(field.validation).length > 0) {
                                fieldConfig.validation = field.validation;
                            }
                            break;

                        case "password":
                            fieldConfig.type = "string";
                            fieldConfig.format = "password";
                            if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                            break;

                        case "time":
                            fieldConfig.type = "string";
                            fieldConfig.format = "time";
                            break;

                        case "geolocation":
                            fieldConfig.type = "string";
                            fieldConfig.format = "geolocation";
                            break;

                        case "search":
                            fieldConfig.type = "string";
                            fieldConfig.format = "search";
                            break;

                        case "numeric":
                            fieldConfig.type = "integer";
                            fieldConfig.format = "numeric";
                            if (field.validation && Object.keys(field.validation).length > 0) {
                                fieldConfig.validation = field.validation;
                            }
                            break;

                        default:
                            // Default fallback for unknown field types
                            fieldConfig.type = "string";
                            fieldConfig.format = "text";
                            break;
                    }
                    properties.push(fieldConfig);
                });

                // Create card object with properties
                if (properties.length > 0) {
                    const cardObject = {
                        name: sectionName.replace(/\s+/g, ''),
                        type: "object",
                        label: sectionName,
                        properties: properties
                    };

                    fields.push(cardObject);
                }
            });
        });

        return fields;
    };

    // Function to transform address section fields from form configuration
    const transformAddressFieldsFromForm = (formConfig) => {
        if (!formConfig) {
            return [];
        }

        const addressFields = [];

        formConfig.forEach((screen, screenIndex) => {
            screen.cards?.forEach((card, cardIndex) => {
                // Only process address sections
                const headerField = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING");
                const sectionName = headerField?.value || card.header || `Address Section ${cardIndex + 1}`;

                const isAddressSection = card.sectionType === "address" ||
                    sectionName.toUpperCase().includes("ADDRESS DETAILS") ||
                    card.fields?.some(field => field.jsonPath === "AddressPincode");

                if (!isAddressSection) {
                    return;
                }

                // Create properties array for address card
                const properties = [];

                card.fields?.filter(ob => ob?.hidden !== true)?.forEach((field, fieldIndex) => {
                    // Skip fields without proper configuration
                    if (!field || (!field.type && !field.appType)) {
                        return;
                    }

                    // Check if this is a default address field by jsonPath
                    const isDefaultAddressField = field.jsonPath === "AddressPincode" ||
                        field.jsonPath === "AddressStreet" ||
                        field.jsonPath === "AddressLocation" ||
                        field.jsonPath === "AddressMapCoord";

                    // For default address fields (hierarchyDropdown and mapcoord), use fixed names
                    // so that the backend schema remains consistent regardless of label changes
                    let fieldNameForConfig;
                    if (field.jsonPath === "AddressLocation" || field.appType === "hierarchyDropdown" || field.type === "hierarchyDropdown") {
                        fieldNameForConfig = "boundaryHierarchy";
                    } else if (field.jsonPath === "AddressMapCoord" || field.appType === "mapcoord" || field.type === "mapcoord") {
                        fieldNameForConfig = "mapCoordinates";
                    } else if (field.jsonPath === "AddressPincode") {
                        fieldNameForConfig = "pincode";
                    } else if (field.jsonPath === "AddressStreet") {
                        fieldNameForConfig = "streetName";
                    } else {
                        fieldNameForConfig = field.label?.replace(/\s+/g, '') || field.jsonPath || `address_field_${fieldIndex}`;
                    }

                    // Use address.{fieldNameForConfig} for default address fields, additionalFields.{fieldName} for others
                    // This ensures path uses the fixed name (e.g., address.boundaryHierarchy) instead of label-derived name
                    const path = isDefaultAddressField
                        ? `address.${fieldNameForConfig}`
                        : `additionalFields.${fieldNameForConfig}`;

                    const fieldConfig = {
                        name: fieldNameForConfig,
                        label: field.label || `Field ${fieldIndex + 1}`,
                        required: field.required || false,
                        orderNumber: fieldIndex + 1,
                        disable: field.readOnly || false,
                        defaultValue: field.defaultValue || field.value || "",
                        helpText: field.helpText || "",
                        tooltip: field.tooltip || "",
                        errorMessage: field.errorMessage || "",
                        path: path
                    };

                    // Use appType if available, otherwise fall back to type
                    const fieldType = field.appType || field.type;

                    // Handle different field types
                    switch (fieldType) {
                        case "textInput":
                        case "text":
                            fieldConfig.type = "string";
                            fieldConfig.format = "text";
                            if (field?.charCount) fieldConfig.maxLength = field.maxLength ? Number(field.maxLength) : 128;
                            if (field?.charCount) fieldConfig.minLength = field.minLength ? Number(field.minLength) : 2;
                            if (field.regex && field.errorMessage) {
                                fieldConfig.validation = {
                                    regex: field.regex,
                                    message: field.errorMessage
                                };
                            }
                            break;

                        case "number":
                        case "numeric":
                            fieldConfig.type = "integer";
                            fieldConfig.format = "number";
                            break;

                        case "dropdown":
                            // Check isMdms flag first - if false and has dropDownOptions, use enum options
                            if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum dropdown (custom options, not from MDMS)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else if (field.isMdms === true && field.schemaCode) {
                                // MDMS dropdown (explicitly marked as MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.schemaCode && field.isMdms !== false) {
                                // MDMS dropdown (has schemaCode and not explicitly non-MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.isBoundaryData) {
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.schema = "common-masters.BoundaryType";
                                fieldConfig.reference = "mdms";
                            } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum dropdown (fallback)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radioordropdown";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else {
                                fieldConfig.type = "string";
                                fieldConfig.format = "radioordropdown";
                            }
                            break;

                        case "hierarchyDropdown":
                            fieldConfig.type = "string";
                            fieldConfig.format = "hierarchyDropdown";
                            fieldConfig.hierarchyType = field.populators?.hierarchyType || "ADMIN";
                            fieldConfig.highestHierarchy = field.populators?.highestHierarchy || "";
                            fieldConfig.lowestHierarchy = field.populators?.lowestHierarchy || "";
                            break;

                        case "locationPicker":
                        case "geolocation":
                        case "mapCoord":
                        case "mapcoord":
                        case "MapWithInput":
                        case "map":
                            fieldConfig.type = "string";
                            fieldConfig.format = "geolocation";
                            break;

                        case "datePicker":
                        case "date":
                            fieldConfig.type = "date";
                            fieldConfig.format = "date";
                            break;

                        case "mobileNumber":
                            fieldConfig.type = "mobileNumber";
                            fieldConfig.format = "mobileNumber";
                            fieldConfig.minLength = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10;
                            fieldConfig.maxLength = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10;
                            fieldConfig.prefix = field.isdCodePrefix || window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobilePrefix || "91";
                            if (field.regex && field.errorMessage) {
                                fieldConfig.validation = {
                                    regex: field.regex,
                                    message: field.errorMessage
                                };
                            }
                            break;

                        case "radio":
                            // Check isMdms flag first - if false and has dropDownOptions, use enum options
                            if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum radio (custom options, not from MDMS)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radio";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else if (field.isMdms === true && field.schemaCode) {
                                // MDMS radio (explicitly marked as MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.schemaCode && field.isMdms !== false) {
                                // MDMS radio (has schemaCode and not explicitly non-MDMS)
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                                fieldConfig.schema = field.schemaCode;
                                fieldConfig.reference = "mdms";
                            } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                // Enum radio (fallback)
                                fieldConfig.type = "enum";
                                fieldConfig.format = "radio";
                                fieldConfig.values = field.dropDownOptions.map(option =>
                                    option.name || option.value || option.code
                                );
                            } else {
                                fieldConfig.type = "string";
                                fieldConfig.format = "radio";
                            }
                            break;

                        case "textarea":
                            fieldConfig.type = "string";
                            fieldConfig.format = "textarea";
                            if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                            break;

                        case "checkbox":
                            fieldConfig.type = "boolean";
                            fieldConfig.format = "checkbox";
                            break;

                        case "fileUpload":
                            fieldConfig.type = "string";
                            fieldConfig.format = "file";
                            fieldConfig.maxSizeInMB = field.maxSizeInMB || 5;
                            fieldConfig.allowedFileTypes = field.allowedFileTypes || ["pdf", "doc", "docx", "jpg", "png"];
                            break;

                        case "amount":
                            fieldConfig.type = "number";
                            fieldConfig.format = "amount";
                            if (field.validation && Object.keys(field.validation).length > 0) {
                                fieldConfig.validation = field.validation;
                            }
                            break;

                        case "email":
                            fieldConfig.type = "string";
                            fieldConfig.format = "email";
                            if (field.validation && Object.keys(field.validation).length > 0) {
                                fieldConfig.validation = field.validation;
                            }
                            break;

                        case "password":
                            fieldConfig.type = "string";
                            fieldConfig.format = "password";
                            if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                            if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                            break;

                        case "time":
                            fieldConfig.type = "string";
                            fieldConfig.format = "time";
                            break;

                        case "search":
                            fieldConfig.type = "string";
                            fieldConfig.format = "search";
                            break;

                        default:
                            // Check jsonPath for special fields that might not have proper type
                            if (field.jsonPath === "AddressMapCoord" || field.jsonPath === "AddressLocation") {
                                fieldConfig.type = "string";
                                fieldConfig.format = "geolocation";
                            } else {
                                fieldConfig.type = "string";
                                fieldConfig.format = "text";
                            }
                            break;
                    }

                    properties.push(fieldConfig);
                });

                // Create address card object with type "address"
                if (properties.length > 0) {
                    const addressCardObject = {
                        name: sectionName.replace(/\s+/g, ''),
                        type: "address",
                        label: sectionName,
                        properties: properties
                    };

                    addressFields.push(addressCardObject);
                }
            });
        });

        return addressFields;
    };

    // Function to collect all roles from workflow
    const collectAllRoles = () => {
        const usedRoleCodes = new Set();
        const moduleServicePrefix = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;

        // Collect role codes from states
        canvasElements.forEach(state => {
            if (state.roles && Array.isArray(state.roles)) {
                state.roles.forEach(role => {
                    if (role.code) {
                        const roleCode = role.code.toUpperCase().replace(/\s+/g, '_');
                        // STUDIO_CITIZEN should be added without prefix
                        if (roleCode === 'STUDIO_CITIZEN') {
                            usedRoleCodes.add('STUDIO_CITIZEN');
                        } else {
                            usedRoleCodes.add(`${moduleServicePrefix}_${roleCode}`);
                        }
                    }
                });
            }
        });

        // Collect role codes from connections/actions
        connections.forEach(connection => {
            if (connection.aroles && Array.isArray(connection.aroles)) {
                connection.aroles.forEach(role => {
                    if (role.code) {
                        const roleCode = role.code.toUpperCase().replace(/\s+/g, '_');
                        // STUDIO_CITIZEN should be added without prefix
                        if (roleCode === 'STUDIO_CITIZEN') {
                            usedRoleCodes.add('STUDIO_CITIZEN');
                        } else {
                            usedRoleCodes.add(`${moduleServicePrefix}_${roleCode}`);
                        }
                    }
                });
            }
        });

        // Get access mapping from existing role data
        const accessMapping = getRoleAccessMapping();

        // Identify roles that have ONLY viewer access (no editor or creator access)
        const viewerOnlyRoles = new Set();
        if (data && Array.isArray(data)) {
            data.forEach(role => {
                const access = role?.data?.additionalDetails?.access || {};
                const roleCode = role?.data?.code;

                // Check if role has ONLY viewer access
                if (access.viewer && !access.editor && !access.creater && roleCode) {
                    const finalRoleCode = roleCode === 'STUDIO_CITIZEN'
                        ? 'STUDIO_CITIZEN'
                        : `${moduleServicePrefix}_${roleCode.toUpperCase().replace(/\s+/g, '_')}`;
                    viewerOnlyRoles.add(finalRoleCode);
                }
            });
        }

        // Filter access mapping:
        // - Editor and Creator roles: only include if used in workflow
        // - Viewer roles: include viewer-only roles always + other viewer roles if used in workflow
        const filteredAccessMapping = {
            editor: accessMapping.editor.filter(role => usedRoleCodes.has(role)),
            viewer: accessMapping.viewer.filter(role => viewerOnlyRoles.has(role) || usedRoleCodes.has(role)),
            creator: accessMapping.creator.filter(role => usedRoleCodes.has(role))
        };

        // Note: CITIZEN and STUDIO_ADMIN are hardcoded backend roles that are automatically added to workflow actions
        // They should not be included in the service configuration roles mapping

        return filteredAccessMapping;
    };

    // Function to check if specific sections exist in form
    const checkFormSections = (formConfig) => {
        if (!formConfig) return { hasAddressDetails: false, hasApplicantDetails: false };

        let hasAddressDetails = false;
        let hasApplicantDetails = false;

        formConfig.forEach(screen => {
            screen.cards?.forEach(card => {
                // Use sectionType instead of sectionName for reliable detection
                if (card.sectionType === "address" ||
                    card.fields?.some(field => field.jsonPath === "AddressPincode")) {
                    hasAddressDetails = true;
                }
                if (card.sectionType === "applicant" ||
                    card.fields?.some(field => field.jsonPath === "ApplicantName")) {
                    hasApplicantDetails = true;
                }
            });
        });

        return { hasAddressDetails, hasApplicantDetails };
    };

    const generateGroupedTemplates = (notifications) => {
        const grouped = {
            sms: [],
            email: [],
            push: [],
        };

        // Find states that have notifications selected
        const statesWithNotifications = canvasElements.filter(state =>
            state.sendnotif && state.sendnotif.length > 0
        );

        // Only include notifications that are actually selected in any state
        notifications.forEach((item) => {
            const type = item.additionalDetails?.type;
            if (!type || !grouped[type]) return;

            // Find which states use this notification
            const statesUsingThisNotification = statesWithNotifications
                .filter(state => state.sendnotif && state.sendnotif.some(notif => notif.code === item.title))
                .map(state => state.name.toUpperCase().replace(/\s+/g, '_'));

            // Only add notification if it's used in at least one state
            if (statesUsingThisNotification.length > 0) {
                const template = {
                    code: item.title || "",
                    states: statesUsingThisNotification,
                    template: item.messageBody || "",
                };

                // Add subject for email notifications
                if (type === "email" && item.subject) {
                    template.subject = item.subject;
                }

                grouped[type].push(template);
            }
        });

        // If no notifications are configured, provide empty arrays
        return {
            sms: grouped.sms || [],
            push: grouped.push || [],
            email: grouped.email || []
        };
    };

    // Update the transformApplicantFieldsFromForm function around lines 1697-1771
    const transformApplicantFieldsFromForm = (formConfig) => {
        if (!formConfig) return [];

        let applicantFields = [];

        formConfig.forEach(screen => {
            screen.cards?.forEach(card => {
                // Use sectionType for reliable detection instead of sectionName
                if (card.sectionType === "applicant" ||
                    card.fields?.some(field => field.jsonPath === "ApplicantName")) {

                    card.fields?.filter(ob => ob?.hidden !== true)?.forEach((field, index) => {
                        // Determine the correct path based on field type
                        const fieldName = field.label?.replace(/\s+/g, '').toLowerCase() ||
                            field.jsonPath?.replace(/\s+/g, '').toLowerCase() ||
                            `field_${index}`;

                        // Use individual.{fieldName} for all applicant section fields (name, mobile, email, gender)
                        const isApplicantField = field.jsonPath === "ApplicantName" ||
                            field.jsonPath === "ApplicantMobile" ||
                            field.jsonPath === "ApplicantMobileNumber" ||
                            field.jsonPath === "ApplicantEmail" ||
                            field.jsonPath === "ApplicantGender";

                        const path = isApplicantField
                            ? `individual.${fieldName}`
                            : `additionalFields.${fieldName}`;

                        const fieldConfig = {
                            name: fieldName,
                            type: getFieldType(field.type),
                            label: field.label || `Field ${index + 1}`,
                            format: getFieldFormat(field.type),
                            required: field.required || false,
                            orderNumber: index + 1,
                            path: path
                        };

                        // Add validation if present
                        if (field.regex && field.errorMessage) {
                            fieldConfig.validation = {
                                regex: field.regex,
                                message: field.errorMessage
                            };
                        }

                        // Handle different field types with enhanced mapping (same as transformFormToFields)
                        switch (field.type) {
                            case "textInput":
                            case "text":
                                fieldConfig.type = "string";
                                fieldConfig.format = "text";
                                if (field?.charCount && field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                                if (field?.charCount && field.minLength) fieldConfig.minLength = Number(field.minLength);
                                if (field.regex && field.errorMessage) {
                                    fieldConfig.validation = {
                                        regex: field.regex,
                                        message: field.errorMessage
                                    }
                                }
                                break;

                            case "number":
                                fieldConfig.type = "integer";
                                fieldConfig.format = "number";
                                if (field.regex && field.errorMessage) {
                                    fieldConfig.validation = {
                                        regex: field.regex,
                                        message: field.errorMessage
                                    }
                                }
                                break;

                            case "datePicker":
                            case "date":
                                fieldConfig.type = "date";
                                fieldConfig.format = "date";
                                break;

                            case "mobileNumber":
                                fieldConfig.type = "mobileNumber";
                                fieldConfig.format = "mobileNumber";
                                fieldConfig.minLength = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10;
                                fieldConfig.maxLength = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10;
                                fieldConfig.prefix = field.isdCodePrefix || window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobilePrefix || "91";
                                if (field.regex && field.errorMessage) {
                                    fieldConfig.validation = {
                                        regex: field.regex,
                                        message: field.errorMessage
                                    }
                                }
                                break;

                            case "dropdown":
                                // Check isMdms flag first - if false and has dropDownOptions, use enum options
                                if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                    // Enum dropdown (custom options, not from MDMS)
                                    fieldConfig.type = "enum";
                                    fieldConfig.format = "radioordropdown";
                                    fieldConfig.values = field.dropDownOptions.map(option =>
                                        option.name || option.value || option.code
                                    );
                                } else if (field.isMdms === true && field.schemaCode) {
                                    // MDMS dropdown (explicitly marked as MDMS)
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radioordropdown";
                                    fieldConfig.schema = field.schemaCode;
                                    fieldConfig.reference = "mdms";
                                } else if (field.schemaCode && field.isMdms !== false) {
                                    // MDMS dropdown (has schemaCode and not explicitly non-MDMS)
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radioordropdown";
                                    fieldConfig.schema = field.schemaCode;
                                    fieldConfig.reference = "mdms";
                                } else if (field.isBoundaryData) {
                                    // Boundary data dropdown
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radioordropdown";
                                    fieldConfig.schema = "common-masters.BoundaryType";
                                    fieldConfig.reference = "mdms";
                                } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                    // Enum dropdown (fallback)
                                    fieldConfig.type = "enum";
                                    fieldConfig.format = "radioordropdown";
                                    fieldConfig.values = field.dropDownOptions.map(option =>
                                        option.name || option.value || option.code
                                    );
                                } else {
                                    // Default dropdown
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radioordropdown";
                                }
                                break;

                            case "radio":
                                // Check isMdms flag first - if false and has dropDownOptions, use enum options
                                if (field.isMdms === false && field.dropDownOptions && field.dropDownOptions.length > 0) {
                                    // Enum radio (custom options, not from MDMS)
                                    fieldConfig.type = "enum";
                                    fieldConfig.format = "radio";
                                    fieldConfig.values = field.dropDownOptions.map(option =>
                                        option.name || option.value || option.code
                                    );
                                } else if (field.isMdms === true && field.schemaCode) {
                                    // MDMS radio (explicitly marked as MDMS)
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radio";
                                    fieldConfig.schema = field.schemaCode;
                                    fieldConfig.reference = "mdms";
                                } else if (field.schemaCode && field.isMdms !== false) {
                                    // MDMS radio (has schemaCode and not explicitly non-MDMS)
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radio";
                                    fieldConfig.schema = field.schemaCode;
                                    fieldConfig.reference = "mdms";
                                } else if (field.dropDownOptions && field.dropDownOptions.length > 0) {
                                    // Enum radio (fallback)
                                    fieldConfig.type = "enum";
                                    fieldConfig.format = "radio";
                                    fieldConfig.values = field.dropDownOptions.map(option =>
                                        option.name || option.value || option.code
                                    );
                                } else {
                                    // Default radio
                                    fieldConfig.type = "string";
                                    fieldConfig.format = "radio";
                                }
                                break;

                            case "textarea":
                                fieldConfig.type = "string";
                                fieldConfig.format = "textarea";
                                if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                                if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                                break;

                            case "checkbox":
                                fieldConfig.type = "boolean";
                                fieldConfig.format = "checkbox";
                                break;

                            case "fileUpload":
                                fieldConfig.type = "string";
                                fieldConfig.format = "file";
                                fieldConfig.maxSizeInMB = field.maxSizeInMB || 5;
                                fieldConfig.allowedFileTypes = field.allowedFileTypes || ["pdf", "doc", "docx", "jpg", "png"];
                                break;

                            case "amount":
                                fieldConfig.type = "number";
                                fieldConfig.format = "amount";
                                if (field.validation && Object.keys(field.validation).length > 0) {
                                    fieldConfig.validation = field.validation;
                                }
                                break;

                            case "email":
                                fieldConfig.type = "string";
                                fieldConfig.format = "email";
                                if (field.validation && Object.keys(field.validation).length > 0) {
                                    fieldConfig.validation = field.validation;
                                }
                                break;

                            case "password":
                                fieldConfig.type = "string";
                                fieldConfig.format = "password";
                                if (field.maxLength) fieldConfig.maxLength = Number(field.maxLength);
                                if (field.minLength) fieldConfig.minLength = Number(field.minLength);
                                break;

                            case "time":
                                fieldConfig.type = "string";
                                fieldConfig.format = "time";
                                break;

                            case "geolocation":
                                fieldConfig.type = "string";
                                fieldConfig.format = "geolocation";
                                break;

                            case "search":
                                fieldConfig.type = "string";
                                fieldConfig.format = "search";
                                break;

                            case "numeric":
                                fieldConfig.type = "integer";
                                fieldConfig.format = "numeric";
                                if (field.validation && Object.keys(field.validation).length > 0) {
                                    fieldConfig.validation = field.validation;
                                }
                                break;

                            default:
                                // Default fallback for unknown field types
                                fieldConfig.type = "string";
                                fieldConfig.format = "text";
                                break;
                        }

                        applicantFields.push(fieldConfig);
                    });
                }
            });
        });

        return applicantFields;
    };

    // Helper function to get field type
    const getFieldType = (fieldType) => {
        switch (fieldType) {
            case "textInput":
            case "text":
                return "string";
            case "number":
            case "numeric":
                return "integer";
            case "mobileNumber":
                return "string";
            case "email":
                return "string";
            case "datePicker":
            case "date":
                return "date";
            case "textarea":
                return "string";
            case "checkbox":
                return "boolean";
            case "dropdown":
            case "radio":
                return "string";
            default:
                return "string";
        }
    };

    // Helper function to get field format
    const getFieldFormat = (fieldType) => {
        switch (fieldType) {
            case "textInput":
            case "text":
                return "text";
            case "number":
            case "numeric":
                return "number";
            case "mobileNumber":
                return "mobileNumber";
            case "email":
                return "email";
            case "datePicker":
            case "date":
                return "date";
            case "textarea":
                return "textarea";
            case "checkbox":
                return "checkbox";
            case "dropdown":
            case "radio":
                return "radioordropdown";
            default:
                return "text";
        }
    };

    // Function to generate complete service configuration
    const generateServiceConfiguration = async () => {
        // Get existing console outputs
        const workflowData = transformWorkflowData(canvasElements, connections);
        const documentData = documentConfig(connections, `${roleModule}${roleService}`);

        // Get form data from start state
        const formDataFromStartState = getFormDataFromStartState();
        const formFields = transformFormToFields(formDataFromStartState);

        // Get address section fields with type "address"
        const addressFields = transformAddressFieldsFromForm(formDataFromStartState);

        // Combine form fields with address fields
        const allFields = [...formFields, ...addressFields];

        // Check for specific sections in form
        const { hasAddressDetails, hasApplicantDetails } = checkFormSections(formDataFromStartState);

        // Extract boundary config from address section's hierarchy dropdown
        const getBoundaryConfigFromAddressFields = () => {
            // Look for hierarchyDropdown field in addressFields
            const hierarchyField = addressFields.find(section =>
                section.properties?.some(prop => prop.format === "hierarchyDropdown")
            )?.properties?.find(prop => prop.format === "hierarchyDropdown");

            if (hierarchyField) {
                return {
                    highestLevel: hierarchyField.highestHierarchy || "locality",
                    lowestLevel: hierarchyField.lowestHierarchy || "locality",
                    hierarchyType: hierarchyField.hierarchyType || "ADMIN"
                };
            }

            // Fallback to default values
            return {
                highestLevel: "locality",
                lowestLevel: "locality",
                hierarchyType: "ADMIN"
            };
        };

        const boundaryConfig = getBoundaryConfigFromAddressFields();

        // Transform roles to the format expected in service config
        const accessMapping = collectAllRoles();

        // Get module and service from URL parameters
        const moduleName = roleModule.toLowerCase();
        const serviceName = roleService.toLowerCase();

        // Get UI configurations from existing draft
        const existingDraft = FormData?.mdms?.[0];
        const uiConfigurations = {
            uiforms: existingDraft?.data?.uiforms || [],
            uichecklists: existingDraft?.data?.uichecklists || [],
            uiroles: existingDraft?.data?.uiroles || [],
            uinotifications: existingDraft?.data?.uinotifications || [],
            uiworkflow: {
                canvasElements: canvasElements,
                connections: connections
            }
        };

        // Get applicant fields from form configuration
        const applicantFields = transformApplicantFieldsFromForm(formDataFromStartState);

        // Determine if any selected roles in workflow have selfRegistration enabled or if STUDIO_CITIZEN is used
        const usedRoleCodes = new Set();
        canvasElements.forEach(state => {
            if (state.roles && Array.isArray(state.roles)) {
                state.roles.forEach(role => {
                    if (role.code) usedRoleCodes.add(role.code);
                });
            }
        });
        connections.forEach(conn => {
            if (conn.aroles && Array.isArray(conn.aroles)) {
                conn.aroles.forEach(role => {
                    if (role.code) usedRoleCodes.add(role.code);
                });
            }
        });

        // Check if STUDIO_CITIZEN role is used in workflow actions
        const hasStudioCitizen = usedRoleCodes.has('STUDIO_CITIZEN');

        // Check if any role with selfRegistration is used
        const hasSelfRegistrationRole = (data || []).some(role => role?.data?.additionalDetails?.selfRegistration === true && usedRoleCodes.has(role?.data?.code));

        // Enable CITIZEN if either STUDIO_CITIZEN is used or a self-registration role is used
        const hasCitizen = hasStudioCitizen || hasSelfRegistrationRole;

        const serviceConfig = {
            module: roleModule,
            service: roleService,
            enabled: hasCitizen ? ["CITIZEN", "EMPLOYEE"] : ["EMPLOYEE"],
            workflow: workflowData.workflow,
            documents: documentData,
            fields: allFields,
            access: {
                roles: accessMapping,
                actions: [
                    {
                        url: `${serviceName}-services/v1/create`
                    }
                ]
            },
            rules: {
                validation: {
                    type: "schema",
                    service: serviceName,
                    schemaCode: `${serviceName}.apply`,
                    customFunction: ""
                },
                calculator: {
                    type: "custom",
                    service: serviceName,
                    customFunction: ""
                },
                registry: {
                    type: "api",
                    service: serviceName
                },
                references: [
                    {
                        type: "initiate",
                        service: serviceName
                    }
                ]
            },
            calculator: {
                type: "custom",
                billingSlabs: [
                    {
                        key: "applicationFee",
                        value: 2000
                    }
                ]
            },
            idgen: [
                {
                    type: "application",
                    format: `${moduleName}-${serviceName}-app-[cy:yyyy-MM-dd]-[SEQ_PUBLIC_APPLICATION]`,
                    idname: `${moduleName}-${serviceName}.application.${serviceName}.applicationapp.id`
                },
                {
                    type: "service",
                    format: `${moduleName}-${serviceName}-svc-[cy:yyyy-MM-dd]-[SEQ_PUBLIC_APPLICATION]`,
                    idname: `${moduleName}-${serviceName}.application.${serviceName}.applicationservice.id`
                }
            ],
            localization: {
                modules: [`digit-studio`]
            },
            notification: generateGroupedTemplates(notif),
            // Include boundary object with values from address section's hierarchy dropdown
            ...(hasAddressDetails && {
                boundary: {
                    highestLevel: boundaryConfig.highestLevel,
                    lowestLevel: boundaryConfig.lowestLevel,
                    hierarchyType: boundaryConfig.hierarchyType
                }
            }),
            // Only include applicant if applicant details exist
            ...(hasApplicantDetails && {
                applicant: {
                    types: ["individual", "organisation"],
                    config: {
                        systemUser: true,
                        systemRoles: ["STUDIO_CITIZEN"],
                        systemUserType: "CITIZEN"
                    },
                    maximum: 3,
                    minimum: 1,
                    allowLoggedInUser: false, // Set to false when applicant section exists
                    searchby: [],
                    individual: {
                        properties: [
                            // Add dynamic applicant fields from form
                            ...applicantFields
                        ]
                    },
                    organisation: {
                        properties: [

                            // Add custom applicant fields

                        ]
                    }
                }
            }),
            // When no applicant section exists, set allowLoggedInUser to true
            ...(!hasApplicantDetails && {
                applicant: {
                    types: ["individual", "organisation"],
                    config: {
                        systemUser: true,
                        systemRoles: ["STUDIO_CITIZEN"],
                        systemUserType: "CITIZEN"
                    },
                    maximum: 3,
                    minimum: 1,
                    allowLoggedInUser: true, // Set to true when no applicant section
                    searchby: [],
                    individual: {
                        properties: [] // Empty properties when no applicant section
                    },
                    organisation: {
                        properties: [] // Empty properties when no applicant section
                    }
                }
            }),
            apiconfig: [
                {
                    host: "https://staging.digit.org",
                    type: "register",
                    method: "post",
                    service: serviceName,
                    endpoint: `/${serviceName}-services/v1/create`
                },
                {
                    host: "https://staging.digit.org",
                    type: "search",
                    method: "post",
                    service: serviceName,
                    endpoint: `/${serviceName}-services/v1/search`
                }
            ],
            "pdf": [
                {
                    "key": "tl-application",
                    "type": "application",
                    "states": [
                        "applied",
                        "approved"
                    ]
                },
                {
                    "key": "tl-bill",
                    "type": "bill",
                    "states": [
                        "approved"
                    ]
                },
                {
                    "key": "tl-receipt",
                    "type": "receipt",
                    "states": [
                        "approved"
                    ]
                }
            ],
            "bill": {
                "taxHead": [
                    {
                        "code": "applicationFee",
                        "name": "applicationFee",
                        "order": "2",
                        "isDebit": false,
                        "service": "TESTBSONE",
                        "category": "TAX",
                        "isRequired": false,
                        "isActualDemand": true
                    }
                ],
                "taxPeriod": [
                    {
                        "code": "TEST2018",
                        "toDate": 1554076799000,
                        "service": "TESTBSONE",
                        "fromDate": 1522540800000,
                        "periodCycle": "ANNUAL",
                        "financialYear": "2018-19"
                    }
                ],
                "BusinessService": {
                    "code": "TESTBSONE",
                    "businessService": "TESTBSONE",
                    "demandUpdateTime": 86400000,
                    "isAdvanceAllowed": false,
                    "minAmountPayable": 100,
                    "partPaymentAllowed": true,
                    "isVoucherCreationEnabled": true,
                    "collectionModesNotAllowed": [
                        "DD",
                        "OFFLINE_NEFT",
                        "OFFLINE_RTGS",
                        "POSTAL_ORDER"
                    ]
                }
            },
            "inbox": {
                "index": "public-service-index",
                "module": "public-service",
                "sortBy": {
                    "path": "Data.auditDetails.createdTime",
                    "defaultOrder": "DESC"
                },
                "sourceFilterPathList": [
                    "Data.businessService",
                    "Data.applicationNumber",
                    "Data.currentProcessInstance",
                    "Data.auditDetails",
                    "Data.additionalDetails",
                    "Data.module",
                    "Data.locality",
                    "Data.status"
                ],
                "allowedSearchCriteria": [
                    {
                        "name": "tenantId",
                        "path": "Data.tenantId.keyword",
                        "operator": "EQUAL",
                        "isMandatory": true
                    },
                    {
                        "name": "status",
                        "path": "Data.workflowStatus",
                        "isMandatory": false
                    },
                    {
                        "name": "applicationNumber",
                        "path": "Data.applicationNumber.keyword",
                        "isMandatory": false
                    },
                    {
                        "name": "module",
                        "path": "Data.module.keyword",
                        "isMandatory": false
                    },
                    {
                        "name": "businessService",
                        "path": "Data.businessService.keyword",
                        "isMandatory": false
                    },
                    {
                        "name": "locality",
                        "path": "Data.address.locality.keyword",
                        "isMandatory": false
                    },
                    {
                        "name": "assignee",
                        "path": "Data.currentProcessInstance.assignes.uuid.keyword",
                        "isMandatory": false
                    }
                ]
            },
            "payment": {
                "gateway": "TODO"
            }
        };

        // Add UI configurations to service config
        serviceConfig.uiforms = uiConfigurations.uiforms;
        serviceConfig.uichecklists = uiConfigurations.uichecklists;
        serviceConfig.uiroles = uiConfigurations.uiroles;
        serviceConfig.uinotifications = uiConfigurations.uinotifications;
        serviceConfig.uiworkflow = uiConfigurations.uiworkflow;

        const checklistConfig = [];
        canvasElements.forEach(state => {
            if (state.checklist && state.checklist.length > 0) {
                state.checklist.forEach(checklistItem => {
                    // Find the full checklist data from uichecklists
                    const fullChecklistData = uiConfigurations.uichecklists.find(
                        checklist => checklist.name === checklistItem.name
                    );

                    // Process checklist data to ensure proper structure for API
                    let processedChecklistData = null;
                    if (fullChecklistData) {
                        // Deep clone to avoid mutating original data
                        processedChecklistData = JSON.parse(JSON.stringify(fullChecklistData));
                        
                        // Process each question in the data array
                        if (processedChecklistData.data && Array.isArray(processedChecklistData.data)) {
                            // Filter only active questions
                            processedChecklistData.data = processedChecklistData.data
                                .filter(question => question.isActive === true)
                                .map(question => {
                                    // For Text type questions, ensure options is an empty array
                                    if (question.type && question.type.code === 'Text' && !question.options) {
                                        return {
                                            ...question,
                                            options: []
                                        };
                                    }
                                    return question;
                                });
                        }
                    }

                    const checklistEntry = {
                        name: checklistItem.name,
                        state: state.name.toUpperCase().replace(/\s+/g, '_'), // State name in uppercase with underscores
                        checklistData: processedChecklistData // Include the processed checklist object
                    };
                    checklistConfig.push(checklistEntry);
                });
            }
        });
        serviceConfig.checklist = checklistConfig;

        return serviceConfig;
    };

    // Function to check for inline errors in property panel and canvas elements
    const checkForInlineErrors = () => {
        const errors = [];

        // Check for state property errors in the currently selected element
        if (selectedElement && selectedElement.type === "node") {
            if (stateData.name === "") {
                errors.push("State name is required");
            }
            if (stateData.sla < 1) {
                errors.push("SLA must be at least 1 hour");
            }
        }

        // Check for action property errors in the currently selected element
        if (selectedElement && selectedElement.type === "action") {
            if (actionData.label === "") {
                errors.push("Action name is required");
            }
        }

        // Check for role property errors in the currently selected element
        if (rolePopup && roleData.name === "") {
            errors.push("Role name is required");
        }
        if (rolePopup && !roleData.creater && !roleData.editor && !roleData.viewer) {
            errors.push("At least one role permission must be selected");
        }

        // Check for errors in all canvas elements
        canvasElements.forEach((element, index) => {
            if (element.name === "" || element.name === undefined) {
                errors.push(`State ${index + 1} name is required`);
            }
            if (element.sla < 1) {
                errors.push(`State ${index + 1} SLA must be at least 1 hour`);
            }
        });

        // Check for errors in all connections
        connections.forEach((connection, index) => {
            if (connection.label === "" || connection.label === undefined) {
                errors.push(`Action ${index + 1} name is required`);
            }
        });

        return errors;
    };

    const getWrorkflowData = async () => {
        try {
            // --- VALIDATIONS BEFORE GENERATING CONFIG ---

            // 0. Check for inline errors in property panel
            const inlineErrors = checkForInlineErrors();
            if (inlineErrors.length > 0) {
                setShowToast({
                    type: "error",
                    label: t("STUDIO_WORKFLOW_INCOMPLETE_ERR")
                });
                return; // stop execution
            }

            // 1. Check if start node, connections, and processing node are valid
            const startNode = canvasElements.find(node => node.nodetype === "start");
            const hasConnections = connections && connections.length > 0;

            // Processing node validation: must have at least one incoming and one outgoing connection
            const processingNodes = canvasElements.filter(node => node.nodetype === "intermediate");
            const invalidProcessing = processingNodes.some(node => {
                const incoming = connections.some(conn => String(conn.to) === String(node.id));
                const outgoing = connections.some(conn => String(conn.from) === String(node.id));

                if (node.nodetype === "start") return !outgoing; // only needs outgoing
                if (node.nodetype === "end") return !incoming;   // only needs incoming
                return !(incoming && outgoing); // intermediates need both
            });

            if (!startNode || !hasConnections || invalidProcessing || showToast?.type === "error") {
                setShowToast({
                    type: "error",
                    label: t("STUDIO_WORKFLOW_INCOMPLETE_ERR")
                });
                return; // stop execution
            }

            // 2. Check if all nodes have roles assigned
            // const nodesWithoutRoles = canvasElements.filter(node => !node.roles || node.roles.length === 0);

            // if (nodesWithoutRoles.length > 0) {
            //     setShowToast({
            //         type: "error",
            //         label: t("STUDIO_NODES_WITHOUT_ROLES_ERR")
            //     });
            //     return;
            // }

            // 3. Check if a valid form is selected
            const formDataFromStartState = getFormDataFromStartState();
            if (!formDataFromStartState || formDataFromStartState.length === 0) {
                setShowToast({
                    type: "error",
                    label: t("STUDIO_NO_FORM_SELECTED_ERR")
                });
                return; // stop execution
            }

            // --- SHOW LOADER ---
            setIsGeneratingConfig(true);

            // Generate service configuration
            const serviceConfig = await generateServiceConfiguration();

            // Create display copy without UI configurations for popup
            const displayConfig = JSON.parse(JSON.stringify(serviceConfig));

            // Remove UI configurations from display
            delete displayConfig.uiforms;
            delete displayConfig.uichecklists;
            delete displayConfig.uiroles;
            delete displayConfig.uinotifications;
            delete displayConfig.uiworkflow;

            // Keep checklist configuration in display (it should be visible in popup)
            // checklist configuration is already added to serviceConfig and will be in displayConfig

            // Also remove workflow canvas/connections if they exist
            if (displayConfig.workflow) {
                delete displayConfig.workflow.canvasElements;
                delete displayConfig.workflow.connections;
            }

            setServiceConfigData(serviceConfig);
            setEditableServiceConfig(JSON.stringify(displayConfig, null, 2));
            setShowServiceConfigPopup(true);
        } catch (error) {
            console.error("Error generating service configuration:", error);
            setShowToast({
                type: "error",
                label: "SERVICE_CONFIG_GENERATION_FAILED"
            });
        } finally {
            setIsGeneratingConfig(false); // Hide loader
        }
    };

    const handleSaveServiceConfig = async () => {
        try {
            setIsSaving(true);

            let parsedConfig;
            try {
                parsedConfig = JSON.parse(editableServiceConfig);
            } catch (error) {
                setShowToast({
                    type: "error",
                    label: "INVALID_JSON_FORMAT"
                });
                return;
            }

            // Use the full service config (with canvas and connections) for API call
            const fullServiceConfig = serviceConfigData;

            if (existingServiceConfigId) {
                // Update existing service config
                await updateServiceConfig.mutateAsync({
                    serviceConfigData: fullServiceConfig,
                    existingConfig: existingServiceConfig
                });

                // Invalidate React Query cache to ensure fresh data on next load
                queryClient.invalidateQueries(["serviceConfig", roleModule, roleService]);

                // Update localStorage with the workflow data that was saved to the API
                if (fullServiceConfig.uiworkflow) {
                    try {
                        localStorage.setItem("canvasElements", JSON.stringify(fullServiceConfig.uiworkflow.canvasElements));
                        localStorage.setItem("connections", JSON.stringify(fullServiceConfig.uiworkflow.connections));
                    } catch (error) {
                        console.warn('Failed to save workflow to localStorage:', error);
                    }
                }

                // Invalidate localization cache so PublicServices fetches fresh translations
                try {
                    queryClient.invalidateQueries({ predicate: (query) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey)) {
                            return queryKey.some(key =>
                                typeof key === 'string' &&
                                (key.includes('STORE') ||
                                 key.includes('localisation') ||
                                 key.includes('localization') ||
                                 key.includes('LOCALISATION') ||
                                 key.includes('LOCALIZATION') ||
                                 key.includes(`studio-${roleModule}`)) ||
                                 key.includes(`rainmaker`) || 
                                 key.includes(`Digit.Locale`)
                            );
                        }
                        return false;
                    }});
                    queryClient.invalidateQueries(["SEARCH_APP_LOCALISATION"]);
                } catch (cacheError) {
                    console.warn('Failed to invalidate localization cache:', cacheError);
                }

                setShowToast({
                    type: "success",
                    label: "SERVICE_CONFIG_UPDATED_SUCCESSFULLY"
                });
                setTimeout(() => {
                    history.push(`/${window.contextPath}/employee/servicedesigner/LandingPage`);
                }, 3000);
            } else {
                // Create new service config
                await saveServiceConfig.mutateAsync(fullServiceConfig);

                // Invalidate React Query cache to ensure fresh data on next load
                queryClient.invalidateQueries(["serviceConfig", roleModule, roleService]);

                // Update localStorage with the workflow data that was saved to the API
                if (fullServiceConfig.uiworkflow) {
                    try {
                        localStorage.setItem("canvasElements", JSON.stringify(fullServiceConfig.uiworkflow.canvasElements));
                        localStorage.setItem("connections", JSON.stringify(fullServiceConfig.uiworkflow.connections));
                    } catch (error) {
                        console.warn('Failed to save workflow to localStorage:', error);
                    }
                }

                // Invalidate localization cache so PublicServices fetches fresh translations
                try {
                    queryClient.invalidateQueries({ predicate: (query) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey)) {
                            return queryKey.some(key =>
                                typeof key === 'string' &&
                                (key.includes('STORE') ||
                                 key.includes('localisation') ||
                                 key.includes('localization') ||
                                 key.includes('LOCALISATION') ||
                                 key.includes('LOCALIZATION') ||
                                 key.includes(`studio-${roleModule}`)) ||
                                 key.includes(`rainmaker`) || 
                                 key.includes(`Digit.Locale`)
                            );
                        }
                        return false;
                    }});
                    queryClient.invalidateQueries(["SEARCH_APP_LOCALISATION"]);
                } catch (cacheError) {
                    console.warn('Failed to invalidate localization cache:', cacheError);
                }

                setShowToast({
                    type: "success",
                    label: "SERVICE_CONFIG_SAVED_SUCCESSFULLY"
                });
                setTimeout(() => {
                    history.push(`/${window.contextPath}/employee/servicedesigner/LandingPage`);
                }, 3000);
            }

            setShowServiceConfigPopup(false);
        } catch (error) {
            console.error("Error saving service configuration:", error);
            setShowToast({
                type: "error",
                label: "SERVICE_CONFIG_SAVE_FAILED"
            });
        } finally {
            setIsSaving(false);
        }
    };

    //changes for publish

const handlePublishServiceConfig = async () => {
    try {
        setIsPublishing(true);

        // STEP 0: Parse the service configuration
        let formatserviceConfigData;
        try {
            formatserviceConfigData = JSON.parse(editableServiceConfig);
        } catch (error) {
            setShowToast({
                type: "error",
                label: "INVALID_JSON_FORMAT"
            });
            return;
        }

        // STEP 1: Save UI workflow data to Studio.ServiceConfigurationDrafts (same as save button)
        const tenantId = Digit.ULBService.getCurrentTenantId();
        const fullServiceConfig = serviceConfigData;

        try {
            if (existingServiceConfigId) {
                await updateServiceConfig.mutateAsync({
                    serviceConfigData: fullServiceConfig,
                    existingConfig: existingServiceConfig
                });
            } else {
                await saveServiceConfig.mutateAsync(fullServiceConfig);
            }

            // Invalidate React Query cache to ensure fresh data on next load
            queryClient.invalidateQueries(["serviceConfig", roleModule, roleService]);
        } catch (draftError) {
            console.error("Error saving to drafts:", draftError);
            setShowToast({
                type: "error",
                label: "DRAFT_SAVE_FAILED"
            });
            return;
        }

        // STEP 2: Publish to Studio.ServiceConfiguration (MDMS)
        const mdmsPayload = {
            Mdms: {
                tenantId: tenantId,
                schemaCode: "Studio.ServiceConfiguration",
                data: formatserviceConfigData
            }
        };

        const mdmsContextPath =
            window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") ||
            "egov-mdms-service";

        let allowServiceCreation = false;

        try {
            const mdmsResponse = await Digit.CustomService.getResponse({
                url: `/${mdmsContextPath}/v2/_create/Studio.ServiceConfiguration`,
                body: mdmsPayload
            });
            if (mdmsResponse?.mdms) {
                allowServiceCreation = true;
            }
        } catch (error) {
            const errorCode = error?.response?.data?.Errors?.[0]?.code;
            if (errorCode === "DUPLICATE_RECORD") {
                // silently allow service creation
                allowServiceCreation = true;
            } else {
                setShowToast({
                    type: "error",
                    label: "SERVICE_CONFIG_PUBLISH_FAILED"
                });
                return; // stop here for non-duplicate errors
            }
        }

        // STEP 3: Make service API call using mutation hook
        if (allowServiceCreation) {
            try {
                await serviceCreationMutation.mutateAsync({
                    body: {
                        service: {
                            tenantId: tenantId,
                            businessService: formatserviceConfigData.service,
                            module: formatserviceConfigData.module,
                            status: "ACTIVE",
                            additionalDetails: {
                                note: "initial creation"
                            }
                        }
                    }
                });

                // Update localStorage with the workflow data that was saved to the API
                if (fullServiceConfig.uiworkflow) {
                    try {
                        localStorage.setItem("canvasElements", JSON.stringify(fullServiceConfig.uiworkflow.canvasElements));
                        localStorage.setItem("connections", JSON.stringify(fullServiceConfig.uiworkflow.connections));
                    } catch (error) {
                        console.warn('Failed to save workflow to localStorage:', error);
                    }
                }

                // Invalidate localization cache so PublicServices fetches fresh translations
                // This ensures new localizations are available without logout/login
                try {
                    // Invalidate all localization-related queries
                    queryClient.invalidateQueries({ predicate: (query) => {
                        const queryKey = query.queryKey;
                        if (Array.isArray(queryKey)) {
                            return queryKey.some(key =>
                                typeof key === 'string' &&
                                (key.includes('STORE') ||
                                 key.includes('localisation') ||
                                 key.includes('localization') ||
                                 key.includes('LOCALISATION') ||
                                 key.includes('LOCALIZATION') ||
                                 key.includes(`studio-${roleModule}`))
                            );
                        }
                        return false;
                    }});

                    // Also invalidate app localisation queries
                    queryClient.invalidateQueries(["SEARCH_APP_LOCALISATION"]);

                    console.log('Localization cache invalidated successfully');
                } catch (cacheError) {
                    console.warn('Failed to invalidate localization cache:', cacheError);
                }

                setShowToast({
                    type: "success",
                    label: "SERVICE_CONFIG_PUBLISHED_SUCCESSFULLY"
                });
                setTimeout(() => {
                    history.push(
                        `/${window.contextPath}/employee/servicedesigner/LandingPage`
                    );
                }, 3000);
            } catch (serviceError) {
                console.error("Service creation failed:", serviceError);
                setShowToast({
                    type: "error",
                    label: "SERVICE_CREATION_FAILED"
                });
            }
        }

        setShowServiceConfigPopup(false);
    } catch (error) {
        console.error("Error publishing service configuration:", error);
        setShowToast({
            type: "error",
            label: "SERVICE_CONFIG_PUBLISH_FAILED"
        });
    } finally {
        setIsPublishing(false);
    }
};


    const onLoadSample = () => {
        setLoadSamplePopup(true);
    }

    const onClear = () => {
        setCanvasElements([]);
        setConnections([]);
        setSelectedElement(null);
        setConnectionStart(null);
        setConnecting(null);
        setLabelOffsets({}); // Clear label offsets too
    }
    useEffect(() => {
        const foundStart = canvasElements.some(
            (el) => el.nodetype === "start"
        );
        setHasStart(foundStart);
        const foundEnd = canvasElements.filter((el) => el.nodetype === "end").length;
        setEndStateCount(foundEnd);

        // Debug: Log canvas elements and connections
    }, [canvasElements, connections]);
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!connectionStart) return;

            const rect = document.querySelector(".viewport")?.getBoundingClientRect();
            if (!rect) return;

            // Get current transform from InfiniteCanvas
            const canvasElement = document.querySelector(".canvas");
            if (!canvasElement) return;

            // Extract transform values from the canvas element's style
            const transformStyle = canvasElement.style.transform;
            const translateMatch = transformStyle.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
            const scaleMatch = transformStyle.match(/scale\(([^)]+)\)/);

            const transformX = translateMatch ? parseFloat(translateMatch[1]) : 0;
            const transformY = translateMatch ? parseFloat(translateMatch[2]) : 0;
            const transformScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

            // Convert mouse position from screen space to canvas space
            const mouseScreenX = e.clientX - rect.left;
            const mouseScreenY = e.clientY - rect.top;
            const mouseCanvasX = (mouseScreenX - transformX) / transformScale;
            const mouseCanvasY = (mouseScreenY - transformY) / transformScale;

            setConnecting({
                from: connectionStart,
                x2: mouseCanvasX,  // ✅ Now in canvas space!
                y2: mouseCanvasY   // ✅ Now in canvas space!
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [connectionStart]);

    useEffect(() => {
        try {
            localStorage.setItem("connections", JSON.stringify(connections));
            localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
            localStorage.setItem("labelOffsets", JSON.stringify(labelOffsets));
        } catch (error) {
            // Handle quota exceeded or other localStorage errors
            if (error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded. Clearing workflow cache...');
                // Clear localStorage to free up space
                try {
                    localStorage.removeItem("connections");
                    localStorage.removeItem("canvasElements");
                    localStorage.removeItem("labelOffsets");
                } catch (clearError) {
                    console.error('Failed to clear localStorage:', clearError);
                }
            } else {
                console.error('Failed to save to localStorage:', error);
            }
        }
    }, [connections, canvasElements, labelOffsets]);

    if (isLoading || moduleListLoading || isConfigLoad) {
        return <Loader />;
    }
    return (
        <React.Fragment>
            {(isPublishing || isSaving) && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Loader
                        page={true}
                        variant="OverlayLoader"
                        loaderText={isPublishing ? t("PUBLISHING_CONFIG") : t("SAVING_CONFIG_IN_SERVER")}
                    />
                </div>
            )}
            <Card style={{ flex: 1, marginRight: "1rem", border: '0.063rem solid #d6d5d4', height: "100vh" }} className="Workflow-card">
                <Card className="Workflow-card" style={{ height: "100vh" }}>
                <SidePanel
                    type="static"
                    position="left"
                    isDraggable={true}
                    sections={Workflow_Sections}
                    addClose={true}
                    isOverlay={false}
                    hideScrollIcon={true}
                    hideArrow={false}
                    className="slider-container"
                    // footer={
                        // <Button
                        //     variation="secondary"
                        //     label={isGeneratingConfig ? t("GENERATING_CONFIG") : (isEditMode ? t("UPDATE_SERVICE_CONFIG") : t("GET_SERVICE_CONFIG"))}
                        //     type="button"
                        //     className="secondary-button"
                        //     style={{ width: "100%" }}
                        //     disabled={isGeneratingConfig}
                        //     onClick={(e) => getWrorkflowData(e)}
                        // />
                    // }
                />
            </Card>
            <InfiniteCanvas
                elements={elementsWithComponents}
                onElementClick={handleElementClick}
                onElementDrag={handleElementDrag}
                connections={connections}
                connecting={connecting}
                canvasPoints={CanvasClick}
                onConnectionLabelClick={(conn, e) => onconnectionClick(conn, e)}
                onClear={onClear}
                onLoadSample={onLoadSample}
                labelOffsets={labelOffsets}
                onLabelOffsetChange={setLabelOffsets}
            />
            {selectedElement && <Card className="Workflow-card">
                <SidePanel
                    key={JSON.stringify({
                        id: selectedElement?.id,
                        type: selectedElement?.type,
                        roles: stateData?.roles,
                        sendnotif: stateData?.sendnotif,
                        checklist: stateData?.checklist,
                        aroles: actionData?.aroles
                    })} // Force remount when selected element or its properties change
                    type="static"
                    position="left"
                    isDraggable={true}
                    sections={selectedElement?.type === "node" ? Node_Properties_Section : selectedElement?.type === "action" ? Action_Properties_Section : Properties_Section}
                    addClose={true}
                    onClose={() => {
                        setSelectedElement(null);
                        setStateData({ name: "", desc: "", roles: [], sla: 0, form: [], checklist: [], sendnotif: [] });
                        setActionData({ label: "", desc: "", aroles: [], aaskfordoc: false, aassign: false, acomments: false });
                    }}
                    isOverlay={false}
                    hideScrollIcon={true}
                    hideArrow={false}
                    className="slider-container"
                    defaultOpenWidth={335}
                    style={{ height: "100vh" }}
                    header={
                        <div className="typography heading-m" style={{ color: "#0B4B66", marginLeft: "0px" }}>
                            <div>{selectedElement?.type === "node" ? t("STATE_PROPERTIES") : selectedElement?.type === "action" ? t("ACTION_PROPERTIES") : t("PROPERTIES")}</div>
                        </div>
                    }
                    footer={
                        selectedElement?.type === "node" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <Button
                                    variation="primary"
                                    label={t("UPDATE_PROPERTIES")}
                                    type="button"
                                    size={"large"}
                                    style={{ width: "100%" }}
                                    onClick={updateProperties}
                                />
                                <Button
                                    variation="secondary"
                                    label={t("DELETE_STATE")}
                                    type="button"
                                    className="secondary-button"
                                    style={{ width: "100%" }}
                                    onClick={(e) => DeleteClick(selectedElement?.id, e)}
                                />
                            </div>
                        ) : selectedElement?.type === "action" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <Button
                                    variation="primary"
                                    label={t("UPDATE_ACTION")}
                                    type="button"
                                    size={"large"}
                                    style={{ width: "100%" }}
                                    onClick={updateActionProperties}
                                />
                                <Button
                                    variation="secondary"
                                    label={t("DELETE_CONNECTION")}
                                    type="button"
                                    className="secondary-button"
                                    style={{ width: "100%" }}
                                    onClick={(e) => DeleteActionClick(selectedElement?.id, e)}
                                />
                            </div>
                        ) : null
                    }
                />
            </Card>}
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

            {/* Service Configuration Popup */}
            {showServiceConfigPopup && (
                <PopUp
                    heading={t("EDITABLE_SERVICE_CONFIGURATION")}
                    // header={t("SERVICE_CONFIGURATION")}
                    // headerBarMain={t("EDITABLE_SERVICE_CONFIG")}
                    actionCancelLabel={!(isSaving || isPublishing) ? t("CLOSE") : ""}
                    actionCancelOnSubmit={!(isSaving || isPublishing) ? () => setShowServiceConfigPopup(false) : undefined}
                    onClose={!(isSaving || isPublishing) ? () => setShowServiceConfigPopup(false) : undefined}
                    style={{ maxWidth: "47%" }}
                    children={[
                        isGeneratingConfig ? (
                            <div key="service-config-loader" style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "3rem",
                                flexDirection: "column"
                            }}>
                                <Loader />
                                <div style={{ marginTop: "1rem", color: "#666" }}>
                                    {t("GENERATING_SERVICE_CONFIGURATION")}...
                                </div>
                            </div>
                        ) : (
                            <div key="service-config-preview">
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "1rem"
                                }}>
                                    {/* <h4 style={{ color: "#495057", margin: 0 }}>
                                        {t("EDITABLE_SERVICE_CONFIGURATION")}
                                    </h4> */}
                                    {/* <div style={{ color: "#666", fontSize: "12px" }}>
                                        Config Length: {editableServiceConfig.length} characters
                                    </div> */}
                                </div>

                                <textarea
                                    value={editableServiceConfig}
                                    onChange={(e) => setEditableServiceConfig(e.target.value)}
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        lineHeight: "1.4",
                                        minHeight: "30vh",
                                        maxHeight: "40vh",
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: "4px",
                                        padding: "0.5rem",
                                        resize: "none",
                                        marginBottom: "1rem",
                                        overflow: "auto",
                                    }}
                                    placeholder="Edit service configuration JSON..."
                                />
                                <AlertCard label={t("PUBLISH_INFO")} text={t("PUBLISH_INFO_DEFINITION")} />
                                <div style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "0.5rem",
                                    paddingTop: "1rem",
                                    //borderTop: "1px solid #e9ecef",
                                    marginTop: "1rem"
                                }}>
                                    <Button
                                        variation="secondary"
                                        label={t("CLOSE")}
                                        onClick={() => setShowServiceConfigPopup(false)}
                                        isDisabled={isSaving || isPublishing}
                                    />
                                    <Button
                                        variation="secondary"
                                        label={isSaving ? t("SAVING") : t("SAVE")}
                                        onClick={handleSaveServiceConfig}
                                        isDisabled={isSaving || isPublishing}
                                    />
                                    <Button
                                        variation="primary"
                                        label={isPublishing ? t("PUBLISHING") : t("PUBLISH")}
                                        onClick={handlePublishServiceConfig}
                                        isDisabled={isSaving || isPublishing}
                                    />
                                </div>
                            </div>
                        )
                    ]}
                />
            )}

            {/* Role Popup */}
            {rolePopup && (
                <PopUp
                    type={"default"}
                    heading={t("CREATE_NEW_ROLE")}
                    children={[]}
                    style={{ width: "40rem", zIndex: 9999 }}
                    onOverlayClick={() => {
                        setRoleData({
                            name: "",
                            desc: "",
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                        });
                        setRolePopup(false);
                    }}
                    onClose={() => {
                        setRoleData({
                            name: "",
                            desc: "",
                            viewer: false,
                            editor: false,
                            creater: false,
                            selfRegistration: false,
                        });
                        setRolePopup(false);
                    }}
                    footerChildren={[
                        /* Self-registration toggle - commented out
                        (() => {
                            const existingSelfRegRole = data?.find(role => role?.data?.additionalDetails?.selfRegistration === true);
                            const disableToggle = Boolean(existingSelfRegRole);
                            return (
                                <div style={{ width: "100%", marginBottom: "8px" }}>
                                    <Switch
                                        label={t("IS_THIS_CITIZEN_ROLE_ENABLE_SELF_REGISTRATION")}
                                        isCheckedInitially={Boolean(roleData.selfRegistration)}
                                        onToggle={(checked) => setRoleData(prev => ({ ...prev, selfRegistration: checked }))}
                                        disable={disableToggle}
                                    />
                                    {disableToggle && (
                                        <div className="typography body-s" style={{ color: "#B3261E", marginTop: "6px" }}>
                                            {t("ONLY_ONE_SELF_REGISTRATION_ROLE_ALLOWED")}
                                        </div>
                                    )}
                                </div>
                            );
                        })(),
                        */
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("CREATE_ROLE")}
                            onClick={(e) => { createRole(e) }}
                        />
                    ]}
                    sortFooterChildren={true}
                >
                    <FieldV1
                        label={t("ROLE_NAME")}
                        onChange={(e) => onRoleChange(e)}
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
                        value={roleData.name}
                    />
                    <FieldV1
                        label={t("ROLE_DESC")}
                        onChange={(e) => onRoleChange(e)}
                        populators={{
                            name: "desc",
                            alignFieldPairVerically: true,
                            fieldPairClassName: "workflow-field-pair",
                        }}
                        props={{
                            fieldStyle: { width: "100%" }
                        }}
                        type="text"
                        value={roleData.desc}
                    />
                    <AccessCard data={roleData} onChange={onRoleChange} />
                </PopUp>
            )}

            {/* loadSample Popup */}
            {loadSamplePopup && (
                <PopUp
                    type={"default"}
                    heading={t("LOAD_SAMPLE_HEADER")}
                    children={[]}
                    style={{ width: "40rem", zIndex: 9999 }}
                    onOverlayClick={() => { setLoadSamplePopup(false); }}
                    onClose={() => { setLoadSamplePopup(false); }}
                    footerChildren={{}}
                    sortFooterChildren={true}
                >
                </PopUp>
            )}
        </Card>
        <Footer
        style={{zIndex: "1001" }}
      actionFields={[<Button
                            variation="primary"
                            label={isGeneratingConfig ? t("GENERATING_CONFIG") : (isEditMode ? t("UPDATE_SERVICE_CONFIG") : t("GET_SERVICE_CONFIG"))}
                            type="button"
                            className="secondary-button"
                            style={{ width: "100%"}}
                            disabled={isGeneratingConfig}
                            onClick={(e) => getWrorkflowData(e)}
                        />]}
      setactionFieldsToRight
    />
        </React.Fragment>
    );
};

export default Workflow;