import { roundToNearestMinutes } from "date-fns/esm";
import Urls from "../urls";
import { Request } from "@egovernments/digit-ui-libraries";

/**
 * HrmsService provides API request functions to manage HRMS (Human Resource Management System) operations.
 * This service includes functionalities for searching, creating, updating, and counting employees.
 * It interacts with the HRMS service using Digit's request utilities.
 *
 * Available methods:
 * - `search(tenantId, filters, searchParams)`: Searches for employees based on provided filters.
 * - `create(data, tenantId)`: Creates a new employee record.
 * - `update(data, tenantId)`: Updates an existing employee record.
 * - `count(tenantId)`: Retrieves the total count of employees.
 */


const HrmsService = {
  search: (tenantId, filters, searchParams) =>
    Request({
      url: Urls.hrms.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters, ...searchParams },
    }),
  create: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.hrms.create,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
    }),
  update: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.hrms.update,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
    }),
  count: (tenantId) =>
    Request({
      url: Urls.hrms.count,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
    }),
};

export default HrmsService;
