// Import all components from their respective directories
import * as atoms from "./atoms";
import * as molecules from "./molecules";
import * as organisms from "./organisms";
import * as frameworks from "./frameworks";

/**
 * @author jagankumar-egov
 * @date 2024-08-01
 * @description This file serves as an entry point for exporting components from various directories
 *              within the components folder. It aggregates and re-exports all components
 *              to simplify imports in other parts of the application.
 */

// Export all imported components for use in other parts of the application
export {
    atoms,
    molecules,
    organisms,
    frameworks
};
