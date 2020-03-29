import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as _ from 'lodash';
import axios from 'axios';

am4core.useTheme(am4themes_animated);
let chartObject: am4charts.XYChart;

const fetchCovid19Stats = async () => {
    const response = await axios.get('https://api.covid19india.org/data.json');
    return response.data;
}

const createSeries = async (values: any) => {

    const stats = await fetchCovid19Stats();
    let data: any = [];
    stats.statewise.shift();
    stats.statewise.forEach((state:any, index: number) => {
        let dataItem: any = { category: state.state };
        dataItem["active"] = state.active;
        dataItem["recovered"] = state.recovered;
        dataItem["confirmed"] = state.confirmed;
        dataItem["deaths"] = state.deaths;
        data.push(dataItem);
    })

    data = _.sortBy(data, [(o) => { return o.confirmed; }]);
    data = _.orderBy(data,['confirmed'],['desc']);
    chartObject.data = data;

    values.forEach((value: string) => {
        let series = chartObject.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'category'
        series.tooltipText = _.capitalize(value)+": {valueY.value}";
        series.name = value;

        chartObject.scrollbarX = new am4charts.XYChartScrollbar();
        chartObject.scrollbarX.parent = chartObject.bottomAxesContainer;

        chartObject.cursor = new am4charts.XYCursor();
        chartObject.cursor.lineY.disabled = true;
        chartObject.cursor.lineX.disabled = true;

        return series;

    });
}

export const IndiaColumnChart = () => {

    useEffect(() => {
        let chart = am4core.create('IndiaColumnChartdiv', am4charts.XYChart);

        let title = chart.titles.create();
        title.text = "[bold font-size: 16]COVID-19 Infections of india in 2019-2020[/]\nsource: covig19india APIs";
        chartObject = chart;
        chart.colors.step = 2;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'category'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.tooltip!.disabled = true;
        yAxis.min = 0;

        createSeries(['active', 'recovered', 'confirmed', 'deaths']);


    }, []);

    return (
        <div id="IndiaColumnChartdiv" style={{ width: "100%", height: "500px" }}></div>
    )
}
