import { Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function AuthenticationLayout() {
  return (
    <Row className="h-100 w-100">
      <Col xs="12" lg="6">
        <img className="w-100" src="img/login-bg.jpg" alt="none" />
      </Col>
      <Col xs="12" lg="6">
        <div className="w-100">
          <Outlet />
        </div>
      </Col>
    </Row>
  );
}
