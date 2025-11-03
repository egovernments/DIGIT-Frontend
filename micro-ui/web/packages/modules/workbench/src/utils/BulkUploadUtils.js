import XLSX from 'xlsx';
import { createDataValidator } from './FileSecurityValidator';

// Create a data-specific security validator for bulk uploads
const createBulkUploadValidator = () => {
    return createDataValidator({
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB for bulk uploads
        ALLOWED_MIME_TYPES: [
            'application/json',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ]
    });
};

export const onConfirm = async (
    file,
    SchemaDefinitions,
    ajv,
    t,
    setShowBulkUploadModal,
    fileValidator,
    onSubmitBulk,
    setProgress
) => {
    SchemaDefinitions["$schema"] = "http://json-schema.org/draft-07/schema#"
    const validate = ajv.compile(SchemaDefinitions);

    try {
        // SECURITY: Perform comprehensive security scan before processing
        const validator = createBulkUploadValidator();
        
        try {
            const securityResult = await validator.performSecurityScan(file, (progress, message) => {
                setProgress(Math.floor(progress * 0.25)); // Use 25% of progress for security scan
            });
            
            setProgress(25); // Security scan completed
        } catch (securityError) {
            console.error('Security scan failed:', securityError);
            fileValidator(t('WBH_SECURITY_SCAN_FAILED') || `Security scan failed: ${securityError.message}`);
            setProgress(0);
            setShowBulkUploadModal(false);
            return; // Stop processing if security scan fails
        }
        if (file && file.type === 'application/json') {
            const reader = new FileReader();

            reader.onload = (event) => {
                var jsonContent = [];
                try {
                    jsonContent = JSON.parse(event.target.result);
                    setProgress(50); // File parsing completed
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    fileValidator(error.message);
                    setProgress(0);
                    return;
                }
                
                var validationError = false;
                const totalRecords = jsonContent.length;
                
                jsonContent.forEach((data, index) => {
                    const valid = validate(data);
                    if (!valid) {
                        validationError = true;
                        const errorMsg = (validate?.errors[0]?.instancePath ? "InstancePath : " + validate.errors[0].instancePath + " " : "") + validate.errors[0]?.message + " on index " + index;
                        console.error('Validation error:', errorMsg);
                        fileValidator(errorMsg);
                        setProgress(0);
                        return;
                    }
                    
                    // Update progress during validation
                    const progressPercent = 50 + (index / totalRecords) * 25; // 50-75% for validation
                    setProgress(Math.floor(progressPercent));
                });
                
                if (!validationError) {
                    setProgress(75); // Validation completed
                    // Call onSubmitBulk with setProgress
                    onSubmitBulk(jsonContent, setProgress);
                }
            };

            reader.readAsText(file);
        }
        else if (file && (file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel')
        ) {

            // Sheet would have first row as headings of columns and then each column contain values. Make array of objects from that sheet. Each object would have key as column name and value as column value
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    setProgress(50); // File parsing completed
                    
                    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                        throw new Error('No sheets found in the Excel file');
                    }
                    
                    const sheetName = workbook.SheetNames[0]; // Assuming you are interested in the first sheet
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonArray = XLSX.utils.sheet_to_json(worksheet);
                    
                    if (jsonArray.length === 0) {
                        throw new Error('No data found in the Excel sheet');
                    }
                    
                    var validationError = false;
                    const totalRecords = jsonArray.length;
                    
                    jsonArray.forEach((data, index) => {
                        const valid = validate(data);
                        if (!valid) {
                            validationError = true;
                            const errorMsg = (validate?.errors[0]?.instancePath ? "InstancePath : " + validate.errors[0].instancePath + " " : "") + validate.errors[0]?.message + " on index " + index;
                            console.error('Excel validation error:', errorMsg);
                            fileValidator(errorMsg);
                            setProgress(0);
                            return;
                        }
                        
                        // Update progress during validation
                        const progressPercent = 50 + (index / totalRecords) * 25; // 50-75% for validation
                        setProgress(Math.floor(progressPercent));
                    });
                    
                    if (!validationError) {
                        setProgress(75); // Validation completed
                        // Call onSubmitBulk with setProgress
                        onSubmitBulk(jsonArray, setProgress);
                    }
                } catch (error) {
                    console.error('Excel processing error:', error);
                    fileValidator(`Excel file processing failed: ${error.message}`);
                    setProgress(0);
                }
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            console.error('Unsupported file type:', file.type);
            fileValidator(t('WBH_ERROR_FILE_NOT_SUPPORTED') || 'File type not supported');
            setProgress(0);
        }
        setShowBulkUploadModal(false);
    } catch (error) {
        console.error('BulkUpload error:', error);
        fileValidator(error.message);
        setShowBulkUploadModal(false);
        setProgress(0);
    }
};

// Export security configuration for external use
export const getSecurityConfig = () => {
    const validator = createBulkUploadValidator();
    return validator.getConfiguration();
};

// Function to validate file before upload (can be called separately)
export const validateFileBeforeUpload = async (file, onProgress = null) => {
    try {
        const validator = createBulkUploadValidator();
        return await validator.performSecurityScan(file, onProgress);
    } catch (error) {
        console.error('Pre-upload validation failed:', error);
        throw error;
    }
};

export const generateJsonTemplate = (schema, isArray = true) => {
    var propertyTemplateObject = {}
    if (schema.properties) {
        propertyTemplateObject = Object.keys(schema.properties).reduce((acc, property) => {
            var isRequired = false;
            if (schema?.required) {
                isRequired = schema.required.includes(property);
            }
            if (schema.properties[property].type == "object") {
                acc[property] = generateJsonTemplate(schema.properties[property], false);
            }
            else if (schema.properties[property].type == "array") {
                if (schema.properties[property].items) {
                    if (Array.isArray(schema.properties[property].items) && schema.properties[property].items.length > 0 && schema.properties[property]?.items[0]) {
                        acc[property] = generateJsonTemplate(schema.properties[property].items[0], true);
                    }
                    else {
                        acc[property] = generateJsonTemplate(schema.properties[property].items, true);
                    }
                }
            }
            else {
                if (schema.properties[property].type) {
                    acc[property] = `${schema.properties[property].type}${isRequired ? " required" : ""}`;
                }
                else {
                    acc[property] = `${schema.type}${isRequired ? " required" : ""}`;
                }

            }
            return acc;
        }, {});
    }
    else {
        propertyTemplateObject = `${schema.type}`
    }
    return isArray ? [propertyTemplateObject] : propertyTemplateObject;
}

export const downloadTemplate = (template, isJson, fileValidator, t) => {
    try {
        if (template && Array.isArray(template) && template.length == 1) {
            if (isJson) {
                const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "template.json";
                a.click();
                URL.revokeObjectURL(url);
            }
            else {
                // if any property of template is not string then fileValidator(t('WBH_ERROR_TEMPLATE')) and return
                for (const property in template[0]) {
                    if (typeof template[0][property] != "string") {
                        fileValidator(t('WBH_SCHEMA_NOT_SUITABLE'));
                        return;
                    }
                }
                const ws = XLSX.utils.json_to_sheet(template);
                ws['!cols'] = Array(XLSX.utils.decode_range(ws['!ref']).e.c + 1).fill({ width: 15 });
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, 'template.xlsx');
            }
        }
        else {
            fileValidator(t('WBH_ERROR_TEMPLATE'));
        }
    } catch (e) {
        fileValidator(e.message);
    }
}