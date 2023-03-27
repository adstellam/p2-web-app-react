import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { getUser } from '../api/ApiManager';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setOrganization, selectOrganization } from '../features/organization/organizationSlice';

import '../css/Home.css';
import logo from '../assets/images/stout-logo.jpg';

export default function Home() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const useSelector = useAppSelector;
    const organization = useSelector(selectOrganization);

    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // TODO: Fix, we shouldn't be reading the token in a route.
        const jwt = localStorage.getItem('jwt-token');
        if (jwt) {
            console.log('[JWT in localStorage used]');
            getUser()
                .then((response) => {
                    setAuthenticated(true);
                    dispatch(setOrganization(response.response?.data.organization));
                    navigate(`/${response.response?.data.organization}/workItems`)
                })
                .catch((error) => {
                    // TODO: This is not being called with the jwt is invalid.
                    console.log('[JWT invalid or getUser() failed]', error.error.message);
                    setAuthenticated(false);
                    navigate('/signIn');
                });
        } else {
            console.log('[JWT absent in localStorage]');
            setAuthenticated(false);
            navigate('/signIn');
        }

    }, []);

    return (
        (authenticated) ?
            <div>
                <div id="sidebar">
                    <img src={logo} alt="Logo" />
                    <nav>
                        <ul>
                            <li>
                                <Link to={`/${organization}/workItems`}>WorkItems</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div id="outlet">
                    <Outlet />
                </div>
            </div>
            : 
            null
    );

}