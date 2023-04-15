/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css';
import imageCompression from 'browser-image-compression';
import { useContext, useState } from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '~/Context';
import privateAxios from '~/api/PrivateAxios';
import Loading from '~/components/Loading';

/**
 *
 * @returns Profile
 */
function Profile() {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const { profile, setProfile } = context;

  const schema = yup
    .object()
    .shape({
      username: profile.username ? yup.string().required() : yup.string(),
      email: yup.string().email().required(),
      displayName: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState({
    flag: false,
    msg: '',
  });

  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState({
    url: profile.avatar,
    obj: null,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [disableEdit, setEditable] = useState(true);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file !== null) {
      setAvatar({ url: URL.createObjectURL(file), obj: file });
    }
  };
  const handleSubmitAvt = async () => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const file = avatar.obj;
    try {
      handleClose();
      setLoading({ flag: true, msg: 'Uploading img . . .' });
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);
      const reponse = await privateAxios.post('/me/uploadAvatar', formData);
      setProfile(reponse?.data.object);
      setLoading({ flag: false, msg: 'Uploading image . . .' });
      toast.success('Upload success');
    } catch (e) {
      ///
      toast.error(e?.response?.data?.message);
      if (e?.response?.status === 403) {
        navigate({ pathname: '/notPermission' });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading({ flag: true, msg: 'Update profile . . .' });

      const reponse = await privateAxios.put('/me', {
        username: data.username,
        displayName: data.displayName,
        email: data.email,
      });
      setProfile(reponse?.data.object);

      setLoading({ flag: false, msg: 'Update profile . . .' });

      toast.success('Update profile success');
    } catch (error) {
      toast.error(error?.response?.data?.message);
      if (error?.response?.status === 403) {
        navigate({ pathname: '/notPermission' });
      }
    }
  };

  return (
    <div className="overflow-scroll h-100">
      {loading.flag ? (
        <Loading msg={loading?.msg} />
      ) : (
        <Container className="pt-5">
          <Card>
            <Row>
              <Col xs="12" lg="6">
                <Card.Img
                  className="p-3"
                  variant="top"
                  src={profile.avatar || '/defaultAvatar.png'}
                />
              </Col>
              <Col className="d-flex flex-column" xs="12" lg="6">
                <Card.Body>
                  <Card.Text>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div className="d-flex justify-content-between align-items-center">
                        <Form.Check
                          type="switch"
                          label="Edit Profile"
                          defaultValue={!disableEdit}
                          className="fw-bold"
                          onChange={() => {
                            setEditable(!disableEdit);
                            setProfile(profile);
                          }}
                        />
                        {!disableEdit && (
                          <Button variant="success" type="submit">
                            Submit
                          </Button>
                        )}
                      </div>
                      <fieldset disabled={disableEdit}>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label
                            style={{ fontSize: '1rem', color: 'gray' }}
                            className="fw-bold"
                          >
                            Email
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              {...register('email')}
                              defaultValue={profile.email}
                              type="email"
                              placeholder="Enter email"
                              aria-label="Recipient's username"
                              aria-describedby="basic-addon1"
                            />
                          </InputGroup>
                          <Form.Text>
                            {!disableEdit && (
                              <ErrorMessage
                                errors={errors}
                                name="email"
                                render={({ message }) => (
                                  <p className="text-danger">{message}</p>
                                )}
                              />
                            )}
                          </Form.Text>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCity">
                          <Form.Label
                            style={{ fontSize: '1rem', color: 'gray' }}
                            className="fw-bold"
                          >
                            Name
                          </Form.Label>
                          <Form.Control
                            {...register('displayName')}
                            defaultValue={profile.displayName}
                          />
                          <Form.Text>
                            {!disableEdit && (
                              <ErrorMessage
                                errors={errors}
                                name="displayName"
                                render={({ message }) => (
                                  <p className="text-danger">{message}</p>
                                )}
                              />
                            )}
                          </Form.Text>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                          {profile.username !== null && (
                            <>
                              <Form.Label
                                style={{ fontSize: '1rem', color: 'gray' }}
                                className="fw-bold"
                              >
                                Username
                              </Form.Label>
                              <Form.Control
                                {...register('username')}
                                defaultValue={profile.username}
                                // login by email
                                disabled={profile.username === null}
                              />
                            </>
                          )}
                          <Form.Text>
                            {!disableEdit && (
                              <ErrorMessage
                                errors={errors}
                                name="username"
                                render={({ message }) => (
                                  <p className="text-danger">{message}</p>
                                )}
                              />
                            )}
                          </Form.Text>
                        </Form.Group>
                      </fieldset>
                    </Form>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-around">
                  <Button variant="secondary" as={Link} to="/password/renew">
                    Change password
                  </Button>
                  <Button variant="success" onClick={handleShow}>
                    Upload avatar
                  </Button>
                </Card.Footer>
              </Col>
            </Row>
          </Card>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ fontWeight: 'bold' }}>Avatar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                referrerPolicy="no-referrer"
                alt="not fount"
                width="250px"
                src={avatar.url}
              />
              <Form>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label />
                  <Form.Control
                    onChange={handleUpload}
                    accept="image/png, image/jpg"
                    type="file"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleSubmitAvt} variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </div>
  );
}

export default Profile;
