/**
 * Campaign templates - a ready-made campaign setup an author can start from.
 *
 * A template carries the whole campaign type it was built for under `data.projectType`, in the
 * same shape as an `HCM-PROJECT-TYPES.projectTypes` entry: cycles, deliveries, dose criteria,
 * resources and all. That is what lets the delivery screens read a template with no new parsing -
 * they already know how to read a campaign type, and a template simply hands them a different one.
 *
 * A campaign remembers which template it came from in `additionalDetails.templateId`, written
 * once at create time. Nothing else survives the wizard: the session is cleared on the way to the
 * campaign details screen, and the delivery steps are opened from there - often on another day, on
 * another machine - so the campaign itself is the only place that can still answer the question.
 */

export const CAMPAIGN_TEMPLATE_SCHEMA_CODE = "HCM-ADMIN-CONSOLE.campaignTemplates";

/** The template a campaign was created from, or undefined for one that was not. */
export const getTemplateId = (campaign) => campaign?.additionalDetails?.templateId || undefined;

/**
 * Whether a template actually says something about this field.
 *
 * A template is allowed to be partial, so anything it leaves out - missing, null, or an empty
 * list - has to fall through to the campaign type rather than blank the value out.
 */
const isDeclared = (value) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);

/**
 * The campaign type record the delivery screens should configure from.
 *
 * Field by field rather than whole-object, because a template declaring only its cycles must still
 * get the campaign type's `attrAddDisable`, `deliveryMethods` and the rest. A campaign with no
 * template, or a template id that no longer resolves, gets the campaign type back untouched.
 */
export const mergeTemplateProjectType = (projectTypeRecord, templateProjectType) => {
  if (!templateProjectType) return projectTypeRecord;
  if (!projectTypeRecord) return templateProjectType;

  const merged = { ...projectTypeRecord };
  Object.entries(templateProjectType).forEach(([key, value]) => {
    if (isDeclared(value)) merged[key] = value;
  });

  // The code is never taken from the template. It decides which attributes, operators and app
  // modules apply, and it is what the campaign was saved with - a template names the type it was
  // built for, it does not redefine it.
  merged.code = projectTypeRecord.code;
  return merged;
};

/** The cycles a template declares. One cycle is one round, so this also says how many rounds it runs. */
export const getTemplateCycles = (templateData) => (Array.isArray(templateData?.projectType?.cycles) ? templateData.projectType.cycles : []);
