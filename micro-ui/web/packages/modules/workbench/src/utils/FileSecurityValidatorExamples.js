/**
 * FileSecurityValidator Usage Examples
 * 
 * This file demonstrates various ways to use the FileSecurityValidator
 * for different file upload scenarios in DIGIT applications.
 */

import FileSecurityValidator, {
    validateFile,
    createStrictValidator,
    createLenientValidator,
    createDataValidator,
    createImageValidator,
    createDocumentValidator
} from './FileSecurityValidator';

/**
 * Example 1: Basic file validation with default settings
 */
export const basicFileValidation = async (file) => {
    try {
        const result = await validateFile(file);
        console.log('Validation passed:', result);
        return result;
    } catch (error) {
        console.error('Validation failed:', error.message);
        throw error;
    }
};

/**
 * Example 2: Strict validation for sensitive data uploads
 */
export const strictDataValidation = async (file, onProgress) => {
    const validator = createStrictValidator({
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB limit for sensitive data
        ALLOWED_MIME_TYPES: ['application/json', 'text/csv']
    });

    try {
        const result = await validator.performSecurityScan(file, onProgress);
        console.log('Strict validation passed:', result);
        return result;
    } catch (error) {
        console.error('Strict validation failed:', error.message);
        throw error;
    }
};

/**
 * Example 3: Image upload validation
 */
export const validateImageUpload = async (file) => {
    const validator = createImageValidator({
        MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB for images
        ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif']
    });

    try {
        const result = await validator.performSecurityScan(file);
        console.log('Image validation passed:', result);
        return result;
    } catch (error) {
        console.error('Image validation failed:', error.message);
        throw error;
    }
};

/**
 * Example 4: Document upload validation
 */
export const validateDocumentUpload = async (file, onProgress) => {
    const validator = createDocumentValidator();

    try {
        const result = await validator.performSecurityScan(file, onProgress);
        console.log('Document validation passed:', result);
        return result;
    } catch (error) {
        console.error('Document validation failed:', error.message);
        throw error;
    }
};

/**
 * Example 5: Custom validator for specific use case
 */
export const createCustomValidator = () => {
    return new FileSecurityValidator({
        MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
        ALLOWED_MIME_TYPES: [
            'application/json',
            'application/xml',
            'text/csv',
            'application/pdf'
        ],
        ENABLE_CONTENT_SCAN: true,
        ENABLE_CHECKSUM: true,
        ENABLE_STRUCTURE_VALIDATION: true,
        // Custom malicious patterns for specific domain
        MALICIOUS_PATTERNS: [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /eval\s*\(/i,
            /SELECT.*FROM/i, // SQL injection patterns
            /DROP\s+TABLE/i,
            /INSERT\s+INTO/i
        ]
    });
};

/**
 * Example 6: Batch file validation
 */
export const validateMultipleFiles = async (files, validationType = 'default') => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
            let result;
            
            switch (validationType) {
                case 'strict':
                    result = await strictDataValidation(file);
                    break;
                case 'image':
                    result = await validateImageUpload(file);
                    break;
                case 'document':
                    result = await validateDocumentUpload(file);
                    break;
                default:
                    result = await basicFileValidation(file);
            }
            
            results.push({
                file: file.name,
                status: 'passed',
                result: result
            });
            
        } catch (error) {
            results.push({
                file: file.name,
                status: 'failed',
                error: error.message
            });
        }
    }
    
    return results;
};

/**
 * Example 7: React component usage
 */
export const FileUploadWithValidation = ({ onFileValidated, onValidationError, validationType = 'default' }) => {
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            let result;
            
            switch (validationType) {
                case 'strict':
                    result = await strictDataValidation(file, (progress, message) => {
                        console.log(`Validation progress: ${progress}% - ${message}`);
                    });
                    break;
                case 'image':
                    result = await validateImageUpload(file);
                    break;
                case 'document':
                    result = await validateDocumentUpload(file);
                    break;
                default:
                    result = await basicFileValidation(file);
            }

            onFileValidated(file, result);
            
        } catch (error) {
            onValidationError(error.message);
        }
    };

    return (
        <input 
            type="file" 
            onChange={handleFileSelect}
            accept={getAcceptPattern(validationType)}
        />
    );
};

