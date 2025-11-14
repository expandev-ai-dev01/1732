/**
 * @schema functional
 * Business entity schema for NoteBox application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table note Quick notes created by users
 * @multitenancy true
 * @softDelete true
 * @alias nt
 */
CREATE TABLE [functional].[note] (
  [idNote] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(255) NOT NULL,
  [content] NVARCHAR(MAX) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkNote
 * @keyType Object
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [pkNote] PRIMARY KEY CLUSTERED ([idNote]);
GO

/**
 * @foreignKey fkNote_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [fkNote_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkNote_User Note creator reference
 * @target security.user
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [fkNote_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @index ixNote_Account Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixNote_Account]
ON [functional].[note]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixNote_Account_User User notes lookup
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_User]
ON [functional].[note]([idAccount], [idUser])
INCLUDE ([title], [dateCreated])
WHERE [deleted] = 0;
GO

/**
 * @index ixNote_Account_DateCreated Recent notes sorting
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_DateCreated]
ON [functional].[note]([idAccount], [dateCreated] DESC)
INCLUDE ([idUser], [title])
WHERE [deleted] = 0;
GO