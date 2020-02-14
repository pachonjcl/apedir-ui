import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

import ChangePassword from './ChangePassword';
import UploadGif from './UploadGif';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Personal Information
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                TODO
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Upload Gif
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <UploadGif />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              Change Password
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <ChangePassword />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default Profile;