IF NOT EXISTS 
    (SELECT name 
     FROM sys.database_principals 
     WHERE name = 'CommonUser')
BEGIN
    CREATE USER CommonUser FOR LOGIN MSA_project_users;
END

GRANT CONTROL TO CommonUser;
