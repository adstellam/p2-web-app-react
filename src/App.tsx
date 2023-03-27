import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useVH from 'react-viewport-height';

import SignIn from './routes/SignIn';
import Home from './routes/Home';
import WorkItems from './routes//WorkItems';
import Machines from './routes/Machines';
import CropZones from './routes/CropZones';
import Settings from './routes/Settings';
import WorkItemDetails from './routes/WorkItemDetails';
import MachineDetails from './routes/MachineDetails';
import CropZoneDetails from './routes/CropZoneDetails';
import PageNotFound from './routes/PageNotFound';
import ErrorPage from './routes/ErrorPage';

export default function App() {

    useVH();
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    path: ":organizationId/workItems",
                    element: <WorkItems />,
                    errorElement: <ErrorPage />
                },
                {
                    path: ":organizationId/workItems/:workItemId",
                    element: <WorkItemDetails />,
                    errorElement: <ErrorPage />
                },
                {
                    path: ":organizationId/machines",
                    element: <Machines />,
                    errorElement: <ErrorPage />
                },
                {
                    path: ":organizationId/machines/:machineId",
                    element: <MachineDetails />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: ":organizationId/cropZones",
                    element: <CropZones />,
                    errorElement: <ErrorPage />
                },
                {
                    path: ":organizationId/cropZones/:cropZoneId",
                    element: <CropZoneDetails />,
                    errorElement: <ErrorPage />
                },
                {
                    path: ":organizationId/settings",
                    element: <Settings />,
                    errorElement: <ErrorPage />,
                }
            ]
        },
        {
            path: "/signIn",
            element: <SignIn />
        },
        {
            path: "*",
            element: <PageNotFound />
        }
    ]);

    //localStorage.setItem("jwt-token", "");

    return (
        <RouterProvider router={router} />
    );

}