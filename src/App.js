import logo from './logo.svg';

import './App.css';

import React, { useState, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import axios from 'axios';

function App() {
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState('');
  const [editOrder, setEditOrder] = useState('');

  useEffect(() => {
    // Fetch patients and orders data from the backend
    axios.get('http://localhost:8899/v1/patient')
      .then((response) => {
        console.log("patient => ", response.data.Data);
        setPatients(response.data.Data);
      })
      .catch((error) => console.error(error));
    axios.get('http://localhost:8899/v1/orders/1')
      .then((response) => {
        console.log("orders => ", response.data.Data);
        setOrders(response.data.Data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setOrderDialogOpen(true);
  };

  const handleAddOrder = () => {
    // Send a POST request to add a new order
    axios.post('http://localhost:8899/v1/orders', { Patient_Id: selectedPatient.Id, Message: newOrder })
      .then((response) => {
        setOrders([...orders, response.data.Data]);
        setNewOrder('');
      })
      .catch((error) => console.error(error));
  };

  const handleEditOrder = () => {
    // Send a PUT request to update an existing order
    axios.put('http://localhost:8899/v1/orders/', { Id: selectedPatient.Id, Message: editOrder })
      .then(() => {
        const updatedOrders = orders.map((order) => {
          if (order.Patient_Id === selectedPatient.Id) {
            order.Message = editOrder;
          }
          return order;
        });
        setOrders(updatedOrders);
        setOrderDialogOpen(false);
        setEditOrder('');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <List>
        {patients.map((patient) => (
          <ListItem
            key={patient.Id}
            button
            onClick={() => handlePatientClick(patient)}
          >
            <ListItemText primary={patient.Name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)}>
        <DialogTitle>
          Orders for {selectedPatient ? selectedPatient.Name : ''}
        </DialogTitle>
        <DialogContent>
          <List>
            {orders.map((order) => {
              console.log('order.Patient_Id => ', order.Patient_Id);
              console.log('selectedPatient => ', selectedPatient);
              return (
                selectedPatient !== null && order.Patient_Id === selectedPatient.Id && (
                  <ListItem key={order.Patient_Id}>
                    <ListItemText primary={order.Message} />
                  </ListItem>
                )
              );
            })}
          </List>
          <TextField
            label="New Order"
            variant="outlined"
            fullWidth
            value={newOrder}
            onChange={(e) => setNewOrder(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOrder}>Add Order</Button>
          {selectedPatient && (
            <>
              <TextField
                label="Edit Order"
                variant="outlined"
                fullWidth
                value={editOrder}
                onChange={(e) => setEditOrder(e.target.value)}
              />
              <Button onClick={handleEditOrder}>Edit Order</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;