// Import utility functions from individual files
import DateUtils from "./DateUtils";

/**
 * Re-exports common utility functions for easier access.
 * 
 * This file centralizes the export of commonly used utility functions, making it easier
 * to import them in other parts of the application. 
 * 
 * @module Utilities
 */

/**
 * DateUtils - A collection of utility functions for date operations.
 * 
 * This module provides various utilities for working with dates, including
 * formatting and manipulation functions.
 * 
 * @example
 * import { DateUtils } from 'path/to/utils';
 * 
 * // Example usage of a date formatting function
 * const formattedDate = DateUtils.formatDate(new Date(), 'MM/DD/YYYY');
 * 
 * @see {@link ./DateUtils.js} for details on available functions and usage.
 */
export { DateUtils };
