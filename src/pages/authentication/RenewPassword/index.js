import 'bootstrap/dist/css/bootstrap.css';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import { ErrorMessage } from '@hookform/error-message';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import renewPassword from '~/api/auth/renewPassword';
import Loading from '~/components/Loading';
import { AuthContext } from '~/Context';
import '../authentication.css';

const schema = yup

  .object()

  .shape({
    username: yup
      .string()
      .min(8, 'Your username must be longer than 8 characters')
      .max(32, 'Your username must be shorter than 32 characters')
      .required(),

    email: yup.string().email().required(),
    password: yup

      .string()
      .min(8, 'Your password must be longer than 8 characters')
      .max(32, 'Your password must be shorter than 32 characters')

      .required('Please Enter your password')

      .matches(
        // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        /^(?=.{8,})/,

        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),

    retypePassword: yup.string().oneOf([yup.ref('password'), null]),
  })

  .required();

function RenewPassword() {
  const { profile } = useContext(AuthContext);
  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await renewPassword({
        username: data.username,
        password: data.password,
        email: data.email,
      });
      toast.success(`Check your confirmation in email ${data?.email}`);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      if (err?.response?.status === 403) {
        navigate({ pathname: '/notPermission' });
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return loading ? (
    <Loading />
  ) : (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <h1>
        <i>
          <u>KAMEN</u>
        </i>
      </h1>
      <div className="my-5 text-secondary fw-semibold">Reset your password</div>
      <Form className="w-75" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Control
            className="cutom-form-control"
            {...register('username')}
            defaultValue={profile?.username}
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
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
              render={({ message }) => <p>{message}</p>}
            />
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="cutom-form-control"
            {...register('retypePassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Retype password"
          />
          <Form.Check
            style={{ fontSize: '0.9rem' }}
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
              render={({ message }) => <p>{message}</p>}
            />
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Control
            className="cutom-form-control"
            defaultValue={profile?.email}
            {...register('email')}
            type="email"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => <p>{message}</p>}
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

export default RenewPassword;
