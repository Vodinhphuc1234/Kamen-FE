import 'bootstrap/dist/css/bootstrap.css';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import { ErrorMessage } from '@hookform/error-message';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import registerAuth from '~/api/auth/register';
import Loading from '~/components/Loading';
import Notify from '~/components/Notification';
import '../authentication.css';

const schema = yup

  .object()

  .shape({
    username: yup
      .string()
      .min(8, 'Your username must be longer than 8 characters')
      .max(32, 'Your username must be shorter than 32 characters')
      .required(),

    password: yup

      .string()

      .required('Please Enter your password')
      .min(8, 'Your password must be longer than 8 characters')
      .max(32, 'Your password must be shorter than 32 characters')

      .matches(
        // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        /^(?=.{8,})/,

        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),

    email: yup.string().email().required(),

    retypePassword: yup.string().oneOf([yup.ref('password'), null]),

    displayName: yup.string().required(),
  })

  .required();

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    show: false,
    msg: '',
    type: '',
  });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth({
        username: data.username,
        password: data.password,
        displayName: data.displayName,
        email: data.email,
      });
      toast.success('Successfully. Check your email');
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Notify notify={notify} setShow={setNotify} />
      {loading ? (
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
            <Form.Group>
              <Form.Control
                className="cutom-form-control"
                {...register('username')}
                placeholder="Username"
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                className="cutom-form-control"
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
              />

              <Form.Text className="text-muted">
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <p className="text-danger">{message}</p>
                  )}
                />
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                {...register('retypePassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="retype password"
                className="cutom-form-control"
              />

              <Form.Check
                style={{ fontSize: '0.9rem' }}
                className="mt-3"
                type="checkbox"
                label="Show password"
                onChange={() => {
                  setShowPassword(!showPassword);
                }}
                checked={showPassword}
              />

              <Form.Text className="text-muted">
                <ErrorMessage
                  errors={errors}
                  name="retypePassword"
                  render={({ message }) => (
                    <p className="text-danger">{message}</p>
                  )}
                />
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Control
                className="cutom-form-control"
                {...register('displayName')}
                type="text"
                placeholder="Enter Name"
              />

              <Form.Text className="text-muted">
                <ErrorMessage
                  errors={errors}
                  name="displayName"
                  render={({ message }) => (
                    <p className="text-danger">{message}</p>
                  )}
                />
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                className="cutom-form-control"
                {...register('email')}
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <p className="text-danger">{message}</p>
                  )}
                />
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
              <div
                style={{ fontSize: '0.8rem' }}
                className="my-3 text-secondary"
              >
                ----If you had a account----
              </div>
              <Button
                as={Link}
                to="/login"
                type="submit"
                variant="secondary"
                className="mb-3 v-75 rounded-5 px-5"
              >
                Login here
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}

export default Register;
