import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { fetchWorkItemDetails } from '../features/workItemDetails/workItemDetailsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWorkItemDetails } from '../features/workItemDetails/workItemDetailsSlice';

import Map from '../components/Map';
import CropCountBarChart from '../components/CropCountBarChart';
import Direction from '../components/Direction';
import '../css/WorkItemDetails.css';

export type Histogram = {
    x: number[];
    y: number[];
};
export type MachinePositionTimestamped = {
    lng: number;
    lat: number;
    ts: Date;
};

export type MachineUseData = {
    machine_use_id: string;
    machine_name: string;
    start_time: string;
    end_time: string;
    gps_time: string;
    detected_commodity_type: string;
    acres: number;
    plant_count: number;
    distance: number;
    latitude: number;
    longitude: number;
    path?: MachinePositionTimestamped[];
    job_status: string;
    percent_downloaded: number;
    camera_count: number;
    camera_use_count: number;
    plant_size_meter: Histogram;
    plant_size_inch: Histogram;
    plant_spacing_meter: Histogram;
    plant_spacing_inch: Histogram;
    speed: { epoch_time_meters: string[]; speed_meter_second: number[] }
};

export type WorkItem = {
    machineUseId: string;
    jobName: string;
    machineId: string;
    jobDate?: string;
    startTime?: string;
    endTime?: string;
    detectedCommodityType?: string;
    acres?: number;
    cropCount: number;
    distance?: number;
    latitude: number;
    longitude: number;
    path: MachinePositionTimestamped[];
    jobStatus?: string;
    plantSizeMeter: Histogram;
    plantSizeInch: Histogram;
    plantSpacingMeter: Histogram;
    plantSpacingInch: Histogram;
};


