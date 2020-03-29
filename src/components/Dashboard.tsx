import React from 'react';
import Container from 'react-bootstrap/Container';
import { ColumnChart } from './ColumnChart';
import { DataTable } from './DataTable';
import { MapChart } from './MapChart';
import { Footer } from './Footer';
import { IndiaDataOverAll } from './india-analytics/PieChart';
import { IndiaColumnChart } from './india-analytics/ColumnChart';
import { IndiaDataTable } from './india-analytics/DataTable';

export const Dashboard = () => {
    return (
        <Container className="col-12">
            <div className="col-12">
                <div className="line-graph">
                    <ColumnChart />
                </div>
                <div className="col-6 data-table">
                    <DataTable />
                </div>
                <div className="col-6 donut-graph">
                    <MapChart />
                </div>
                <div className="col-6" style={{float:"left"}}>
                    <IndiaDataOverAll />
                </div>
                <div className="col-6" style={{float:"left"}}>
                    <IndiaColumnChart />
                </div>
                <div className="col-12 data-table" >
                    <IndiaDataTable />
                </div>
            </div>
        </Container>
    )
}