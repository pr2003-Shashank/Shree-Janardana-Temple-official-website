import React from "react";
import "./functionsView.scss";
import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from "@mui/material";
import Paper from '@mui/material/Paper';
import Papa from 'papaparse'; // CSV parsing library


function FunctionView() {
    const [functions, setFunctions] = useState([]);

    const baseSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuWARY0Y8KpEDf7LCiMwg1cSNht-Jp_VcPj5cFr5P6DIDVVtddyenn89OKwu7Guc3x5KIAuQa7gnIa/pub?gid=319284677&single=true&output=csv';
    const fetchData = () => {
        const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
        fetch(sheetUrl)
            .then(response => response.text())
            .then(data => {
                Papa.parse(data, {
                    header: true,
                    complete: (results) => {
                        setFunctions(results.data);
                    },
                });
            })
            .catch(error => console.error('Error fetching or parsing data:', error));
    };

    useEffect(() => {
        // Fetch data when the component mounts
        fetchData();
    }, [])

    return (
        <div className="functions-container">
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%'}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Email address</TableCell>
                            <TableCell align="right">Phone number</TableCell>
                            <TableCell align="right">Number of people</TableCell>
                            <TableCell align="right">Quotation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {functions.map((row) => (
                            <TableRow
                                key={row.Name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.Name}</TableCell>
                                <TableCell align="right">{row.Date}</TableCell>
                                <TableCell align="right">{row["Email address"]}</TableCell>
                                <TableCell align="right">{row["Phone number"]}</TableCell>
                                <TableCell align="right">{row["Number of people"]}</TableCell>
                                <TableCell align="right">
                                <Button
                                onClick={() => window.open(row.Quotation, '_blank')}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Open PDF
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}

export default FunctionView;
