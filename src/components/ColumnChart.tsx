import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as _ from 'lodash';
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export const ColumnChart = () => {
    let chartObject: am4charts.XYChart;

    const fetchCovid19Stats = async () => {
        const response = await axios.get('https://covid19.mathdro.id/api/deaths');
        return response.data;
    }

    const createSeries = async (values: any) => {

        const stats = await fetchCovid19Stats();
        let data: any[] = [];

        let groupedData = _.groupBy(stats, 'iso2');
        _.keys(groupedData).forEach((key: any, index: number) => {
            if (key && key !== 'undefined') {
                const deathValue = _.sum(groupedData[key].map((country) => { return country.deaths; }));
                const activeValue = _.sum(groupedData[key].map((country) => { return country.active; }));
                const recoveredValue = _.sum(groupedData[key].map((country) => { return country.recovered; }));
                const confirmedValue = _.sum(groupedData[key].map((country) => { return country.confirmed; }));
                let dataItem: any = { category: key };
                dataItem["active"] = activeValue;
                dataItem["recovered"] = recoveredValue;
                dataItem["confirmed"] = confirmedValue;
                dataItem["deaths"] = deathValue;
                data.push(dataItem);
            }
        });

        data = _.sortBy(data, [(o) => { return o.category; }]);
        chartObject.data = data;

        values.forEach((value: string) => {
            let series = chartObject.series.push(new am4charts.LineSeries());
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

    useEffect(() => {
        let chart = am4core.create('columnChartdiv', am4charts.XYChart);
        let title = chart.titles.create();
        title.text = "[bold font-size: 16]COVID-19 Infections of the World in 2019-2020[/]\nsource: Rapid APIs";
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
        <div id="columnChartdiv" style={{ width: "100%", height: "500px" }}></div>
    )
}
