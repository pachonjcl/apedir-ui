import React from 'react';
import { Tab, Row, Col, Nav } from 'react-bootstrap';

import PurchaseTypeProduct from './PurchaseTypeProduct';

import {
  loadProducts,
  loadPurchaseTypes,
  loadPurchaseTypeProducts
} from './service';

class ProductManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      purchase_types: [],
    };
    this.updateProduct = this.updateProduct.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    loadProducts().then(
      res => {
        this.setState({
          products: res.data.products
        });
      }
    );
    loadPurchaseTypes().then(
      res => {
        const { purchase_types } = res.data;
        this.setState({
          purchase_types
        });
        purchase_types.map((purchase_type) => {
          loadPurchaseTypeProducts(purchase_type.purchase_type_id)
          .then(res => {
            this.setState({
              purchase_types: purchase_types.map(pt => {
                if(pt.purchase_type_id === purchase_type.purchase_type_id) {
                  purchase_type.products = res.data.products
                  return purchase_type;
                }
                return pt;
              })
            })
          });
        });
      }
    )
  }

  addProduct(purchaseType, product) {
    const { purchase_types } = this.state;
    this.setState({
      purchase_types: purchase_types.map(pt => {
        if(pt.purchase_type_id === purchaseType.purchase_type_id) {
          pt.products = pt.products.concat([product])
        }
        return pt;
      })
    })
  }

  updateProduct(purchaseType, product) {
    const { purchase_types } = this.state;
    this.setState({
      purchase_types: purchase_types.map(pt => {
        if(pt.purchase_type_id === purchaseType.purchase_type_id) {
          pt.products = pt.products.map(p => {
            if(p.product_id === product.product_id) {
              p = product;
            }
            return p;
          })
        }
        return pt;
      })
    })
  }

  render() {
    const { purchase_types } = this.state;
    let selected = 0;
    if(purchase_types && purchase_types.length > 0 && purchase_types[0].purchase_type_id) {
      selected = purchase_types[0].purchase_type_id;
    }
    return (
      <div>
        <div>
          <h1> Product Management </h1>
        </div>
        <Tab.Container id="left-tabs-example" defaultActiveKey={selected}>
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {
                  purchase_types.map(pt => 
                    <Nav.Item key={pt.purchase_type_id}>
                      <Nav.Link eventKey={pt.purchase_type_id} key={pt.purchase_type_id}>
                        {pt.name}
                      </Nav.Link>
                    </Nav.Item>
                  )
                }
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                { 
                  purchase_types.map(pt =>
                    <PurchaseTypeProduct purchaseType={ pt } key={pt.purchase_type_id} 
                      updateProduct={ this.updateProduct }
                      addProduct={ this.addProduct }/>
                  )
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }

}

export default ProductManagement;
