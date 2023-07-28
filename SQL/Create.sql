CREATE TABLE [dbo].[Order] (
[OrderID] INT IDENTITY(1,1) PRIMARY KEY,
[CustomerFirstName] VARCHAR(50),
[CustomerLastName] VARCHAR(50),
[Date] DATE,
[OrderStatus] VARCHAR(20)
);