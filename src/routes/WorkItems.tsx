import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/WorkItems.css';

import { fetchWorkItems } from '../features/workItems/workItemsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectOrganization } from '../features/organization/organizationSlice';
import { selectWorkItems } from '../features/workItems/workItemsSlice';

export type MachineUseExcerptData = {
    machine_use_id: string;
    machine_name: string;
    start_time: string;
    end_time: string;
    latitude: number;
    longitude: number;
    plant_count: number;
    acres: number;
    job_status: string;
    percent_downloaded: number;
};

export type RowData = {
    machine: string;
    jobDate: string;
    jobDuration: string;
    location: string;
    plantCount: string;
    acres: string;
    status: string;
    workItemId: string;
}

export default function WorkItems() {

    const navigate = useNavigate();
    const organization = useAppSelector(selectOrganization)
    const initRowData: RowData[] = [];
    const [rowData, setRowData] = useState(initRowData);
    const [colDefs, setColDefs] = useState([
        {
            field: "machine",
            filter: true,
            flex: 1
        },
        {
            field: "jobDate",
            filter: true,
            flex: 1
        },
        {
            field: "jobDuration",
            flex: 1
        },
        {
            field: "location",
            flex: 1,
        },
        {
            field: "plantCount",
            headerName: "Crop Count",
            flex: 1,
            cellStyle: { 'textAlign': 'right', 'paddingRight': '3rem' }
        },
        {
            field: "acres",
            flex: 0.8,
            cellStyle: { 'textAlign': 'right', 'paddingRight': '3rem' }
        },
        {
            field: "status",
            filter: true,
            flex: 2.4,
            cellStyle: (params: any) => {
                if (params.value.toLowerCase() === 'completed') return { 'backgroundColor': 'green', 'color': 'white' };
                if (params.value.toLowerCase() === 'in progress') return { 'backgroundColor': 'lightgray', 'color': 'white' };
                if (params.value.toLowerCase() === 'warning') return { 'backgroundColor': 'orange', 'color': 'white' };
                return { 'backgroundColor': 'gray', 'color': 'white' };
            }
        },
        {
            field: "workItemId",
            hide: true
        }
    ]);

    const defaultColDef = useMemo(()=> ({ sortable: true, resizable: true }), []);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100vh" }), []);
    const gridStyle = useMemo(() => ({ width: "100%", height: "100vh" }), []);

    const workItems = useAppSelector(selectWorkItems);
    const dispatch = useAppDispatch();

    const handleCellClicked = useCallback((event: any) => {
        navigate(`/${organization}/workItems/${event.data.workItemId}`);
    }, [navigate, organization]);


    useEffect(() => {
        const rowData: RowData[] = [];
        if (workItems.data && workItems.data.length > 0) {
            workItems.data?.forEach((item) => {
                rowData.push({
                    machine: item.machine_name,
                    jobDate: `${new Date(item.start_time).toString().substring(4, 15)}`,
                    jobDuration: `${new Date(item.start_time).toString().substring(16, 21)}-${new Date(item.end_time).toString().substring(16, 21)}`,
                    location: `[${item.longitude.toFixed(4)}, ${item.latitude.toFixed(4)}]`,
                    plantCount: `${item.plant_count.toLocaleString()}`,
                    acres: `${item.acres.toFixed(2)}`,
                    status: item.job_status !== 'downloading' ? item.job_status : `${item.job_status} (${item.percent_downloaded}%)`,
                    workItemId: item.machine_use_id
                });
            })
            setRowData(rowData);
        } else {
            dispatch(fetchWorkItems());
        }
    }, []);

    useEffect(() => {
        const rowData: RowData[] = [];
        if (workItems.loading === 'loaded') {
            workItems.data?.forEach((item) => {
                rowData.push({
                    machine: item.machine_name,
                    jobDate: `${new Date(item.start_time).toString().substring(4, 15)}`,
                    jobDuration: `${new Date(item.start_time).toString().substring(16, 21)}-${new Date(item.end_time).toString().substring(16, 21)}`,
                    location: `[${item.longitude.toFixed(2)}, ${item.latitude.toFixed(2)}]`,
                    plantCount: `${item.plant_count.toLocaleString()}`,
                    acres: `${item.acres.toFixed(2)}`,
                    status: item.job_status !== 'downloading' ? item.job_status : `${item.job_status} (${item.percent_downloaded}%)`,
                    workItemId: item.machine_use_id,
                });
            });
            setRowData(rowData);
        }
        if (workItems.loading === 'failed') {
            console.log('fetchWorkItem() has failed.');
            navigate('/signin');
        }
    }, [workItems.loading])

    return (
        workItems.loading === 'loaded' ?
            <>
                <div style={containerStyle}>
                    <div style={gridStyle} className="ag-theme-alpine-dark">
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            headerHeight={28}
                            groupHeaderHeight={12}
                            animateRows={true}
                            onCellClicked={handleCellClicked}
                        />
                    </div>
                </div>
            </>
            :
            <ClipLoader
                color={'red'}
                size={100}
                cssOverride={{ display: "block", marginTop: "30vh", marginLeft: "35%" }}
            />
    );
}
