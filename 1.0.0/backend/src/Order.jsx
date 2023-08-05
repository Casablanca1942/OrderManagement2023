import React, { useState, useEffect } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    CustomerFirstName: '',
    CustomerLastName: '',
    Date: '',
    OrderStatus: ''
  });

  useEffect(() => {
    fetch('http://localhost:5225/api/Order')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error(error));
  }, []);

  const submitOrder = () => {
    const requestOptions = {
      method: editOrder ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderForm)
    };

    fetch('http://localhost:5225/api/Order', requestOptions)
      .then(response => response.json())
      .then(data => setOrders(prevOrders => {
        if(editOrder) {
          return prevOrders.map(order => order.OrderID === editOrder.OrderID ? data : order);
        } else {
          return [...prevOrders, data];
        }
      }))
      .catch(error => console.error(error));

    setEditOrder(null);

    setOrderForm({
      CustomerFirstName: '',
      CustomerLastName: '',
      Date: '',
      OrderStatus: ''
    });
  }

  useEffect(() => {
    if(editOrder) {
      setOrderForm(editOrder);
    } else {
      setOrderForm({
        CustomerFirstName: '',
        CustomerLastName: '',
        Date: '',
        OrderStatus: ''
      });
    }
  }, [editOrder]);

  const deleteOrder = (orderId) => {
    fetch(`http://localhost:5225/api/Order/${orderId}`, { method: 'DELETE' })
      .then(() => setOrders(prevOrders => prevOrders.filter(order => order.OrderID !== orderId)))
      .catch(error => console.error(error));
  }

  return (
    <div>
      <form onSubmit={submitOrder}>
        <input 
          placeholder="Customer First Name"
          value={orderForm.CustomerFirstName}
          onChange={e => setOrderForm(prevForm => ({ ...prevForm, CustomerFirstName: e.target.value }))}
        />
        <input 
          placeholder="Customer Last Name"
          value={orderForm.CustomerLastName}
          onChange={e => setOrderForm(prevForm => ({ ...prevForm, CustomerLastName: e.target.value }))}
        />
        <input 
          type="date"
          value={orderForm.Date}
          onChange={e => setOrderForm(prevForm => ({ ...prevForm, Date: e.target.value }))}
        />
        <select
          value={orderForm.OrderStatus}
          onChange={e => setOrderForm(prevForm => ({ ...prevForm, OrderStatus: e.target.value }))}
        >
          <option value="">Select Status</option>
          <option value="ORDERED">Ordered</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
        <button type="submit">{editOrder ? "Update" : "Add"} Order</button>
        {editOrder && <button onClick={() => setEditOrder(null)}>Cancel Edit</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.OrderID}>
              <td>{order.OrderID}</td>
              <td>{order.CustomerFirstName}</td>
              <td>{order.CustomerLastName}</td>
              <td>{order.Date}</td>
              <td>{order.OrderStatus}</td>
              <td>
                <button onClick={() => setEditOrder(order)}>Edit</button>
                <button onClick={() => deleteOrder(order.OrderID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Order;