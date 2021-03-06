import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import * as _ from 'lodash';

const fetchCovid19Stats = async () => {
    const response = await axios.get('https://covid19.mathdro.id/api/deaths');
    return response.data;
}

const createDataTable = (statsObject: any, index: number) => {
    return (
        <tr key={index}>
            <td>{statsObject.category}</td>
            <td>{statsObject.confirmed}</td>
            <td>{statsObject.active}</td>
            <td>{statsObject.recovered}</td>
            <td>{statsObject.deaths}</td>
        </tr>
    );
}

export const DataTable = () => {

    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCovid19Stats();
            setStats(data);
        }
        fetchData();
    }, []);

    if (stats.length !== 0) {
        let data: any[] = [];
        let groupedData = _.groupBy(stats, 'iso2');
        _.keys(groupedData).forEach((key: any, index: number) => {
            if (key && key !== 'undefined') {
                const deathValue = _.sum(groupedData[key].map((country:any) => { return country.deaths; }));
                const activeValue = _.sum(groupedData[key].map((country:any) => { return country.active; }));
                const recoveredValue = _.sum(groupedData[key].map((country:any) => { return country.recovered; }));
                const confirmedValue = _.sum(groupedData[key].map((country:any) => { return country.confirmed; }));
                let dataItem: any = { category: key };
                dataItem["active"] = activeValue;
                dataItem["recovered"] = recoveredValue;
                dataItem["confirmed"] = confirmedValue;
                dataItem["deaths"] = deathValue;
                data.push(dataItem);
            }
        });

        data = _.sortBy(data, [(o:any) => { return o.confirmed; }]);
        data = _.orderBy(data, ['confirmed'],['desc']);
        return (
            <div className={"dataTable"}>
                <p style={{textAlign: "center", fontWeight:"bold", marginBottom:"0px"}}>COVID-19 Infections of the World in 2019-2020</p>
                <p style={{textAlign: "center"}}>source: Rapid APIs</p>
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>Country</th>
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