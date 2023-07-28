using backend.Models;
using System.Collections.Generic;

namespace backend.Services
{
    public interface IOrderService
    {
        IEnumerable<Order> GetOrders();
        void AddOrder(Order order);
        void UpdateOrder(Order order);
        void DeleteOrder(int id);
    }
}