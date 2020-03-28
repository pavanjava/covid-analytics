import React, { useEffect } from 'react';

export const DataTable = () => {


    useEffect(() => {

    }, []);

    return (
        <table style={{}}>
            <thead>
                <tr>
                    <td>Country</td>
                    <td>Confirmed</td>
                    <td>Active</td>
                    <td>Recovered</td>
                    <td>Deaths</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>india</td>
                    <td>932</td>
                    <td>822</td>
                    <td>84</td>
                    <td>20</td>
                </tr>
            </tbody>

        </table>
    )
}