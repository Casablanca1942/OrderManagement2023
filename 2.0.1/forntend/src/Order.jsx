import React, { useState, useEffect } from "react";
import { variables } from "./Variables";
import './Order.css';

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
    fetch(variables.API_URL)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error(error));
  }, []); 

  const submitOrder = () => {
    let url = variables.API_URL;
    let method = 'POST';
    let body = {
      "customerFirstName": orderForm.CustomerFirstName,
      "customerLastName": orderForm.CustomerLastName,
      "date": orderForm.Date,
      "orderStatus": orderForm.OrderStatus,
    };

    if (editOrder) {

      method = 'PUT';
      body = { ...body, "orderID": editOrder.OrderID };
    }
  
    const requestOptions = {
      method: method,
      headers: { 
        'Content-Type': 'application/json-patch+json',
        'Ocp-Apim-Subscription-Key': '6f0df5c22f2443c4835d4d832d6e7336'
      },
      body: JSON.stringify(body),
    };
  
    fetch(url, requestOptions)
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
              <td>{order.Date.split('T')[0]}</td>
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