using System;
using System.Collections.Generic;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IConfiguration _configuration;

        public OrderService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IEnumerable<Order> GetOrders()
        {
            var orders = new List<Order>();
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("SELECT * FROM [Order]", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            orders.Add(new Order
                            {
                                OrderID = (int)reader["OrderID"],
                                CustomerFirstName = reader["CustomerFirstName"].ToString(),
                                CustomerLastName = reader["CustomerLastName"].ToString(),
                                Date = (DateTime)reader["Date"],
                                OrderStatus = reader["OrderStatus"].ToString()
                            });
                        }
                    }
                }
            }
            return orders;
        }

        public void AddOrder(Order order)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("INSERT INTO [Order] (CustomerFirstName, CustomerLastName, Date, OrderStatus) VALUES (@firstName, @lastName, @date, @status)", connection))
                {
                    command.Parameters.AddWithValue("@firstName", order.CustomerFirstName);
                    command.Parameters.AddWithValue("@lastName", order.CustomerLastName);
                    command.Parameters.AddWithValue("@date", order.Date);
                    command.Parameters.AddWithValue("@status", order.OrderStatus);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void UpdateOrder(Order order)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("UPDATE [Order] SET CustomerFirstName = @firstName, CustomerLastName = @lastName, Date = @date, OrderStatus = @status WHERE OrderID = @id", connection))
                {
                    command.Parameters.AddWithValue("@firstName", order.CustomerFirstName);
                    command.Parameters.AddWithValue("@lastName", order.CustomerLastName);
                    command.Parameters.AddWithValue("@date", order.Date);
                    command.Parameters.AddWithValue("@status", order.OrderStatus);
                    command.Parameters.AddWithValue("@id", order.OrderID);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void DeleteOrder(int id)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("DELETE FROM [Order] WHERE OrderID = @id", connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}
