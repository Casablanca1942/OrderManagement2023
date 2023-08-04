using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public IEnumerable<Order> Get()
        {
            return _orderService.GetOrders();
        }

        [HttpPost]
        public void Post([FromBody] Order order)
        {
            _orderService.AddOrder(order);
        }

        [HttpPut]
        public void Put([FromBody] Order order)
        {
            _orderService.UpdateOrder(order);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _orderService.DeleteOrder(id);
        }
    }
}
