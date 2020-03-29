import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import * as _ from 'lodash';

export const DataTable = () => {

    const [stats, setStats] = useState([]);

    const fetchCovid19Stats = async () => {
        const response = await axios.get('https://covid19.mathdro.id/api/deaths');
        return response.data;
    }

    const createDataTable = (statsObject: any, index: number) => {
        return (
            <tr key={index}>
                <td>{statsObject.countryRegion}</td>
                <td>{statsObject.provinceState}</td>
                <td>{statsObject.confirmed}</td>
                <td>{statsObject.active}</td>
                <td>{statsObject.recovered}</td>
                <td>{statsObject.deaths}</td>
            </tr>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCovid19Stats();
            setStats(data);
        }
        fetchData();
    }, []);

    if (stats.length !== 0) {
        const data = _.sortBy(stats, ['countryRegion','confirmed']);
        return (
            <div className={"dataTable"}>
                <p style={{textAlign: "center", fontWeight:"bold", marginBottom:"0px"}}>COVID-19 Infections of the World in 2019-2020</p>
                <p style={{textAlign: "center"}}>source: Rapid APIs</p>
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>State Province</th>
                            <th>Confirmed</th>
                            <th>Active</th>
                            <th>Recovered</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(createDataTable)}
                    </tbody>
                </Table>
            </div>

        );

    } else {

        return <div>Loading...</div>
    }

}