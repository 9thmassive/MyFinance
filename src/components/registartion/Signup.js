import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { Container } from 'react-bootstrap'
import './login.css'
import { useRef, useState } from 'react'
import firebase from 'firebase'
import { auth } from './firebase'
import * as EmailValidator from 'email-validator'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './login.css'

toast.configure()
export default function Signup() {
    const [loading, setLoading] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const surNameRef = useRef()
    const nameRef = useRef()
    // const history = useHistory()

    function userMessage(type, message) {
        if (type) {
            return toast.success(message, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
        return toast.error(message, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    function signup(email, password) {
        auth.createUserWithEmailAndPassword(email, password)
    }

    async function handleSumbit(e) {
        e.preventDefault()

        if (!EmailValidator.validate(emailRef.current.value)) {
            return userMessage(false, '❌ Invalid Email Address:')
        }

        if (!(passwordRef.current.value === passwordConfirmRef.current.value)) {
            return userMessage(false, '❌ Password do not much')
        }
        if (
            passwordRef.current.value.length < 6 ||
            passwordConfirmRef.current.value < 6
        ) {
            return userMessage(
                false,
                '❌ Password should be minimum 6 characters'
            )
        }
        try {
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            let fullName =
                nameRef.current.value + ' ' + surNameRef.current.value
            let currentUser = auth.currentUser
            currentUser.updateProfile({
                displayName: fullName,
            })

            await firebase
                .firestore()
                .collection('user')
                .doc(currentUser.uid)
                .set({
                    displayName: currentUser.displayName,
                })

            setLoading(() => false)
            window.location.href = '/dashboard'
            userMessage(true, `✅ Welcome ${currentUser.displayName}`)
        } catch (error) {
            setLoading(false)
            return userMessage(
                false,
                '❌ The email address is already in use by another account.'
            )
        }
    }

    return (
        <>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: '100vh' }}
                id="bolola"
            >
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <Card>
                        <Card.Body className="cardBody">
                            <Form>
                                <h2 className="text-center mb-4 drk">
                                    Sign up
                                </h2>
                                <Form.Group id="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={nameRef}
                                        required
                                    ></Form.Control>
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={surNameRef}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        ref={emailRef}
                                        required
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group id="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        ref={passwordRef}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group id="password-confirm">
                                    <Form.Label>
                                        Password Confirmation
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        ref={passwordConfirmRef}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                                <Button
                                    onClick={handleSumbit}
                                    className="w-100 btn loginBtn signup"
                                    type="sumit"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                                Loading...
                                            </span>
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    )
}
