using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using TheFirstStep.Models;

namespace TheFirstStep.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public OrderController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IEnumerable<Order> Get()
        {
            var orders = new List<Order>();
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT * FROM dbo.[Order]", connection);

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var order = new Order
                        {
                            OrderID = (int)reader["OrderID"],
                            CustomerFirstName = (string)reader["CustomerFirstName"],
                            CustomerLastName = (string)reader["CustomerLastName"],
                            Date = (DateTime)reader["Date"],
                            OrderStatus = (string)reader["OrderStatus"],
                        };

                        orders.Add(order);
                    }
                }
            }

            return orders;
        }

        [HttpPost]
        public void Post([FromBody] Order order)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("INSERT INTO dbo.[Order] (CustomerFirstName, CustomerLastName, Date, OrderStatus) VALUES (@firstName, @lastName, @date, @status)", connection))
                {
                    command.Parameters.AddWithValue("@firstName", order.CustomerFirstName);
                    command.Parameters.AddWithValue("@lastName", order.CustomerLastName);
                    command.Parameters.AddWithValue("@date", order.Date);
                    command.Parameters.AddWithValue("@status", order.OrderStatus);
                    command.ExecuteNonQuery();
                }
            }
        }

        [HttpPut]
        public void Put([FromBody] Order order)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("UPDATE dbo.[Order] SET CustomerFirstName = @firstName, CustomerLastName = @lastName, Date = @date, OrderStatus = @status WHERE OrderID = @id", connection))
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

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var connectionString = _configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand("DELETE FROM dbo.[Order] WHERE OrderID = @id", connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}
