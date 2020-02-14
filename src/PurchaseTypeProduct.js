import React from 'react';
import { Tab, Accordion, Card, Button, Form, Row, Col } from 'react-bootstrap';

import { updateProductById, createPurchaseTypeProduct } from './service';

class PurchaseTypeProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      name: '',
      unit_price: 0
    }
    this.generateListByPurchaseType = this.generateListByPurchaseType.bind(this);
    this.onChangeProductValue = this.onChangeProductValue.bind(this);
    this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
    this.handleChangeNewProduct = this.handleChangeNewProduct.bind(this);
    this.handleCreateProduct = this.handleCreateProduct.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if(props.purchaseType.products && props.purchaseType.products.length != state.products.length) {
      return {
        products: [].concat(props.purchaseType.products)
      }
    } else {
      return state;
    }
  }

  onChangeProductValue(event, product, property) {
    const { products } = this.state;
    this.setState({
      products: products.map(p => {
        if(p.product_id === product.product_id) {
          return {
            ...product,
            [property]: event.target.value
          };
        }
        return p;
      })
    });
  }

  handleChangeNewProduct(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }   

  handleCreateProduct() {
    let { name, unit_price } = this.state;
    let { purchaseType, addProduct } = this.props;
    let product = {
      name,
      unit_price
    }
    createPurchaseTypeProduct(purchaseType.purchase_type_id, product)
      .then(res => {
        addProduct(purchaseType, {
          ...product,
          'product_id': res.data.lastID
        })
      })
      .catch(err => {
        console.log('err', err);
      })
  }

  handleUpdateProduct(product) {
    const { updateProduct, purchaseType } = this.props;
    updateProductById(product)
      .then(res => {
        updateProduct(purchaseType, product);
      })
      .catch(err => {
        console.log('err', err);
      })
  }

  generateListByPurchaseType() {
    let { products, name, unit_price } = this.state;
    let { purchaseType } = this.props;
    if(products)
    return (
      <div key={purchaseType.purchase_type_id}>
        { purchaseType.name }
        <Accordion defaultActiveKey="0">
          {
            products.map((p, i) => {
              if(p) {
              return (
                <Card key={p.product_id}>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={i}>
                      { p.name }
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>
                    <Form>
                      <Form.Row>
                        <Col>
                          <Form.Control placeholder="Name" value={p.name} 
                            onChange={(e) => this.onChangeProductValue(e, p, 'name') }/>
                        </Col>
                        <Col>
                          <Form.Control placeholder="Price" value={p.unit_price} 
                            onChange={(e) => this.onChangeProductValue(e, p, 'unit_price')} />
                        </Col>
                      </Form.Row>
                      <Button variant="primary" onClick={() => this.handleUpdateProduct(p)}>
                        Save
                      </Button>
                    </Form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )
            } else return null
            })
          }
          <Card key="NewProduct">
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="NewProduct">
                New Product
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="NewProduct">
              <Card.Body>
              <Form>
                <Form.Row>
                  <Col>
                    <Form.Control placeholder="Name" value={ name } name="name"
                      onChange={ this.handleChangeNewProduct }/>
                  </Col>
                  <Col>
                    <Form.Control placeholder="Price" value={unit_price} name="unit_price"
                      onChange={ this.handleChangeNewProduct } />
                  </Col>
                </Form.Row>
                <Button variant="primary" onClick={this.handleCreateProduct}>
                  Save
                </Button>
              </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    )
    return null;
  }

  render() {
    const { purchaseType } = this.props;
    return (
      <Tab.Pane eventKey={purchaseType.purchase_type_id} key={purchaseType.purchase_type_id}>
      {
        this.generateListByPurchaseType()
      }
      </Tab.Pane>
    )
  }
}

export default PurchaseTypeProduct;