import React from "react";
import "./functionsView.scss";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useState, useEffect } from "react";
import { Button, Paper, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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

    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&::before': {
            display: 'none',
        },
    }));

    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
            {...props}
        />
    ))(({ theme }) => ({
        backgroundColor: 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
        {
            transform: 'rotate(90deg)',
        },
        [`& .${accordionSummaryClasses.content}`]: {
            marginLeft: theme.spacing(1),
        },
        ...theme.applyStyles('dark', {
            backgroundColor: 'rgba(255, 255, 255, .05)',
        }),
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));

    const [expanded, setExpanded] = React.useState(0);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div className="functions-container">
            <Paper elevation={10} className="display_container">
                <div className="top_container">
                    <Typography>List of Functions</Typography>
                </div>
                {functions.map((row, index) => (
                    <Accordion expanded={expanded === index} onChange={handleChange(index)}>
                        <AccordionSummary aria-controls="panel-content" id="panel-header">
                            <Typography className="panel_index">{index + 1}</Typography>
                            <Typography className="panel_header">{row.Name}, {row.Date}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="details_container">
                                <div className="list_container">
                                    <Typography className='list_title'><strong>Contact info</strong></Typography>
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItem >
                                            <ListItemText>
                                                <strong>Name:</strong> {row.Name}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem >
                                            <ListItemText>
                                                <strong>Phone no:</strong> {row['Phone number']}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem >
                                            <ListItemText>
                                                <strong>Email</strong>: {row['Email address'] || 'NA'}
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </div>
                                <div className="list_container">
                                    <Typography className='list_title'><strong>Function details</strong></Typography>
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItem >
                                            <ListItemText>
                                                <strong>Date</strong>: {row.Date}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem >
                                            <ListItemText>
                                                <strong>No. of People</strong>: {row['Number of people'] || 'NA'}
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </div>
                                <div className="list_container">
                                    <Typography className='list_title'><strong>Quotation</strong></Typography>
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItem >
                                            <Button
                                                onClick={() => window.open(row.Quotation, '_blank')}
                                                endIcon={<PictureAsPdfIcon />}
                                            >
                                                View Quotation
                                            </Button>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                            <Divider
                                orientation='horizontal'
                                flexItem
                                className='divider'
                            />
                        </AccordionDetails>
                    </Accordion>
                )
                )
                }
            </Paper>
        </div>
    )
}

export default FunctionView;
