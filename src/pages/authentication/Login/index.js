import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '~/Context';
import login from '~/api/auth/login';
import Loading from '~/components/Loading';
import useGoogleLogin from '~/hooks/useGoogleLogin';
import '../authentication.css';

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required('Please Enter your password'),
  })
  .required();

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const context = useContext(AuthContext);
  const { setProfile } = context;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loadingLogin, setLoading] = useState(false);

  const { state } = useLocation();
  const redirectUrl = state?.redirectUrl || '/home';
  const search = state?.search || '';

  const navigate = useNavigate();

  const handleSuccessLogin = (loginRet) => {
    if (
      loginRet?.access_token &&
      loginRet?.refresh_token &&
      loginRet?.profile
    ) {
      localStorage.setItem('access_token', loginRet.access_token);
      localStorage.setItem('refresh_token', loginRet.refresh_token);
      setProfile(loginRet.profile);
      navigate({ pathname: redirectUrl, search }, { replace: true });
    } else {
      toast.error('Token is not found');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });
      const loginRet = response?.data?.object;
      handleSuccessLogin(loginRet);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const { handleGoogle, error, loading } = useGoogleLogin((loginRet) => {
    handleSuccessLogin(loginRet);
  });

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(
        document.getElementById('btnLoginGoogle'),
        {
          scope: 'profile email',
          width: 300,
          height: 80,
          longtitle: true,
          theme: 'dark',
        }
      );
    }
  }, [handleGoogle]);

  return loading || loadingLogin ? (
    <Loading />
  ) : (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <h1>
        <i>
          <u>KAMEN</u>
        </i>
      </h1>
      <div className="my-5 text-secondary fw-semibold">
        Welcome to Kamen system
      </div>

      <Form className="w-75" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            {...register('username')}
            placeholder="Username"
            className="cutom-form-control"
          />
          <Form.Text className="text-muted">
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => <p className="text-danger">{message}</p>}
            />
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="password"
            className="cutom-form-control"
          />
          <div
            className="d-flex justify-content-between align-items-center mt-3 px-1"
            style={{ fontSize: '0.9rem' }}
          >
            <Form.Check
              type="checkbox"
              label="Show password"
              onChange={() => {
                setShowPassword(!showPassword);
              }}
              checked={showPassword}
            />
            <div>
              <Link
                to="/password/renew"
                className="text-decoration-none text-secondary"
              >
                Forgot password ?
              </Link>
            </div>
          </div>

          <Form.Text className="text-muted">
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <p className="text-danger">{message}</p>}
            />
          </Form.Text>
          <Form.Text className="text-muted">
            <p className="text-danger">{error}</p>
          </Form.Text>
        </Form.Group>

        <div className="text-center">
          <Button
            type="submit"
            variant="secondary"
            className="mb-3 v-75 rounded-5 px-5"
          >
            Submit
          </Button>
          <div style={{ fontSize: '0.8rem' }} className="my-3 text-secondary">
            ----Or login with Google----
          </div>
          <Button id="btnLoginGoogle" />

          <div style={{ fontSize: '0.8rem' }} className="my-3 text-secondary">
            ----If you are new member----
          </div>
          <Button
            as={Link}
            to="/register"
            type="submit"
            variant="secondary"
            className="mb-3 v-75 rounded-5 px-5"
          >
            Register here
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
