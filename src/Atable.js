import React from 'react';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';

import { loadWishProducts, saveWishProducts } from './service';
import { subscribeToNewData } from './api';
import { getEmptyArray } from './utils';
import { IMAGES_URL } from './settings';

class Atable extends React.Component {
  constructor(props) {
    super(props);
    this.user_id = localStorage.getItem('user_id');
    this.processProps = this.processProps.bind(this);
    this.handleChangeWish = this.handleChangeWish.bind(this);
    this.processWishProducts = this.processWishProducts.bind(this);
    this.saveWishes = this.saveWishes.bind(this);
    this.processWishProductsWs = this.processWishProductsWs.bind(this);
    this.processProps(props);
    this.timestamp = new Date().getTime();
    this.state = {
      table: getEmptyArray(this.n, this.m),
      showModal: false,
      modalMessage: '',
    };
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

  processProps(newProps) {
    const { users, products, wishes } = newProps.data;
    this.purchase_id = newProps.purchase;
    this.n = users.length;
    this.m = products.length;
    this.mp = {};
    this.imp = {};
    this.mu = {};
    products.forEach((p, i) => { this.mp[p.product_id] = i; this.imp[i] = p.product_id });
    users.forEach((u,i) => { this.mu[u.user_id] = i });
    wishes.forEach(w => {
      loadWishProducts(w.wish_id)
        .then(this.processWishProducts);
    });
    subscribeToNewData(this.purchase_id, this.processWishProductsWs);
  }

  saveWishes() {
    const { table } = this.state;
    let user_id = this.user_id;
    let row = this.mu[user_id];
    let wishes = table[row].map((q, i) => {
      let product_id = this.imp[i];
      return {
        quantity: q,
        product_id,
      }
    });
    saveWishProducts(this.purchase_id, { wishes })
    .then(() => {
      this.setState({
        showModal: true,
        modalMessage: 'Pedido Guardado.'
      })
    })
    .catch(() => {
      this.setState({
        showModal: true,
        modalMessage: 'El tiempo de la compra ha finalizado, no puede modificar su pedido.'
      })
    });
  }

  processWishProductsWs(data) {
    var wishProducts = data.products;
    if(wishProducts.length === 0) return;
    const { table } = this.state;
    let newTable = getEmptyArray(this.n, this.m);
    for(var i = 0 ; i < this.n ; i++) {
      for(var j = 0 ; j < this.m ; j++) {
        newTable[i][j] = table[i][j];
      }
    }
    wishProducts.forEach((wp) => {
      if(Number(wp.user_id) === Number(this.user_id)) return;
      let idx = this.mu[wp.user_id];
      let jdx = this.mp[wp.product_id];
      newTable[idx][jdx] = wp.quantity;
    });
    this.setState({
      table: newTable
    });
  }

  processWishProducts(res) {
    var wishProducts = res.data.products;
    if(wishProducts.length === 0) return;
    let wish_id = wishProducts[0].wish_id;
    const { table } = this.state;
    const { wishes } = this.props.data;
    let user_id;
    wishes.forEach(w => {
      if(Number(w.wish_id) === Number(wish_id)) {
        user_id = w.user_id;
      }
    });
    if(!user_id) return;
    let i = this.mu[user_id];
    let v = (new Array(this.m)).fill(0);
    wishProducts.forEach(wp => {
      let j = this.mp[wp.product_id];
      v[j] = wp.quantity;
    });
    this.setState({
      table: table.map((r, idx)=> {
        if(idx === i) {
          return v;
        }
        return r;
      })
    });
  }

  handleChangeWish(index, value) {
    if(isNaN(+value)) {
      value = 0;
    }
    const { table } = this.state;
    let ui = this.mu[this.user_id];
    this.setState({
      table: table.map((r, i) => {
        if(Number(i) === Number(ui)) {
          let arr = [].concat(r);
          arr[index] = +value;
          return arr;
        }
        return r;
      })
    });
  }

  render() {
    if(Object.keys(this.props.data).length === 0) return null;
    const { products, users } = this.props.data;
    const { table } = this.state;
    let totals = (new Array(this.m+1)).fill(0);
    let toPay = (new Array(this.n)).fill(0);
    var i, j;
    for(j = 0 ; j < this.m ; j++) {
      for(i = 0 ; i < this.n ; i++) {
        totals[j] += table[i][j];
      }
    }
    for(i = 0 ; i < this.n ; i++) {
      for(j = 0 ; j < this.m ; j++) {
        let p = products[j];
        toPay[i] += table[i][j] * p.unit_price;
      }
    }
    totals[this.m] = 'Total a recaudar: ' + toPay.reduce((a, b) => a+b, 0) + ' Bs.';
    return (
      <div>
        <table border='1' style={{borderCollapse: 'collapse'}}>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Nombre</th>
              {
                products.map(p =>
                  <th key={p.product_id}>{p.name}</th>
                )
              }
              <th>Total a Pagar (Bs)</th>
            </tr>
            { users.map((u,ui) => {
                if(Number(toPay[ui]) === 0 && Number(this.user_id) !== Number(u.user_id)) return null;
                let imageUrl = `${IMAGES_URL}/profile_${u.user_id}.png`;
                const popover = (
                  <Popover id="popover-basic" title={`${u.email} GIF`}>
                    <img src={imageUrl} width={200} height={200} alt="GIF" />
                  </Popover>
                );
                return (<tr key={u.user_id}>
                  <td>
                    <OverlayTrigger trigger="hover" placement="right" overlay={popover} >
                      <img src={imageUrl} width={50} height={50} alt="GIF" />
                    </OverlayTrigger>
                  </td>
                  <td> {u.email} </td>
                  {
                    Number(this.user_id) === Number(u.user_id) ? (
                        products.map((p, index) => 
                        <td key={p.product_id}>
                          <input type="text" 
                            style={{width: '50px'}}
                            onChange={e => this.handleChangeWish(index, e.target.value)} 
                            value={table[ui][index]} />
                        </td>)
                    ) : (
                      products.map((p, pj) => <td key={p.product_id}>{table[ui][pj]}</td>)
                    )
                  }
                  <td>{toPay[ui]} Bs.</td>
                </tr>)
              })
            }
            <tr>
              <td><b>Totales</b></td>
              <td>.</td>
              {
                totals.map((t, ti) => <td key={ti}>{t}</td>)
              }
            </tr>
          </tbody>
        </table>
        
        <Button onClick={this.saveWishes} variant="primary" size="lg" block>Save</Button> 
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
      </div>
    );
  }
}

export default Atable;

