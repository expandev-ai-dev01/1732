/**
 * @summary
 * Note API controller for CRUD operations
 *
 * @module api/v1/internal/note/controller
 *
 * @description
 * Handles HTTP requests for note management operations
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { noteCreate } from '@/services/note';
import { successResponse } from '@/utils/response';
import { errorResponse } from '@/middleware/error';

/**
 * @api {post} /api/v1/internal/note Create Note
 * @apiName CreateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new note with title and content
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {String} title Note title (max 255 characters)
 * @apiParam {String} content Note content
 *
 * @apiSuccess {Number} idNote Created note identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleExceedsMaximumLength Title exceeds 255 characters
 * @apiError {String} contentRequired Content is required
 * @apiError {String} userDoesNotExist User does not exist
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

const createBodySchema = z.object({
  idAccount: z.number().int().positive(),
  idUser: z.number().int().positive(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Request body validation
     * @throw {ValidationError}
     */
    const validationResult = createBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      res
        .status(400)
        .json(
          errorResponse('Validation failed', 'VALIDATION_ERROR', validationResult.error.errors)
        );
      return;
    }

    const data = validationResult.data;

    /**
     * @rule {fn-note-creation} Create note with validated parameters
     */
    const result = await noteCreate({
      idAccount: data.idAccount,
      idUser: data.idUser,
      title: data.title,
      content: data.content,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    /**
     * @rule {db-error-handling} Handle database-specific errors
     */
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_RULE_ERROR'));
    } else {
      next(error);
    }
  }
}
