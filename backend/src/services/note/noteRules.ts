/**
 * @summary
 * Business logic for note operations
 *
 * @module services/note/noteRules
 *
 * @description
 * Contains business rules and database operations for note management
 */

import sql from 'mssql';
import { config } from '@/config';
import { NoteCreateRequest, NoteCreateResponse } from './noteTypes';

/**
 * @summary
 * Creates a new note in the database
 *
 * @function noteCreate
 *
 * @param {NoteCreateRequest} params - Note creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Note title
 * @param {string} params.content - Note content
 *
 * @returns {Promise<NoteCreateResponse>} Created note identifier
 *
 * @throws {Error} When title is empty or exceeds 255 characters
 * @throws {Error} When content is empty
 * @throws {Error} When user does not exist
 * @throws {Error} When database operation fails
 */
export async function noteCreate(params: NoteCreateRequest): Promise<NoteCreateResponse> {
  const pool = await sql.connect(config.database);

  try {
    const result = await pool
      .request()
      .input('idAccount', sql.Int, params.idAccount)
      .input('idUser', sql.Int, params.idUser)
      .input('title', sql.NVarChar(255), params.title)
      .input('content', sql.NVarChar(sql.MAX), params.content)
      .execute('[functional].[spNoteCreate]');

    return result.recordset[0];
  } finally {
    await pool.close();
  }
}
