/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable indent */
import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '~/Context';
import logout from '~/api/auth/logout';
import getGroupList from '~/api/normal/group/getGroupList';
import { menu } from '~/img';
import styles from './Header.module.css';

function Header() {
  const { id } = useParams();
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    const asyncGetGroup = async () => {
      try {
        const resGroupList = await getGroupList();
        setGroupList(resGroupList?.data?.object);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    };
    asyncGetGroup();
  }, []);

  const context = useContext(AuthContext);
  const { profile, setProfile } = context;
  const unAuthenticated = profile === null || profile === undefined;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showA, setShowA] = useState(false);

  const toggleShowA = () => setShowA(!showA);
  const hindeA = () => setShowA(false);

  const handleLogout = async () => {
    await logout();
    setProfile(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <>
          <Button className={clsx(styles.menu)} onClick={handleShow}>
            <img referrerPolicy="no-referrer" src={menu} alt="menu" />
          </Button>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title />
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/group">
                  Home
                </Nav.Link>
                <NavDropdown
                  title="My classes"
                  id={`offcanvasNavbarDropdown-expand-${false}`}
                >
                  {groupList?.map((group) => (
                    <NavDropdown.Item
                      className={clsx(styles.dropdownGroup)}
                      style={
                        parseInt(id, 10) === parseInt(group.id, 10)
                          ? {
                              color: 'blue',
                              fontWeight: 'bold',
                            }
                          : {}
                      }
                      key={group.id}
                      href={'/group/'.concat(group.id)}
                    >
                      {group.groupName}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Nav>
              <Form className="d-flex mt-3">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-info">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Offcanvas>
        </>
        <Navbar.Brand as={Link} to="/group">
          <h4>
            <b>KAMEN</b>
          </h4>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 flex-grow-1 pe-3 justify-content-end"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {!unAuthenticated && (
              <div className="d-flex align-items-center w-100 justify-content-between">
                <div className="d-flex align-items-center border-2 border-dark border-5">
                  <Nav.Link as={Link} to="/group">
                    My groups
                  </Nav.Link>
                  <Nav.Link as={Link} to="/presentation">
                    My presentations
                  </Nav.Link>
                </div>

                <Row className={clsx(styles.grNoty)}>
                  <Col md={6} className="">
                    <Toast
                      className={clsx(styles.notification)}
                      show={showA}
                      onClose={toggleShowA}
                    >
                      <Toast>
                        <Toast.Header closeButton={false}>
                          <img
                            referrerPolicy="no-referrer"
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                          />
                          <strong className="me-auto">Bootstrap</strong>
                          <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>
                          Woohoo, you are reading this text in a Toast!
                        </Toast.Body>
                      </Toast>
                    </Toast>
                  </Col>
                </Row>
                <div
                  onClick={() => {
                    hindeA();
                  }}
                  className={clsx(styles.user)}
                >
                  <Dropdown className={clsx(styles.avtDropDown)}>
                    <Dropdown.Toggle
                      className={clsx(styles.realAvt)}
                      split
                      variant="success"
                      id="dropdown-split-basic"
                    >
                      <Image
                        roundedCircle
                        className={clsx(styles.avt)}
                        src={profile?.avatar || '/defaultAvatar.png'}
                        alt=""
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className={clsx(styles.dropInfo)}>
                      <Dropdown.Item as={Link} to="/profile">
                        My profile
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/group">
                        My group
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/login"
                        onClick={handleLogout}
                      >
                        Log out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
