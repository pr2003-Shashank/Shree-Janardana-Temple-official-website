import React from "react";
import {Typography,TextField, Paper, Button, Box } from "@mui/material";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import './booking.scss';

function Booking() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date:"",
        people: ""
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        phone: "",
        date:"",
        people: ""
    });

    const navigate = useNavigate();

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
    const validateEmail = (email) => {
        const newErrors = { ...formErrors };

        if (email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        } else {
            newErrors.email = "";
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
    const validatePeople = (people) => {
        const newErrors = { ...formErrors };
        if (people.trim() === "") {
            newErrors.people = "Number of people is required";
        }
        else if(people < 50){
            newErrors.people = "Minimum number of people is 50";
        }
        else{
            newErrors.people = "";
        }
        setFormErrors(newErrors);

    }

    const validateDate = (date) => {
        const newErrors = { ...formErrors };
        if (date.trim() === "") {
            newErrors.date = "Date is required";
        }
        else{
            newErrors.date = "";
        }
        setFormErrors(newErrors);
    }

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

        // Validation for Email
        if (formData.email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        } else {
            newErrors.email = "";
        }

        // Validation for Phone
        if (formData.phone.trim() === "") {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        } else {
            newErrors.phone = "";
        }

        //Validation for Number
        if (formData.people.trim() === "") {
            newErrors.people = "Number of people is required";
        }
        else if(formData.people < 50){
            newErrors.people = "Minimum number of people is 50";
        }
        else{
            newErrors.people = "";
        }

        //Validation for date
        if (formData.date.trim() === "") {
            newErrors.date = "Date is required";
        }
        else{
            newErrors.date = "";
        }

        setFormErrors(newErrors);

        // Check if there are no errors in the newErrors object
        const isValid = Object.values(newErrors).every((error) => error === "");

        return isValid;
    };

    const [submit,setSubmit] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            sessionStorage.setItem('formData', JSON.stringify(formData));
            setSubmit(true);
        }
    };
    return (
        <div className="booking_form">
            {submit ? (
                <div className='initial_display'>
                <Paper
                  elevation={10}
                  className='top_paper'
                >
                  <Typography> Thank you <span>{formData.name}</span> for reaching out to us. Your booking request is being reviewed by our administrators. The confirmation status of your booking will be updated to the email/mobile number you have provided. </Typography>
                </Paper>
                <Paper
                  elevation={10}
                  className='bottom_paper'
                >
                  <Typography>
                    For more information about the charges based on your specific requirement, click on the button below. 
                  </Typography>
                  <Button
                  variant="contained"
                  startIcon = {<CurrencyRupeeIcon/>}
                  onClick={(e) => {
                    navigate('/quotation');
                  }}
                  >
                    Get Estimates
                  </Button>
                </Paper>
              </div>
            ) : (
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
            <Paper
                elevation={10}
            >
                <form
                    id="form"
                >
                    <div className="form_container" style={{fontSize: '15px',marginBottom:'1.5rem'}}>
                        <div className='form_head'>
                            <div className='text_head'>Book A Function</div>
                        </div>
                        <div className="form_fields">
                            <label className="labels">Your Name</label>
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
                            <label className="labels">Email address</label>
                            <TextField
                                className="field"
                                placeholder="example@domain.com"
                                variant="standard"
                                type="email"
                                name='email'
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    validateEmail(e.target.value);
                                }}
                            />
                            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
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
                        <div className="form_fields">
                            <label className="labels">Number of People</label>
                            <TextField
                                className="field"
                                variant="standard"
                                type="number"
                                name='people'
                                value={formData.people}
                                onChange={(e) => {
                                    setFormData({ ...formData, people: e.target.value });
                                    validatePeople(e.target.value);
                                }}
                            />
                            {formErrors.people && <div className="error-message">{formErrors.people}</div>}

                        </div>
                        <div className="form_fields">
                            <label className="labels">Date</label>
                            <TextField
                                className="field"
                                variant="standard"
                                type="date"
                                name='date'
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData({ ...formData, date: e.target.value });
                                    validateDate(e.target.value);
                                }}
                            />
                            {formErrors.date && <div className="error-message">{formErrors.date}</div>}
                        </div>
                    </div>
                    <div className="create_request">
                        <Button variant="contained"
                            onClick={handleSubmit}
                            type='submit'
                            >
                            Submit
                        </Button>
                    </div>
                </form>
            </Paper>
            </Box>
            )
        }
        </div>
    )
}

export default Booking;