export default function WorkItemDetails() {
    
    const initWorkItem: WorkItem = {
        machineUseId: '',
        jobName: '',
        machineId: '',
        cropCount: 0,
        longitude: 0,
        latitude: 0,
        path: [],
        plantSizeMeter: {
            x: [],
            y: []
        },
        plantSizeInch: {
            x: [],
            y: []
        },
        plantSpacingMeter: {
            x: [],
            y: []
        },
        plantSpacingInch: {
            x: [],
            y: []
        },
    };

    const navigate = useNavigate();
    const { workItemId } = useParams();

    const [workItem, setWorkItem] = useState(initWorkItem);
    const [jobStatusBackgroundColor, setJobStatusBackgroundColor] = useState('#fff');

    const workItemDetails = useAppSelector(selectWorkItemDetails);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchWorkItemDetails(workItemId));
    }, []);

    useEffect(() => {
        if (workItemDetails.loading === 'loaded') {
            setWorkItem({
                machineUseId: workItemDetails.data?.machine_use_id ? workItemDetails.data?.machine_use_id : '',
                jobName: workItemDetails.data?.machine_use_id ? workItemDetails.data?.machine_use_id : '',
                machineId: workItemDetails.data?.machine_name ? workItemDetails.data?.machine_name : '',
                jobDate: workItemDetails.data?.start_time ? new Date(workItemDetails.data?.start_time).toLocaleString().split(', ')[0] : '',
                startTime: workItemDetails.data?.start_time ? new Date(workItemDetails.data.start_time).toLocaleString().split(', ')[1] : '',
                endTime: workItemDetails.data?.end_time ? new Date(workItemDetails.data.end_time).toLocaleString().split(', ')[1] : '',
                detectedCommodityType: workItemDetails.data?.detected_commodity_type,
                acres: workItemDetails.data?.acres,
                cropCount: workItemDetails.data?.plant_count ? workItemDetails.data?.plant_count : 0,
                longitude: workItemDetails.data?.longitude ? workItemDetails.data?.longitude : 0,
                latitude: workItemDetails.data?.latitude ? workItemDetails.data?.latitude : 0,
                path: workItemDetails.data?.path ? workItemDetails.data?.path :
                    [
                        { lng: workItemDetails.data?.longitude ? workItemDetails.data?.longitude - 0.02 : 0, lat: workItemDetails.data?.latitude ? workItemDetails.data?.latitude - 0.03 : 0, ts: new Date() },
                        { lng: workItemDetails.data?.longitude ? workItemDetails.data?.longitude - 0.01: 0, lat: workItemDetails.data?.latitude ? workItemDetails.data?.latitude - 0.02 : 0, ts: new Date() },
                        { lng: workItemDetails.data?.longitude ? workItemDetails.data?.longitude: 0, lat: workItemDetails.data?.latitude ? workItemDetails.data?.latitude: -0, ts: new Date() }
                    ],
                distance: workItemDetails.data?.distance,
                jobStatus: workItemDetails.data?.job_status !== 'downloading' ? workItemDetails.data?.job_status : `${workItemDetails.data?.job_status} (${workItemDetails.data?.percent_downloaded}%)`,
                plantSizeMeter: {
                    x: workItemDetails.data?.plant_size_meter.x ? workItemDetails.data?.plant_size_meter.x.map((value: number) => Math.round(value * 100)) : [],
                    y: workItemDetails.data?.plant_size_meter.y ? workItemDetails.data?.plant_size_meter.y : [],
                },
                plantSizeInch: {
                    x: workItemDetails.data?.plant_size_inch.x ? workItemDetails.data?.plant_size_inch.x : [],
                    y: workItemDetails.data?.plant_size_inch.y ? workItemDetails.data?.plant_size_inch.y : [],
                },
                plantSpacingMeter: {
                    x: workItemDetails.data?.plant_spacing_meter.x ? workItemDetails.data?.plant_spacing_meter.x.map((value: number) => Math.round(value * 100)) : [],
                    y: workItemDetails.data?.plant_spacing_meter.x ? workItemDetails.data?.plant_spacing_meter.y : [],
                },
                plantSpacingInch: {
                    x: workItemDetails.data?.plant_spacing_inch.x ? workItemDetails.data?.plant_spacing_inch.x : [],
                    y: workItemDetails.data?.plant_spacing_inch.y ?workItemDetails.data?.plant_spacing_inch.y : [],
                }
            });
            switch (workItemDetails.data?.job_status) {
                case 'completed': setJobStatusBackgroundColor('green'); break;
                case 'warning': setJobStatusBackgroundColor('orange'); break;
                case 'in progress': setJobStatusBackgroundColor('lightgray'); break;
                default: setJobStatusBackgroundColor('gray');
            }
        } 
        if (workItemDetails.loading === 'failed') {
            console.log('fetchWorkItemDetails() has failed.');
            navigate('/signin');
        }
    }, [workItemDetails.loading]);


    return (
        workItemDetails.loading === 'loaded' ?
        <>
            <div id="workitem-details-screen-grid" >

                <div id="map-area">
                    { workItem.longitude === 0 && workItem.latitude === 0 ?
                        <div style={{ width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center" }}>
                            <div >Machine location information not available.</div>
                        </div>
                    :
                        <Map machineId={workItem.machineId} lng={workItem.longitude} lat={workItem.latitude} path={workItem.path} />
                }
                </div>

                <div id="workitem-details-area">
                    <div id="workitem-desc-section">
                        <div className="desc-item">
                            <div className="desc-item-label">Machine:</div>
                            <div className="desc-item-value">{workItem.machineId}</div>
                        </div>
                        <div className="desc-item">
                            <div className="desc-item-label">Date:</div>
                            <div className="desc-item-value">{workItem.jobDate}</div>
                        </div>
                        <div className="desc-item">
                            <div className="desc-item-label">Start:</div>
                            <div className="desc-item-value">{workItem.startTime}</div>
                        </div>
                        <div className="desc-item">
                            <div className="desc-item-label">End:</div>
                            <div className="desc-item-value">{workItem.endTime}</div>
                        </div>
                    </div>

                    <div id="workitem-status-section" style={{ backgroundColor: jobStatusBackgroundColor }}>
                        <div className="workitem-status-label">Status:</div>
                        <div className="workitem-status-value">{workItem.jobStatus}</div>
                    </div>

                    <div id="direction-section">
                        <Direction latitude={workItem.latitude} longitude={workItem.longitude} />
                        <span style={{display:"inline-block", marginLeft:"0.4rem"}}>Show Directions</span>
                    </div>

                    <div id="workitem-metrics-section">
                        <div className="metric-item">
                            <div className="metric-item-label">Total Plant Count</div>
                            <div className="metric-item-value">{workItem.cropCount !== 0 ? workItem.cropCount.toLocaleString() : ''}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-item-label">Commodity</div>
                            <div className="metric-item-value">{workItem.detectedCommodityType}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-item-label">Plant Count Per Acre</div>
                            <div className="metric-item-value">{workItem.cropCount && workItem.acres ? Math.round(workItem.cropCount / workItem.acres).toLocaleString() : ''}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-item-label">Acres</div>
                            <div className="metric-item-value">{workItem.acres ? workItem.acres.toFixed(2) : ''}</div>
                        </div>
                    </div>
                    
                    <div id="crop-count-bar-chart-section"> 
                        <CropCountBarChart workItem={workItem}/>
                    </div>
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
