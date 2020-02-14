import React from 'react';

import { createPurchase, loadPurchaseTypes } from './service';

class CreatePurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      minutes: 0,
      errorMessage: '',
      purchaseType: 0,
      purchaseTypes: []
    };
    this.enableCreate = this.enableCreate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    loadPurchaseTypes()
    .then(res => this.setState({ purchaseTypes: res.data.purchase_types }))
    .catch(err => console.log('err', err));
  }

  enableCreate() {
    this.setState({
      creating: true
    });
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
      .catch(err => this.setState({errorMessage: err}))
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

  render() {
    const { creating, minutes, purchaseType, purchaseTypes } = this.state;
    return (
      <div>
        { !creating ? (
          <div className="btn-00">
            <button onClick={this.enableCreate}>
            + Nuevo pedido
            </button>
          </div>) : (
          <div className="btn-00">
            <form onSubmit={this.handleSubmit}>
              <label>Tiempo de duración: <br/>
                <input type="number" value={minutes} onChange={this.handleChangeValue} />
              </label>
              <br/>
              <label>
                Tipo de compra: <br/>
                <select value={purchaseType} onChange={this.handleChangeSelect}>
                  <option value="0">Seleccionar Opcion</option>
                  {
                    purchaseTypes.map(pt =>
                      <option key={pt.purchase_type_id} value={pt.purchase_type_id}> {pt.name} </option>
                    )
                  }
                </select>
              </label>
              <br/><br/>
              <button type="submit">
                Crear Compra
              </button>
            </form>
          </div>)
        }
      </div>
    );
  }
}

export default CreatePurchase;