/**
 * Helper function to get accept pattern for file input
 */
const getAcceptPattern = (validationType) => {
    switch (validationType) {
        case 'image':
            return 'image/jpeg,image/png,image/gif';
        case 'document':
            return '.pdf,.doc,.docx,.txt';
        case 'data':
        case 'strict':
            return '.json,.csv,.xlsx,.xls';
        default:
            return '';
    }
};

/**
 * Example 8: Pre-upload validation hook for React
 */
export const useFileValidation = (validationType = 'default') => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [validationError, setValidationError] = useState(null);

    const validateFile = async (file) => {
        setIsValidating(true);
        setValidationError(null);
        setValidationResult(null);

        try {
            let result;
            
            switch (validationType) {
                case 'strict':
                    result = await strictDataValidation(file);
                    break;
                case 'image':
                    result = await validateImageUpload(file);
                    break;
                case 'document':
                    result = await validateDocumentUpload(file);
                    break;
                default:
                    result = await basicFileValidation(file);
            }

            setValidationResult(result);
            return result;
            
        } catch (error) {
            setValidationError(error.message);
            throw error;
        } finally {
            setIsValidating(false);
        }
    };

    return {
        validateFile,
        isValidating,
        validationResult,
        validationError,
        clearValidation: () => {
            setValidationResult(null);
            setValidationError(null);
        }
    };
};

/**
 * Example 9: Integration with existing upload components
 */
export const enhanceUploadComponentWithSecurity = (OriginalUploadComponent) => {
    return function SecureUploadComponent(props) {
        const { onFileSelect, validationType = 'default', ...otherProps } = props;

        const handleSecureFileSelect = async (file) => {
            try {
                // Perform security validation before passing to original handler
                let result;
                
                switch (validationType) {
                    case 'strict':
                        result = await strictDataValidation(file);
                        break;
                    case 'image':
                        result = await validateImageUpload(file);
                        break;
                    case 'document':
                        result = await validateDocumentUpload(file);
                        break;
                    default:
                        result = await basicFileValidation(file);
                }

                // Call original handler with validated file and security result
                onFileSelect(file, result);
                
            } catch (error) {
                console.error('Security validation failed:', error);
                // Optionally call error handler if provided
                if (props.onValidationError) {
                    props.onValidationError(error.message);
                }
            }
        };

        return (
            <OriginalUploadComponent
                {...otherProps}
                onFileSelect={handleSecureFileSelect}
            />
        );
    };
};

/**
 * Example 10: Configuration management
 */
export class FileValidationConfigManager {
    constructor() {
        this.configs = new Map();
        this.setupDefaultConfigs();
    }

    setupDefaultConfigs() {
        this.configs.set('default', {});
        this.configs.set('strict', {
            MAX_FILE_SIZE: 10 * 1024 * 1024,
            ALLOWED_MIME_TYPES: ['application/json', 'text/csv'],
            ENABLE_CONTENT_SCAN: true
        });
        this.configs.set('lenient', {
            MAX_FILE_SIZE: 100 * 1024 * 1024,
            ENABLE_CONTENT_SCAN: false
        });
    }

    getValidator(configName = 'default') {
        const config = this.configs.get(configName) || {};
        return new FileSecurityValidator(config);
    }

    addConfig(name, config) {
        this.configs.set(name, config);
    }

    updateConfig(name, updates) {
        const existing = this.configs.get(name) || {};
        this.configs.set(name, { ...existing, ...updates });
    }
}

// Singleton instance for global configuration management
export const globalConfigManager = new FileValidationConfigManager();