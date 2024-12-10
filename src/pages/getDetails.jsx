import React from "react";
import { Button, TextField, Paper, Box, Link } from "@mui/material";
import './getDetails.scss';
import { useState } from "react";
import Papa from 'papaparse'; // CSV parsing library
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';

function GetDetails() {

    const [functions, setFunctions] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const baseSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuWARY0Y8KpEDf7LCiMwg1cSNht-Jp_VcPj5cFr5P6DIDVVtddyenn89OKwu7Guc3x5KIAuQa7gnIa/pub?gid=319284677&single=true&output=csv';
    const fetchData = (name, phone) => {
        const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
        fetch(sheetUrl)
            .then((response) => response.text())
            .then((data) => {
                Papa.parse(data, {
                    header: true,
                    complete: (results) => {
                        // Filter the parsed data based on name and phone
                        const filteredData = results.data.filter((row) => {
                            const isNameMatch = name
                                ? row.Name && row.Name.toLowerCase() === name.toLowerCase()
                                : true; // If name is not provided, skip filtering by name
                            const isPhoneMatch = phone
                                ? row["Phone number"] &&
                                row["Phone number"].toLowerCase() === phone.toLowerCase()
                                : true; // If phone is not provided, skip filtering by phone
                            return isNameMatch && isPhoneMatch;
                        });

                        if (filteredData.length === 0) {
                            // No data found for the given name and phone
                            alert("No function booked by this name and phone number.");
                        }

                        setFunctions(filteredData); // Update state with the filtered data
                        setIsLoading(false);
                    },
                });
            })
            .catch((error) => { 
                console.error("Error fetching or parsing data:", error);
                setIsLoading(false);
            });
    };

    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        phone: ""
    });

    const validateName = (name) => {
        const newErrors = { ...formErrors };

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            newErrors.name = "Enter a valid name";
        } else {
            newErrors.name = "";
        }

        setFormErrors(newErrors);
    };
    const validatePhoneNumber = (phone) => {
        const newErrors = { ...formErrors };

        if (phone.trim() === "") {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        } else {
            newErrors.phone = "";
        }

        setFormErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = { ...formErrors };

        // Validation for Name
        if (formData.name.trim() === "") {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = "Enter a valid name";
        } else {
            newErrors.name = "";
        }

        // Validation for Phone
        if (formData.phone.trim() === "") {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        } else {
            newErrors.phone = "";
        }

        setFormErrors(newErrors);

        // Check if there are no errors in the newErrors object
        const isValid = Object.values(newErrors).every((error) => error === "");

        return isValid;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            fetchData(formData.name, formData.phone);
        }
    };
    return (
        <div className="getDetails_container">
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                        width: 575,
                    },
                }}
            >
                {functions.length > 0
                    ?
                    <TableContainer component={Paper} className="table_view">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Date</TableCell>
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
                    :
                    <Paper
                        elevation={10}
                    >
                        <div className="form_head">
                            Booking Details
                        </div>
                        <div className="form_fields">
                            <label className="labels">Name</label>
                            <TextField
                                className="field"
                                placeholder="Your Name"
                                variant="standard"
                                name='name'
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    validateName(e.target.value);
                                }}
                            />
                            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                        </div>

                        <div className="form_fields">
                            <label className="labels">Phone Number</label>
                            <TextField
                                type="tel"
                                className="field"
                                placeholder="9999xxxxxx"
                                variant="standard"
                                name='phone'
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({ ...formData, phone: e.target.value });
                                    validatePhoneNumber(e.target.value);
                                }}
                            />
                            {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                        </div>
                        <div className="get_details">
                            <Button variant="contained"
                                onClick={(e)=>{
                                    handleSubmit(e);
                                }}
                                type='submit'
                            >
                                {isLoading?<CircularProgress color='#970747' />:'Get Details'}
                            </Button>
                        </div>
                        <div className="back_to_booking">
                            Not booked a function yet?
                            <Link href='/booking'>
                                Book now
                            </Link>
                        </div>
                    </Paper>
                }
            </Box>
        </div>
    )
}

export default GetDetails;