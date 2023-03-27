import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as geojson from 'geojson';

import { MachinePositionTimestamped } from '../routes/WorkItemDetails';

import '../css/WorkItemDetails.css';
import 'mapbox-gl/dist/mapbox-gl.css';

type MachinePosProperties = {
	machineId: string;
	ts: Date | null;
};

export default function Map(props: {
	machineId: string;
	lng: number;
	lat: number;
	path: MachinePositionTimestamped[];
}) {

	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map>();
	const [zoom, setZoom] = useState(12);

	const machinePosGeojson: geojson.Feature<geojson.Point, MachinePosProperties> = {
		type: "Feature",
		geometry: {
			coordinates: [props.lng, props.lat],
			type: "Point"
		},
		properties: {
			machineId: props.machineId.slice(11),
			ts: (props.path.length > 0) ? props.path[props.path.length - 1].ts : null
		}
	};

	const machinePathCoordinates: geojson.Position[] = [];
	props.path.map((pos: MachinePositionTimestamped) => {
		machinePathCoordinates.push([pos.lng, pos.lat])
	});

	const machinePathGeojson: geojson.Feature<geojson.LineString, MachinePosProperties> = {
		type: "Feature",
		geometry: {
			coordinates: machinePathCoordinates,
			type: "LineString"
		},
		properties: {
			machineId: props.machineId.slice(11),
			ts: (props.path.length > 0) ? props.path[props.path.length - 1].ts : null
		}
	};

	mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? process.env.REACT_APP_MAPBOX_ACCESS_TOKEN : '';

	useEffect(() => {
		if (props.lng === 0)
			return;
			
        map.current = new mapboxgl.Map({
            container: mapContainer.current ? mapContainer.current : 'mapContainer',
			style: process.env.REACT_APP_MAPBOX_SATELLITE_BASEMAP_URL ? process.env.REACT_APP_MAPBOX_SATELLITE_BASEMAP_URL : '',
            center: [props.lng, props.lat],
            zoom: zoom
        }); 

		map.current?.addControl(new mapboxgl.NavigationControl(), 'top-left');
		map.current?.addControl(new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'imperial' }), 'bottom-left');

		map.current?.on("load", () => {
			map.current?.addSource('machine-pos', {
				'type': 'geojson',
				'data': machinePosGeojson
			});
			map.current?.addSource('machine-path', {
				'type': 'geojson',
				'data': machinePathGeojson
			});
			map.current?.addLayer({
				'id': 'machine-pos-circle',
				'type': 'circle',
				'source': 'machine-pos',
				'layout': {
					'visibility': 'visible'
				},
				'paint': {
					'circle-radius': 12,
					'circle-color': '#ff0000',
					/*
										'circle-color': [
						'step',
						['get', 'age_sec'],
						'rgb(255,0,0)',
						60, 'rgb(102,0,51)',
						3600, 'rgb(51,0,26)',
						14400, 'rgb(0,0,0)'
					],
										*/
					'circle-opacity': 1,
					'circle-stroke-color': '#ffffff',
					'circle-stroke-width': 3
				}
			});
			map.current?.addLayer({
				'id': 'machine-pos-symbol',
				'type': 'symbol',
				'source': 'machine-pos',
				'layout': {
					'visibility': 'visible',
					'text-field': ['get', 'machineId'],
					'text-size': 14
				},
				'paint': {
					'text-color': '#fff'
				}
			});
			map.current?.addLayer({
				'id': 'machine-path-line',
				'type': 'line',
				'source': 'machine-path',
				'layout': {
					'visibility': 'visible',
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#ff8000',
					'line-width': [
						'interpolate',
						['exponential', 2],
						['zoom'],
						14, 7,
						22, 7
					],
					'line-opacity': [
						'interpolate',
						['linear'],
						['zoom'],
						14, 0.4,
						22, 1
					]
				}
			});
			setZoom(12.1);
		});
	});

	return (
		<div id="mapContainer" ref={mapContainer} style={{ width: "100%", height: "100%" }} />
	);
}
