import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as _ from 'lodash';
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export const MapChart = () => {
    let chartObject: am4maps.MapChart;

    const fetchCovid19Stats = async () => {
        const response = await axios.get('https://covid19.mathdro.id/api/deaths');
        return response.data;
    }

    const prepare = async () => {
        const stats = await fetchCovid19Stats();
        let responseData: any[] = [];
        let mapData: any[] = [];

        stats.forEach((s: any, index: number) => {
            let dataItem: any = { 'id': s.iso2, 'name': s.combinedKey, 'value': s.deaths };
            responseData.push(dataItem);
        });

        let groupedData = _.groupBy(responseData, 'id');
        _.keys(groupedData).forEach((key: any, index: number) => {
            if (key && key !== 'undefined') {
                const deathValue = _.sum(groupedData[key].map((country) => { return country.value; }));
                let dataItem: any = { 'id': key, 'name': groupedData[key][0].name, 'value': deathValue, 'color': '#FF0000' };
                mapData.push(dataItem);
            }
        });

        console.log(mapData);
        visualize(mapData);

    }

    const visualize = (mapData:any[]) => {

        let chart = am4core.create("mapChartdiv", am4maps.MapChart);
        let title = chart.titles.create();
        title.text = "[bold font-size: 16]COVID-19 Infections of the World in 2019-2020[/]\nsource: Rapid APIs";
        title.textAlign = "middle";
        chartObject = chart;

        // Set map definition
        chartObject.geodata = am4geodata_worldLow;

        // Set projection
        chartObject.projection = new am4maps.projections.Miller();

        // Create map polygon series
        let polygonSeries = chartObject.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = ["AQ"];
        polygonSeries.useGeodata = true;
        polygonSeries.nonScalingStroke = true;
        polygonSeries.strokeWidth = 0.5;
        polygonSeries.calculateVisualCenter = true;

        let imageSeries = chartObject.series.push(new am4maps.MapImageSeries());
        imageSeries.data = mapData;
        imageSeries.dataFields.value = "value";

        let imageTemplate = imageSeries.mapImages.template;
        imageTemplate.nonScaling = true

        var circle = imageTemplate.createChild(am4core.Circle);
        circle.fillOpacity = 0.7;
        circle.propertyFields.fill = "color";
        circle.tooltipText = "{name}: [bold]{value}[/]";


        imageSeries.heatRules.push({
            "target": circle,
            "property": "radius",
            "min": 4,
            "max": 30,
            "dataField": "value"
        });

        imageTemplate.adapter.add("latitude", (latitude: any, target: any) => {
            const countryObject: any = target.dataItem.dataContext;
            var polygon = polygonSeries.getPolygonById(countryObject.id);

            if (polygon) {
                return polygon.visualLatitude;
            }
            return latitude;
        });

        imageTemplate.adapter.add("longitude", (longitude: any, target: any) => {
            const countryObject: any = target.dataItem.dataContext;
            var polygon = polygonSeries.getPolygonById(countryObject.id);
            if (polygon) {
                return polygon.visualLongitude;
            }
            return longitude;
        });
    }

    useEffect(() => {

       prepare();

    }, []);

    return (
        <div id="mapChartdiv" style={{ width: "100%", height: "500px" }}></div>
    )
}