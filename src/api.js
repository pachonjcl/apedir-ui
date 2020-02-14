import openSocket from 'socket.io-client';
import { SERVER_URL } from './settings';

const  socket = openSocket(SERVER_URL);

function subscribeToNewData(purchase_id, cb) {
  socket.on('data', data => {
    cb(data);
  });
  socket.emit('subscribeToData', purchase_id);
}

export { subscribeToNewData };
