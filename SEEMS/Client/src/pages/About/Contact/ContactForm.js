import React from 'react'

import {
    Box,
    Button,
    Container,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    TextField,
} from '@mui/material'

const contactFields = [
    {
        id: 'outlined-adornment-fullName',
        inputLabel: 'FullName',
        outLinedInput: function () {
            return {
                startAdornment: <InputAdornment position="start">{this.inputLabel}</InputAdornment>,
                label: 'fullName',
            }
        },
    },
    {
        id: 'outlined-adornment-email',
        inputLabel: 'Email',
        outLinedInput: function () {
            return {
                startAdornment: <InputAdornment position="start">{this.inputLabel}</InputAdornment>,
                label: 'email',
            }
        },
    },
    {
        id: 'outlined-adornment-phone',
        inputLabel: 'Phone number',
        outLinedInput: function () {
            return {
                startAdornment: <InputAdornment position="start">{this.inputLabel}</InputAdornment>,
                label: 'phoneNumber',
            }
        },
    },
]

const ContactForm = () => {
    return (
        <Box component={Paper} elevation={3} sx={{ p: 5 }}>
            <Box component="form" mb={1}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    component={Container}
                >
                    {contactFields.map((field) => (
                        <FormControl sx={{ m: 1, width: { sm: '45%', xs: '100%' } }} key={field.id}>
                            <InputLabel htmlFor={field.id}>{field.inputLabel}</InputLabel>
                            <OutlinedInput
                                id={field.id}
                                startAdornment={field.outLinedInput().startAdornment}
                                label={field.outLinedInput().label}
                            />
                        </FormControl>
                    ))}
                    <FormControl sx={{ m: 1 }} fullWidth>
                        <TextField label="Your opinion" id="message" minRows={11} multiline />
                    </FormControl>
                    <Button variant="contained" sx={{ m: 1 }}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ContactForm
