import React from 'react';
import { Redirect } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class ApeNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    this.setState({
      redirect: true
    });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) { return <Redirect to="/login" />; }
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/home">
          <img src="../logo-01.svg" alt="" height="40px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-r">
            <Nav.Link href="/product-management">Product Management</Nav.Link>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {/**<Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>*/}
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

export default ApeNavbar;
