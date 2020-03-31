import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
let chartObject: am4charts.PieChart;

const fetchCovid19Stats = async () => {
    const response = await axios.get('https://api.covid19india.org/data.json');
    return response.data;
}

const drawPieChart = (data: any) => {

    // Add data
    chartObject.data = [
        { "sector": "Confirmed", "size": data.statewise[0].confirmed, "color": am4core.color("#FFA500") },
        { "sector": "active", "size": data.statewise[0].active,"color": am4core.color("#FFFF00") },
        { "sector": "recovered", "size": data.statewise[0].recovered, "color": am4core.color("#008000")},
        { "sector": "deaths", "size": data.statewise[0].deaths, "color": am4core.color("#FF0000") }
    ];

    // Add label
    chartObject.innerRadius = 100;
    var label = chartObject.seriesContainer.createChild(am4core.Label);
    label.text = "Covid-19 India";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 16;

    // Add and configure Series
    var pieSeries = chartObject.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "size";
    pieSeries.dataFields.category = "sector";
    pieSeries.slices.template.propertyFields.fill = "color";
}

export const IndiaDataOverAll = () => {

    useEffect(() => {
        // Create chart instance
        var chart = am4core.create("pieChartdiv", am4charts.PieChart);
        let title = chart.titles.create();
        title.text = "[bold font-size: 16]COVID-19 Infections of india in 2019-2020[/]\nsource: covig19india APIs";
        chartObject = chart;
        const fetchData = async () => {
            const data = await fetchCovid19Stats();
            drawPieChart(data);
        }
        fetchData();
    }, []);

    return <div id="pieChartdiv" style={{ width: "100%", height: "500px" }}></div>

}