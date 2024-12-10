import React from "react";
import { Typography, Divider, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './footer.scss';

function Footer() {

    const handleRefreshToHomePage = () => {
        window.location.href = '/';
    }

    const navigate = useNavigate();

    return (
        <div className="footer_container">
            <Box>
                <div className="top_container">
                    <Divider
                        orientation='horizontal'
                        flexItem
                        className='footer_divider'
                    />
                    <Typography onClick={handleRefreshToHomePage}>Shree Janardana Temple</Typography>
                    <Divider
                        orientation='horizontal'
                        flexItem
                        className='footer_divider'
                    />
                </div>
                <div className="bottom_container">
                    <div className="list_container">
                        <Typography className='list_title'>Address</Typography>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem >
                                <ListItemText primary="Aryadi Shree Janardana Temple" />
                            </ListItem>
                            <ListItem >
                                <ListItemText primary="NH 66, Pangala, Udupi district" />
                            </ListItem>
                            <ListItem >
                                <ListItemText primary="Karnataka - 576122" />
                            </ListItem>
                        </List>
                    </div>
                    <div className="list_container">
                        <Typography className='list_title'>Contact Us</Typography>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem >
                                <ListItemText primary="Phone: +91 9876543210" />
                            </ListItem>
                            <ListItem >
                                <ListItemText primary="E-mail: info.shreejanardanatemple@gmail.com" />
                            </ListItem>
                        </List>
                    </div>
                    <div className="button_container">
                        <div className="booking_button">
                            <Button
                                onClick={(e) => {
                                    navigate('/booking')
                                }}
                            >Book a Function
                            </Button>
                        </div>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem >
                                <ListItemText primary="'' Book your special event at our temple now." />
                            </ListItem>
                            <ListItem >
                                <ListItemText primary="Reach out to us for more details! '' " />
                            </ListItem>
                        </List>
                    </div>
                </div>
                <Divider
                    orientation='horizontal'
                    flexItem
                    className='footer_divider'
                />
                <Button
                    endIcon={<ExitToAppIcon />}
                    onClick={(e)=>
                        window.open('/admin')
                    }
                >
                    Admin Login
                </Button>
            </Box>
        </div>
    )
}

export default Footer;