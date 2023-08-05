import React, { useState, useEffect } from "react";
import { variables } from "./Variables";
import './Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({
    CustomerFirstName: '',
    CustomerLastName: '',
    Date: '',
    OrderStatus: ''
  });

  useEffect(() => {
    fetch(variables.API_URL)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error(error));
  }, []); 

  const submitOrder = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderForm)
    };

    fetch(variables.API_URL, requestOptions)
      .then(response => response.json())
      .then(data => setOrders(prevOrders => {
        return [...prevOrders, data];
      }))
      .catch(error => console.error(error));

    setOrderForm({
      CustomerFirstName: '',
      CustomerLastName: '',
      Date: '',
      OrderStatus: ''
    });
  }

  const updateStatus = (orderId, newStatus) => {
    let url = `${variables.API_URL}`;
    let body = { "orderID": orderId,"orderStatus": newStatus};

    const requestOptions = {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json-patch+json'
      },
      body: JSON.stringify(body),
    };
  
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => setOrders(prevOrders => {
      return prevOrders.map(order => order.OrderID === orderId ? data : order);
    }))
    .catch(error => console.error(error));
  }

  const deleteOrder = (orderId) => {
    fetch(`${variables.API_URL}${orderId}`, { method: 'DELETE' })
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
        <button type="submit">{"Add"} Order</button>
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
              <td>
                <select
                  value={order.OrderStatus}
                  onChange={e => updateStatus(order.OrderID, e.target.value)}
                >
                  <option value="ORDERED">Ordered</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </td>
              <td>
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