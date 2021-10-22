import {Navbar, Nav, Container} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";

const Navigation = () => {
    return (
        <>
            <Navbar collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav>
                            <LinkContainer to="/">
                                <Nav.Link>Import Tasks</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/hospitals">
                                <Nav.Link>Hospitals</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/patients">
                                <Nav.Link>Patients</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/treatments">
                                <Nav.Link>Treatments</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Navigation;
