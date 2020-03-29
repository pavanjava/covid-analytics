import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import * as _ from 'lodash';

const fetchCovid19Stats = async () => {
    const response = await axios.get('https://api.covid19india.org/data.json');
    response.data.statewise.shift();
    return response.data;
}

const createDataTable = (statsObject: any, index: number) => {
    return (
        <tr key={index}>
            <td>{statsObject.state}</td>
            <td>{statsObject.confirmed}</td>
            <td>{statsObject.active}</td>
            <td>{statsObject.recovered}</td>
            <td>{statsObject.deaths}</td>
        </tr>
    );
}

export const IndiaDataTable = () => {

    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCovid19Stats();
            setStats(data);
        }
        fetchData();
    }, []);

    if (!_.isEmpty(stats)) {
        let data: any = stats;
        return (
            <div className={"dataTable"}>
                <p style={{textAlign: "center", fontWeight:"bold", marginBottom:"0px"}}>COVID-19 Infections of India in 2019-2020</p>
                <p style={{textAlign: "center"}}>source: covid19india APIs  </p>
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Confirmed</th>
                            <th>Active</th>
                            <th>Recovered</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.statewise.map(createDataTable)}
                    </tbody>
                </Table>
            </div>
        );

    } else {

        return <div>Loading...</div>
    }

}