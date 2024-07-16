import { mdmsCreateBodySchema } from "../config/schemas/mdmsCreateBody";
import { validateBodyViaSchema } from "./genericValidator";

export async function validateCreateMdmsDatasRequest(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request.query.schemaName, request.query.tenantId);
}

async function validateMdmsSchema(schemaName: string, tenantId: string) {

}