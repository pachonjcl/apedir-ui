import React from 'react';

class PurchaseCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name,
      description,
      minPrice,
      maxPrice,
      remainingTime,
      imageSrc,
      purchase_id,
      initiatorText
    } = this.props;
    let priceRange = `Precio: ${minPrice} - ${maxPrice}Bs`;
    return (
      <figure className="snip1253">
        <div className="image">
          <img src={imageSrc} alt="sample59" />
        </div>
        <figcaption>
          <div className="date">
            <span className="day">
              01
            </span>
            <span className="month">
              ACT
            </span>
          </div>
          <h3>{ name }</h3>
          <p>
            { description }
          </p>
          <p>
            { initiatorText }
          </p>
        </figcaption>
        <footer>
          <div className="time-00">
          <b>Tiempo: </b>
            { remainingTime }
          </div>
          <div align="none">
            { priceRange }
          </div>
        </footer>
        <a href={'/purchases/' + purchase_id}></a>
      </figure>
    );
  }
}

export default PurchaseCard;
