import React from 'react';
import './App.css';
import CreatePurchase from './CreatePurchase';
import { loadPurchases, loadUsers, loadProducts, loadPurchaseTypes, subscribeToNotifications, createPurchase } from './service';
import { Redirect } from 'react-router-dom';

import PurchaseCard from './PurchaseCard';
import { ListGroup } from 'react-bootstrap';
import { IMAGES_URL } from './settings';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchases: [],
      users: [],
      products: [],
      wishes: [],
      purchase_types: [],
      purchase_id: 0,
      redirect: false,
      redirectPath: '/login',
      openDialog: false
    };
    this.loadPurchasesList = this.loadPurchasesList.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);
    this.handleHideDialog = this.handleHideDialog.bind(this);
  }

  handleShowDialog(){
    this.setState({openDialog:true});
  }

  handleHideDialog(){
    this.setState({openDialog:false});
    this.loadPurchasesList();
  }

  componentDidMount() {
    let notificationToken = localStorage.getItem('notification-token');
    if(notificationToken) {
      subscribeToNotifications({
        notificationToken
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }
    this.loadPurchasesList()
    loadUsers()
      .then((res) => {
        this.mu = {};
        res.data.users.forEach(u => {
          this.mu[u.user_id] = u.email;
        });
        this.setState({
          users: res.data.users
        });
      });
    loadProducts()
      .then((res) => {
        this.setState({
          products: res.data.products,
        });
      });
    loadPurchaseTypes()
      .then((res) => {
        this.setState({
          purchase_types: res.data.purchase_types
        })
      })
  }

  loadPurchasesList() {
    loadPurchases()
      .then((res) => {
        this.setState({
          purchases: res.data.purchases
        });
      })
      .catch(err => this.setState({
        redirect: true
      }));
  }

  render() {
    const { purchases, redirect, redirectPath, purchase_types } = this.state;
    if ( redirect ) { return <Redirect to={redirectPath} />; }
    const listPurchases = purchases
    .filter(p => {
      let now = new Date().getTime();
      let end = new Date(p.end_time).getTime();
      return (end - now) > 0;
    })
    .map(p => {
      let purchase_type;
      purchase_types.forEach(pt => {
        if(pt.purchase_type_id === p.purchase_type_id) {
          purchase_type = pt;
        }
      });
      let initiatorText = this.mu ? ( 'Iniciado por ' + this.mu[p.initiator_id] ) : null;
      let now = new Date().getTime();
      let end = new Date(p.end_time).getTime();
      let secs = parseInt((end - now) / 1000);
      let mins = parseInt( secs / 60 );
      let hrs = parseInt( mins / 60 );
      secs = secs % 60;
      mins = mins % 60;
      let endText = `${hrs}:${mins >= 10 ? mins : '0' + mins}:${secs >= 10 ? secs : '0' + secs}`
      let imageUrl= `${IMAGES_URL}/pt_${p.purchase_type_id}.jpg`;
      return (
        <PurchaseCard
          key={ p.purchase_id }
          imageSrc={ imageUrl }
          name={ purchase_type ? purchase_type.name : '' }
          description={ purchase_type ? purchase_type.description : '' }
          minPrice={ purchase_type ? purchase_type.minPrice : '' }
          maxPrice={ purchase_type ? purchase_type.maxPrice : '' }
          remainingTime={ endText }
          purchase_id={ p.purchase_id }
          initiatorText={ initiatorText }>
        </PurchaseCard>
      );
    });
    return (
      <div>
        <div>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
            <div className="title-00">
              <h3>Pedidos Activos</h3>
              <label></label>
            </div>

            <div className="btn-00">
              <button onClick={this.handleShowDialog}>+ Nuevo pedido</button>
            </div>
          </div>

          <ListGroup>
              { listPurchases}
          </ListGroup>
          <div>
         
          </div>
        </div>
        <ModalCreatePurchase show={this.state.openDialog} onHide={this.handleHideDialog} />
      </div>
    );
  }

}

export default Home;



class ModalCreatePurchase extends React.Component{
  constructor(props){
    super(props);
    this.state={
      minutes:0, 
      purchaseType:'', 
      purchaseTypes:[]
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    loadPurchaseTypes()
    .then(res => this.setState({ purchaseTypes: res.data.purchase_types }))
    .catch(err => console.log('err', err));
  }

  handleClose(){
    this.props.onHide();
  }


  handleSubmit(event) {
    event.preventDefault();
    const { minutes, purchaseType } = this.state;
    createPurchase({
        minutes,
        purchase_type_id: purchaseType
    })
      .then(() => {
        this.props.onPurchaseCreated();
        this.setState({
          creating: false,
          minutes: 0
        })
      })
      .catch(err => this.setState({errorMessage: err}));
      this.handleClose();
  }

  handleChangeValue(event) {
    this.setState({
      minutes: event.target.value
    });
  }

  handleChangeSelect(event) {
    this.setState({
      purchaseType: event.target.value
    });
  }

  render(){
    const {show} = this.props;
    const { minutes, purchaseType, purchaseTypes } = this.state;

    return(
      <Modal show={show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Tiempo de Conclusión</Form.Label>
            <Form.Control type="number" value={minutes} onChange={this.handleChangeValue}/>
            <Form.Text className="text-muted">
            En cuantos minutos terminara el pedido
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Tipo de Compra</Form.Label>
          <Form.Control as="select" value={purchaseType} onChange={this.handleChangeSelect}>
            <option value="0">Seleccionar Opcion</option>
              {purchaseTypes.map(pt => <option key={pt.purchase_type_id} value={pt.purchase_type_id}>{pt.name}</option>)}
          </Form.Control>
        </Form.Group>

        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button style={{background:'#694ED6'}} onClick={this.handleSubmit}>
            Crear Pedido
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
/*
<Button variant="primary" type="submit">
Submit
</Button>
*/
