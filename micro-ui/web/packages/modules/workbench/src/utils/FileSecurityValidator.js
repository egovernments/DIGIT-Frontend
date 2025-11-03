/**
 * FileSecurityValidator - Reusable file security validation utility
 * 
 * Provides comprehensive security checks for file uploads including:
 * - File size validation
 * - MIME type validation  
 * - File extension security
 * - Checksum calculation
 * - Malicious content detection
 * - File integrity validation
 * 
 * @author DIGIT Team
 * @version 1.0.0
 */

import XLSX from 'xlsx';

// Default security configuration
const DEFAULT_SECURITY_CONFIG = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_MIME_TYPES: [
        'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'text/plain',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif'
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
        /expression\s*\(/i,
        /document\.cookie/i,
        /window\.location/i,
        /alert\s*\(/i
    ],
    SUSPICIOUS_EXTENSIONS: [
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', 
        '.jar', '.app', '.deb', '.pkg', '.dmg', '.run', '.msi', '.rpm'
    ],
    KNOWN_MALWARE_SIGNATURES: [
        'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', // EICAR test string
        'EICAR-STANDARD-ANTIVIRUS-TEST-FILE',
        '68656c6c6f20776f726c64', // Common test pattern
    ],
    ENABLE_CONTENT_SCAN: true,
    ENABLE_CHECKSUM: true,
    ENABLE_STRUCTURE_VALIDATION: true
};

/**
 * File Security Validator Class
 */
class FileSecurityValidator {
    constructor(customConfig = {}) {
        this.config = { ...DEFAULT_SECURITY_CONFIG, ...customConfig };
        this.scanResults = {
            passed: false,
            checksum: null,
            scannedAt: null,
            errors: [],
            warnings: []
        };
    }

    /**
     * Validate file size
     * @param {File} file - File object to validate
     * @throws {Error} If file size exceeds limit
     */
    validateFileSize(file) {
        if (file.size > this.config.MAX_FILE_SIZE) {
            throw new Error(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum limit of ${(this.config.MAX_FILE_SIZE / (1024 * 1024))}MB`);
        }
        return true;
    }

    /**
     * Validate MIME type
     * @param {File} file - File object to validate
     * @throws {Error} If MIME type is not allowed
     */
    validateMimeType(file) {
        if (!this.config.ALLOWED_MIME_TYPES.includes(file.type)) {
            throw new Error(`File type '${file.type}' is not allowed. Allowed types: ${this.config.ALLOWED_MIME_TYPES.join(', ')}`);
        }
        return true;
    }

    /**
     * Validate file extension
     * @param {string} fileName - Name of the file
     * @throws {Error} If extension is suspicious
     */
    validateFileExtension(fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        if (this.config.SUSPICIOUS_EXTENSIONS.includes(extension)) {
            throw new Error(`File extension '${extension}' is not allowed for security reasons`);
        }
        return true;
    }

    /**
     * Calculate file checksum using Web Crypto API
     * @param {File} file - File object
     * @returns {Promise<string>} SHA-256 hash of the file
     */
    async calculateFileChecksum(file) {
        if (!this.config.ENABLE_CHECKSUM) {
            return null;
        }

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
    }

    /**
     * Scan content for malicious patterns
     * @param {string|object} content - Content to scan
     * @throws {Error} If malicious content is detected
     */
    scanForMaliciousContent(content) {
        if (!this.config.ENABLE_CONTENT_SCAN) {
            return true;
        }

        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        
        // Check for malicious patterns
        for (const pattern of this.config.MALICIOUS_PATTERNS) {
            if (pattern.test(contentStr)) {
                throw new Error('Malicious content pattern detected in file');
            }
        }
        
        // Check for known malware signatures
        for (const signature of this.config.KNOWN_MALWARE_SIGNATURES) {
            if (contentStr.includes(signature)) {
                throw new Error('Known malware signature detected');
            }
        }
        
        return true;
    }

    /**
     * Validate file structure and integrity
     * @param {File} file - File object to validate
     * @returns {Promise<boolean>} True if file structure is valid
     */
    async validateFileIntegrity(file) {
        if (!this.config.ENABLE_STRUCTURE_VALIDATION) {
            return true;
        }

        try {
            // JSON file validation
            if (file.type === 'application/json') {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onload = (event) => {
                        try {
                            const content = event.target.result;
                            JSON.parse(content); // Validate JSON structure
                            this.scanForMaliciousContent(content);
                            resolve(true);
                        } catch (error) {
                            reject(new Error(`JSON validation failed: ${error.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error('Failed to read JSON file'));
                    reader.readAsText(file);
                });
            } 
            
            // Excel file validation
            else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
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
                                this.scanForMaliciousContent(jsonArray);
                            }
                            
                            resolve(true);
                        } catch (error) {
                            reject(new Error(`Excel validation failed: ${error.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error('Failed to read Excel file'));
                    reader.readAsArrayBuffer(file);
                });
            }
            
            // CSV file validation
            else if (file.type === 'text/csv') {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onload = (event) => {
                        try {
                            const content = event.target.result;
                            // Basic CSV structure validation
                            if (content.trim().length === 0) {
                                throw new Error('CSV file is empty');
                            }
                            this.scanForMaliciousContent(content);
                            resolve(true);
                        } catch (error) {
                            reject(new Error(`CSV validation failed: ${error.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error('Failed to read CSV file'));
                    reader.readAsText(file);
                });
            }
            
            return true;
        } catch (error) {
            throw new Error(`File integrity validation failed: ${error.message}`);
        }
    }

    /**
     * Perform comprehensive security scan on file
     * @param {File} file - File object to scan
     * @param {Function} onProgress - Optional progress callback
     * @returns {Promise<Object>} Scan results
     */
    async performSecurityScan(file, onProgress = null) {
        try {
            this.scanResults = {
                passed: false,
                checksum: null,
                scannedAt: new Date().toISOString(),
                errors: [],
                warnings: [],
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                }
            };

            if (onProgress) onProgress(10, 'Starting security scan...');

            // Step 1: Basic file validation
            this.validateFileSize(file);
            this.validateMimeType(file);
            this.validateFileExtension(file.name);
            
            if (onProgress) onProgress(30, 'Basic validation completed');

            // Step 2: Calculate checksum
            if (this.config.ENABLE_CHECKSUM) {
                this.scanResults.checksum = await this.calculateFileChecksum(file);
                if (onProgress) onProgress(50, 'Checksum calculated');
            }

            // Step 3: Content integrity validation
            if (this.config.ENABLE_STRUCTURE_VALIDATION) {
                await this.validateFileIntegrity(file);
                if (onProgress) onProgress(80, 'Content validation completed');
            }

            if (onProgress) onProgress(100, 'Security scan completed');

            this.scanResults.passed = true;
            this.scanResults.message = 'File passed all security checks';
            
            return this.scanResults;
            
        } catch (error) {
            this.scanResults.errors.push(error.message);
            this.scanResults.passed = false;
            this.scanResults.message = `Security scan failed: ${error.message}`;
            
            if (onProgress) onProgress(0, `Scan failed: ${error.message}`);
            
            throw error;
        }
    }

    /**
     * Get current configuration
     * @returns {Object} Current security configuration
     */
    getConfiguration() {
        return { ...this.config };
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration to merge
     */
    updateConfiguration(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get last scan results
     * @returns {Object} Last scan results
     */
    getLastScanResults() {
        return { ...this.scanResults };
    }
}

/**
 * Static factory method to create validator with predefined configurations
 */
FileSecurityValidator.createValidator = (type = 'default', customConfig = {}) => {
    const presets = {
        'strict': {
            MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
            ALLOWED_MIME_TYPES: ['application/json', 'text/csv'],
            ENABLE_CONTENT_SCAN: true,
            ENABLE_CHECKSUM: true,
            ENABLE_STRUCTURE_VALIDATION: true
        },
        'lenient': {
            MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
            ENABLE_CONTENT_SCAN: false,
            ENABLE_CHECKSUM: false,
            ENABLE_STRUCTURE_VALIDATION: false
        },
        'documents': {
            ALLOWED_MIME_TYPES: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ]
        },
        'images': {
            ALLOWED_MIME_TYPES: [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp'
            ],
            MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
        },
        'data': {
            ALLOWED_MIME_TYPES: [
                'application/json',
                'text/csv',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ]
        }
    };

    const config = { ...DEFAULT_SECURITY_CONFIG, ...presets[type], ...customConfig };
    return new FileSecurityValidator(config);
};

// Export the class and utility functions
export default FileSecurityValidator;

// Convenience functions for quick validation
export const validateFile = async (file, config = {}, onProgress = null) => {
    const validator = new FileSecurityValidator(config);
    return await validator.performSecurityScan(file, onProgress);
};

export const createStrictValidator = (customConfig = {}) => {
    return FileSecurityValidator.createValidator('strict', customConfig);
};

export const createLenientValidator = (customConfig = {}) => {
    return FileSecurityValidator.createValidator('lenient', customConfig);
};

export const createDataValidator = (customConfig = {}) => {
    return FileSecurityValidator.createValidator('data', customConfig);
};

export const createImageValidator = (customConfig = {}) => {
    return FileSecurityValidator.createValidator('images', customConfig);
};

export const createDocumentValidator = (customConfig = {}) => {
    return FileSecurityValidator.createValidator('documents', customConfig);
};