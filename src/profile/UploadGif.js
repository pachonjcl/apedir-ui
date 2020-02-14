import React from 'react';

import { Card, Button, Modal } from 'react-bootstrap';

import { uploadImage } from '../service';
import { IMAGES_URL } from '../settings';

class UploadGif extends React.Component {

  constructor(props) {
    super(props);
    this.user_id = localStorage.getItem('user_id');
    this.state = {
      imageUrl: `${IMAGES_URL}/profile_${this.user_id}.png`,
      file: null,
      showModal: false,
      modalMessage: '',
    };
    this.onImageErrored = this.onImageErrored.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.fileUpload(this.state.file)
      .then(() => {
        this.setState({
          showModal: true,
          modalMessage: 'Imagen Guardada.'
        })
      })
      .catch(() => {
        this.setState({
          showModal: true,
          modalMessage: 'Ha ocurrido un error durante la subida.',
          imageUrl: `${IMAGES_URL}/profile_${this.user_id}.png`
        })
      });
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0],
      imageUrl: URL.createObjectURL(e.target.files[0])
    })
  }

  fileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    return uploadImage(formData);
  }

  onImageErrored() {
    this.setState({
      imageUrl: `${IMAGES_URL}/default.png`
    });
  }

  render() {
    const { imageUrl } = this.state;
    return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={imageUrl} onError={this.onImageErrored} alt="GIF" />
        <Card.Body>
          <Card.Title>Upload GIF</Card.Title>
          <form onSubmit={this.onFormSubmit}>
            <input type="file" onChange={this.onChange} />
            <button type="submit">Upload</button>
          </form>
        </Card.Body>
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
      </Card>
    );
  }
}

export default UploadGif;