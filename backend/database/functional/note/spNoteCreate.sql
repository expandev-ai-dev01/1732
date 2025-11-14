/**
 * @summary
 * Creates a new note with title and content for the authenticated user
 *
 * @procedure spNoteCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier (note creator)
 *
 * @param {NVARCHAR(255)} title
 *   - Required: Yes
 *   - Description: Note title (max 255 characters)
 *
 * @param {NVARCHAR(MAX)} content
 *   - Required: Yes
 *   - Description: Note content (supports text formatting)
 *
 * @returns {INT} idNote - Created note identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Validation failure for empty title
 * - Validation failure for title exceeding 255 characters
 * - Validation failure for empty content
 * - Validation failure for invalid user
 * - Transaction rollback on database error
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(255),
  @content NVARCHAR(MAX)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleExceedsMaximumLength}
   */
  IF (LEN(@title) > 255)
  BEGIN
    ;THROW 51000, 'titleExceedsMaximumLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {contentRequired}
   */
  IF (@content IS NULL OR LTRIM(RTRIM(@content)) = '')
  BEGIN
    ;THROW 51000, 'contentRequired', 1;
  END;

  /**
   * @validation User existence validation
   * @throw {userDoesNotExist}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [security].[user] usr
    WHERE usr.[idUser] = @idUser
      AND usr.[idAccount] = @idAccount
      AND usr.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'userDoesNotExist', 1;
  END;

  DECLARE @idNote INTEGER;
  DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

  BEGIN TRY
    /**
     * @rule {db-transaction-control} Transaction management for data integrity
     */
    BEGIN TRAN;

      /**
       * @rule {fn-note-creation} Insert new note with system-generated fields
       */
      INSERT INTO [functional].[note] (
        [idAccount],
        [idUser],
        [title],
        [content],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @content,
        @currentDateTime,
        @currentDateTime,
        0
      );

      SET @idNote = SCOPE_IDENTITY();

      /**
       * @output {NoteCreated, 1, 1}
       * @column {INT} idNote
       * - Description: Created note identifier
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO