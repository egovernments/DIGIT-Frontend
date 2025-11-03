import XLSX from 'xlsx';

// Security configuration
const SECURITY_CONFIG = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_MIME_TYPES: [
        'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ],
    MALICIOUS_PATTERNS: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/i,
        /data:text\/html/i,
        /vbscript:/i,
        /on\w+\s*=/i,
        /%3Cscript/i,
        /%3C%2Fscript%3E/i,
        /eval\s*\(/i,
        /expression\s*\(/i
    ],
    SUSPICIOUS_EXTENSIONS: ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'],
    KNOWN_MALWARE_SIGNATURES: [
        'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', // EICAR test string
    ]
};

// Security validation functions
const validateFileSize = (file) => {
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum limit of ${SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    return true;
};

const validateMimeType = (file) => {
    if (!SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`File type '${file.type}' is not allowed. Allowed types: ${SECURITY_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`);
    }
    return true;
};

const validateFileExtension = (fileName) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    if (SECURITY_CONFIG.SUSPICIOUS_EXTENSIONS.includes(extension)) {
        throw new Error(`File extension '${extension}' is not allowed for security reasons`);
    }
    return true;
};

const calculateFileChecksum = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(event) {
            try {
                const arrayBuffer = event.target.result;
                
                // Use Web Crypto API for SHA-256 hash calculation
                if (crypto && crypto.subtle) {
                    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                } else {
                    // Fallback: Simple hash calculation for older browsers
                    const uint8Array = new Uint8Array(arrayBuffer);
                    let hash = 0;
                    for (let i = 0; i < uint8Array.length; i++) {
                        hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
                    }
                    resolve(hash.toString(16));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file for checksum calculation'));
        reader.readAsArrayBuffer(file);
    });
};

const scanForMaliciousContent = (content) => {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Check for malicious patterns
    for (const pattern of SECURITY_CONFIG.MALICIOUS_PATTERNS) {
        if (pattern.test(contentStr)) {
            throw new Error('Malicious content detected in file');
        }
    }
    
    // Check for known malware signatures
    for (const signature of SECURITY_CONFIG.KNOWN_MALWARE_SIGNATURES) {
        if (contentStr.includes(signature)) {
            throw new Error('Known malware signature detected');
        }
    }
    
    return true;
};

const validateFileIntegrity = async (file) => {
    try {
        // Basic file structure validation
        if (file.type === 'application/json') {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        const content = event.target.result;
                        JSON.parse(content); // Validate JSON structure
                        scanForMaliciousContent(content);
                        resolve(true);
                    } catch (error) {
                        reject(new Error(`JSON validation failed: ${error.message}`));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsText(file);
            });
        } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        const data = new Uint8Array(event.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        
                        // Validate workbook structure
                        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                            throw new Error('Invalid Excel file structure');
                        }
                        
                        // Scan each sheet for malicious content
                        for (const sheetName of workbook.SheetNames) {
                            const worksheet = workbook.Sheets[sheetName];
                            const jsonArray = XLSX.utils.sheet_to_json(worksheet);
                            scanForMaliciousContent(jsonArray);
                        }
                        
                        resolve(true);
                    } catch (error) {
                        reject(new Error(`Excel validation failed: ${error.message}`));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsArrayBuffer(file);
            });
        }
        return true;
    } catch (error) {
        throw new Error(`File integrity validation failed: ${error.message}`);
    }
};

const performSecurityScan = async (file, fileValidator, t) => {
    try {
        // Step 1: Basic file validation
        validateFileSize(file);
        validateMimeType(file);
        validateFileExtension(file.name);
        
        // Step 2: Calculate checksum for logging/tracking
        const checksum = await calculateFileChecksum(file);
        console.log(`File checksum (SHA256): ${checksum}`);
        
        // Step 3: Content integrity validation
        await validateFileIntegrity(file);
        
        // Step 4: Additional security checks could be added here
        // - API call to external virus scanning service
        // - Machine learning-based content analysis
        // - Reputation checking based on file hash
        
        return {
            passed: true,
            checksum: checksum,
            message: 'File passed all security checks'
        };
        
    } catch (error) {
        fileValidator(t('WBH_SECURITY_SCAN_FAILED') || `Security scan failed: ${error.message}`);
        throw error;
    }
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
        setProgress(10); // Show initial progress
        
        try {
            const securityResult = await performSecurityScan(file, fileValidator, t);
            console.log('Security scan completed:', securityResult);
            setProgress(25); // Security scan completed
        } catch (securityError) {
            console.error('Security scan failed:', securityError);
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
                    console.log(`Successfully validated ${totalRecords} records from JSON file`);
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
                        console.log(`Successfully validated ${totalRecords} records from Excel file (Sheet: ${sheetName})`);
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
    return { ...SECURITY_CONFIG };
};

// Function to validate file before upload (can be called separately)
export const validateFileBeforeUpload = async (file, fileValidator, t) => {
    try {
        return await performSecurityScan(file, fileValidator, t);
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