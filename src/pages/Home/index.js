/* eslint-disable react/button-has-type */
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '~/Context';

function Home() {
  const context = useContext(AuthContext);
  const { profile } = context;
  const unAuthenticated = profile === null || profile === undefined;

  return unAuthenticated ? (
    <div className="overflow-scroll vh-100 w-100 position-relative">
      <img
        className="h-100 w-100 position-absolute"
        style={{ objectFit: 'cover', zIndex: 0 }}
        src="img/bg.jpg"
        alt="none"
      />
      <div
        className="h-100 w-100 position-absolute bg-dark opacity-50"
        style={{ zIndex: 10 }}
      />
      <div
        className="mx-auto w-50 h-100 text-center d-flex flex-column justify-content-center align-items-center position-relative text-white"
        style={{ zIndex: 20 }}
      >
        <h1 className="my-2">
          <u>Welcome to KAMEN system</u>
        </h1>
        <h1 className="fw-bold my-2 ">
          Experience our system with many free services
        </h1>
        <h4 className="my-2">
          We serve many services such as: Group management, real-time
          Presentation and one important thing is that you dont need to charge
          any fee
        </h4>
        <div className="d-flex justify-content-around mt-5 w-100">
          <Button className="w-25">
            <h5>
              <b>ABOUT US</b>
            </h5>
          </Button>
          <Button
            as={Link}
            to="/login"
            className="w-25"
            variant="outline-light"
          >
            <h5>
              <b>EXPERIENCE</b>
            </h5>
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/group" />
  );
}

export default Home;
