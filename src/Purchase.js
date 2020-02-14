import React from 'react';
import { Redirect } from 'react-router-dom';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

import Atable from './Atable';

import { loadUsers, loadProductsByPurchase, loadWishes, loadPurchases, 
          increaseTime, getPurchaseLogs } from './service';

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      products: [],
      wishes: [],
      purchase_id: 0,
      redirect: false,
      redirectPath: '/login',
      loadedData: false,
      isUserPurchase: false,
      minutes: 0,
      showModal: false,
      modalMessage: '',
      showModal2: false,
      modalMessage2: '',
      logs: []
    };
    this.user_id = localStorage.getItem('user_id');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeMinutes = this.handleChangeMinutes.bind(this);
    this.getLogs = this.getLogs.bind(this);
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

  handleClose2 = () => {
    this.setState({ showModal2: false });
  }

  handleShow2 = () => {
    this.setState({ showModal2: true });
  }

  getLogs() {
    getPurchaseLogs(this.purchase_id)
    .then(res => {
      console.log('logs', res.data.logs);
      this.setState({
        showModal2: true,
        logs: res.data.logs
      })
    });
  }

  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    this.purchase_id = id;
    let u = loadUsers();    
    u.then((res) => {
        this.setState({
          users: res.data.users
        });
      });
    u.catch(err => this.setState({
        redirect: true
      }));
    let pr = loadProductsByPurchase(this.purchase_id);
    pr.then((res) => {
        this.setState({
          products: res.data.products,
        });
      });
    let w = loadWishes(this.purchase_id);
    w.then((res) => {
        this.setState({
          wishes: res.data.wishes
        });
      });
    Promise.all([u, pr, w])
    .then(r => this.setState({ loadedData: true }))
    loadPurchases()
    .then((res) => {
        let { purchases } = res.data;
        purchases.forEach(p => {
          if(Number(p.purchase_id) === Number(this.purchase_id) && 
             Number(p.initiator_id) === Number(this.user_id)) {
            this.setState({
              isUserPurchase: true
            })
          }
        });
      })
  }

  handleSubmit(event) {
    event.preventDefault();
    let { minutes } = this.state;
    increaseTime(this.purchase_id, {
      minutes
    })
      .then(() => {
        this.setState({
          showModal: true,
          modalMessage: `${minutes} minutos agregados.`
        })
      })
      .catch((err) => {
        this.setState({
          showModal: true,
          modalMessage: `
            Verificar que el tiempo sea un entero mayor igual a 0.
            ${err}.`
        })
      });
  }

  handleChangeMinutes(event) {
    this.setState({
      minutes: event.target.value
    });
  }

  render() {
    const { users, products, wishes, redirect, redirectPath, loadedData, isUserPurchase, 
      minutes, logs } = this.state;
    let mu = {}, mp = {};
    users.forEach(u => mu[u.user_id] = u);
    products.forEach(p => mp[p.product_id] = p);
    if ( redirect ) { return <Redirect to={redirectPath} />; }
    if ( !loadedData ) return null;
    let data = {
      users,
      products,
      wishes
    };
    return (
      <div>
        <ButtonToolbar>
          {
            isUserPurchase ? (
              <div style={{border:'1px solid black'}}>
                <div>Agregar minutos</div>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" 
                    value={minutes} 
                    onChange={this.handleChangeMinutes} placeholder="Minutos"/>
                  <button type="submit">Agregar</button>
                </form>
              </div>
            ) : null
          }
        <Button variant="outline-info" onClick={this.getLogs} >Logs</Button>
        </ButtonToolbar>
        <Atable data={data} purchase={this.purchase_id} />
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Apedir</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModal2} onHide={this.handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Apedir</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {
                logs.map((l, lidx) =>
                  <li key={lidx}>
                    {mu[l.user_id].email} ha {l.type === 'CREATE' ? 'agregado': 'modificado'} su pedido a {l.quantity} {mp[l.product_id].name} en {l.event_time}.
                  </li>
                )
              }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose2}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}

export default Purchase;
