import { WorksService } from "../../elements/Works";

const ApplicationUpdateActionsEstimate = async (applicationData) => {
    try {
        const response = await WorksService.updateEstimate(applicationData);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.Errors[0].message);
    }
};

export default ApplicationUpdateActionsEstimate; 
