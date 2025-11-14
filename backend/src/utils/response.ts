/**
 * @summary
 * Standardized API response utilities
 *
 * @module utils/response
 *
 * @description
 * Provides consistent response formatting for all API endpoints
 */

/**
 * @interface SuccessResponse
 * @description Standard success response format
 *
 * @property {boolean} success - Always true for successful responses
 * @property {T} data - Response data payload
 * @property {object} metadata - Optional metadata object
 * @property {string} metadata.timestamp - ISO timestamp of response
 */
interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}

/**
 * @summary
 * Creates a standardized success response
 *
 * @function successResponse
 *
 * @param {T} data - Response data
 * @param {object} metadata - Optional metadata (pagination, etc.)
 *
 * @returns {SuccessResponse<T>} Formatted success response
 */
export function successResponse<T>(
  data: T,
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
  }
): SuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @interface ListResponse
 * @description Standard list/pagination response format
 *
 * @property {boolean} success - Always true for successful responses
 * @property {T[]} data - Array of response items
 * @property {object} metadata - Pagination metadata
 */
interface ListResponse<T> {
  success: true;
  data: T[];
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    timestamp: string;
  };
}

/**
 * @summary
 * Creates a standardized list response with pagination
 *
 * @function listResponse
 *
 * @param {T[]} data - Array of items
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} total - Total number of items
 *
 * @returns {ListResponse<T>} Formatted list response
 */
export function listResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): ListResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      page,
      pageSize,
      total,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1,
      timestamp: new Date().toISOString(),
    },
  };
}
