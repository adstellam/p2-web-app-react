import React, { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem } from '@mui/material';
import * as d3 from 'd3';

import { WorkItem, Histogram } from '../routes/WorkItemDetails';
import '../css/CropCountBarChart.css';

export default function CropCountBarChart(props: {
    workItem: WorkItem;
}) {
    const [chartType, setChartType] = useState('size');
    const [unit, setUnit] = useState('inch');
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);
    const [selectedPlantCount, setSelectedPlantCount] = useState(0);
    const [selectedPlantPercentage, setSelectedPlantPercentage] = useState(0);

    const d3Container = useRef<HTMLDivElement>(null);

    const chartTypeChoices = ['size', 'spacing'];
    const unitChoices = ['inch', 'cm'];

    const handleChartTypeChange = (event: any) => {
        event.preventDefault();
        setChartType(event.target.value);
    };

    const handleUnitChange = (event: any) => {
        event.preventDefault();
        setUnit(event.target.value);
    };

    const normalizeData = (histogram: Histogram, trimPercent = 0.001) => {
        const normalizedSizes: {
            diamRange: number;
            value: number;
            frontColor: string;
        }[] = [];
        try {
            let startingPoint = 0;
            let maxSize = 0;
            // Count the total number of plants in y
            const totalPlants = histogram.y.reduce((a, b) => a + b, 0);
            // Roll up the top 5% of the data into a single bin
            const cutoffPlants = Math.round(totalPlants * trimPercent);
            // Iterate through y and find the cutoff point
            let cutoffSum = 0;
            for (let i = histogram.y.length - 1; i >= 0; i--) {
                cutoffSum += histogram.y[i];
                if (cutoffSum >= cutoffPlants) {
                    maxSize = i;
                    break;
                }
            }
            for (let i = 0; i < histogram.y.length; i++) {
                if (histogram.y[i] !== 0) {
                    if (i === 0) {
                        startingPoint = 0;
                        break
                    }
                    startingPoint = i - 2;
                    break;
                }
            }
            for (let i = startingPoint; i < maxSize; i++) {
                if (histogram.x[i] === undefined || histogram.y[i] === undefined) continue
                normalizedSizes.push({
                    diamRange: histogram.x[i],
                    value: histogram.y[i],
                    frontColor: 'orange'
                });
            }
            // Add the last bin
            normalizedSizes.push({
                diamRange: histogram.x[maxSize],
                value: cutoffSum,
                frontColor: 'orange'
            })
        } catch (error) {
            return normalizedSizes;
        }
        return normalizedSizes;
    }

    const renderGraph = (data: {
        diamRange: number;
        value: number;
        frontColor: string;
    }[]) => {
        const axisTranslateX = 30;
        const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.4);
        const yScale = d3.scaleLinear().range([chartHeight, 0]);
        const svg = d3.select(d3Container.current).append("svg")
            .attr("viewBox", `0, 0, ${chartWidth}, ${chartHeight}`);
        const axis = svg.append("g")
            .attr("transform", `translate(${axisTranslateX}, -40)`)
            .attr("color", "#333333");
        xScale.domain(data.map((entry) => entry.diamRange ? entry.diamRange.toString() : ''));
        yScale.domain([0, d3.max(data, (entry) => entry.value) as number]);
        // X axis formatting
        axis.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", chartHeight + 100)
            .attr("x", chartWidth)
            .attr("text-anchor", "end")
            .attr("stroke", "gray");
        axis.selectAll("text")
            .attr("transform", "rotate(-90)translate(-20, -12)")
        // Y axis formatting
        axis.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(tick => {
                if (tick >= 1000) {
                    // Abbreviate numbers larger than 1000 for y axis
                    // Example 3000 to 3k
                    return (tick as number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                }
                return `${tick}`;
            }))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.1em")
            .attr("text-anchor", "end");
        axis.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (entry) => xScale(entry.diamRange ? entry.diamRange.toString() : '0') as number)
            .attr("y", (entry) => yScale(entry.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (entry) => chartHeight - yScale(entry.value))
            .attr("fill", 'orange');
        //
        const brush = d3.brushX()
            .extent([[axisTranslateX, 0], [chartWidth, chartHeight - 40]])
            .on("end", (event: d3.D3BrushEvent<MouseEvent>) => {
                const selection = event.selection;
                if (!event.sourceEvent) {
                    return;
                }
                if (!selection) {
                    setSelectedPlantCount(props.workItem.cropCount);
                    setSelectedPlantPercentage(100);
                    return;
                }
                const selectedBars = data.filter((d) => {
                    if (xScale(`${d.diamRange}`) as number >= (selection[0] as number) - axisTranslateX && (xScale(`${d.diamRange}`) as number <= (selection[1] as number) - axisTranslateX)) {
                        return true;
                    }
                    return false;
                });
                if (selectedBars) {
                    const selectedPlants = selectedBars.reduce((prev, current) => {
                        return prev + current.value;
                    }, 0);
                    setSelectedPlantCount(selectedPlants)
                    setSelectedPlantPercentage((selectedPlants / props.workItem.cropCount) * 100)
                } else {
                    //svg.select(".brush").call(brush.clear);
                    setSelectedPlantCount(props.workItem.cropCount);
                    setSelectedPlantPercentage(100);
                }
            });

        svg.append("g")
            .attr("class", "brush")
            .call(brush);

    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            setChartWidth(d3Container.current ? d3Container.current.clientWidth : 0);
            setChartHeight(d3Container.current ? d3Container.current.clientHeight : 0);
        });
        window.dispatchEvent(new Event('resize'));
    }, []);

    useEffect(() => {
        if (chartWidth > 0 && chartHeight > 0 && props.workItem.plantSizeInch.x.length > 0 && props.workItem.plantSizeInch.y.length > 0) {
            d3.selectAll("#d3Container > *").remove();
            if (chartType === 'size') {
                if (unit === 'cm') {
                    renderGraph(normalizeData(props.workItem.plantSizeMeter))
                } else {
                    renderGraph(normalizeData(props.workItem.plantSizeInch))
                }
            }
            if (chartType === 'spacing') {
                if (unit === 'cm') {
                    renderGraph(normalizeData(props.workItem.plantSpacingMeter, 0.1))
                } else
                    renderGraph(normalizeData(props.workItem.plantSpacingInch, 0.1))
            } 
        } 
    }, [chartType, unit, chartWidth, chartHeight]);

    return (
        <div>
            <div id="chart-data-selector">
                <TextField
                    label="Crop Count Chart Type"
                    size="small"
                    sx={{ width: 200 }}
                    select
                    value={chartType}
                    onChange={handleChartTypeChange}
                >
                    {chartTypeChoices.map((item) => (
                        <MenuItem key={item} value={item}>By {item}</MenuItem>
                    ))};
                </TextField>
                <TextField
                    label="Size|Spacing unit"
                    size="small"
                    sx={{ width: 200 }}
                    select
                    value={unit}
                    onChange={handleUnitChange}
                >
                    {unitChoices.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))};
                </TextField>
            </div>

            <div id="d3Container" ref={d3Container} style={{ width:"100%", height:"40vh" }} />

            <div id="brush-area-props">
                <div className="brush-area-props-item">
                    <div className="brush-area-props-item-label">Selected Plants:</div>
                    <div className="brush-area-props-item-value">{selectedPlantCount.toLocaleString()}</div>
                </div>
                <div className="brush-area-props-item">
                    <div className="brush-area-props-item-label">Percent:</div>
                    <div className="brush-area-props-item-value">{selectedPlantPercentage.toFixed(1)}%</div>
                </div>
            </div>
        </div>

    );
}