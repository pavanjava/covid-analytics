import React from 'react';
import Container from 'react-bootstrap/Container';
import {ColumnChart} from './ColumnChart';
import {DataTable} from './DataTable';
import { MapChart } from './MapChart';
import { Footer } from './Footer';

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
            </div>
            <Footer />
        </Container>
    )
}