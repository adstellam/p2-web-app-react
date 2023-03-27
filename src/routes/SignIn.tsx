import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

import { login } from '../api/ApiManager';
import { useAppDispatch } from '../redux/hooks';

import stoutLogo from '../assets/images/stout-logo.jpg';
import '../css/SignIn.css';

export default function SignIn() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    const onUsernameChange = (e: any) => {
        setUsername(e.target.value);
    };

    const onPasswordChange = (e: any) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        login(username, password)
            .then((response) => {
                localStorage.setItem('jwt-token', response.response?.data.jwt);
                console.log("[SignIn succeeded");
                navigate('/');
            })
            .catch((error) => {
                console.log("[SignIn failed]", error.message);
                alert("SignIn Failed. Please try again.");
            });
    };

    return (
        <div id="signin-screen">
            <div className="flex-container">
                <img src={stoutLogo} width={240} height={120} />
                <TextField
                    value={username}
                    label={"Username"}
                    onChange={onUsernameChange}
                    variant="outlined"
                    size="small"
                    style={{ marginTop: "2rem", backgroundColor: "white" }}
                />
                <TextField
                    value={password}
                    label={"Password"}
                    type="password"
                    onChange={onPasswordChange}
                    variant="outlined"
                    size="small"
                    style={{ marginTop: "1rem", backgroundColor: "white" }}
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "2rem" }}
                >
                    Submit
                </Button>
            </div>
        </div>
    );

}
