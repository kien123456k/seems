import React, { useState, useEffect, useMemo } from 'react'

import { Prompt } from 'react-router-dom'

import { CameraAlt } from '@mui/icons-material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'

const isEmpty = (incomeValue) => incomeValue.trim().length === 0

const defaultTextFieldValue = { value: '', isTouched: false }

const CreateEventForm = ({ onUploadImage, onCreateEvent, error, setError }) => {
    const startDateDefault = useMemo(() => {
        return new Date(new Date().getTime() + 24 * 3600 * 1000)
    }, [])
    const endDateDefault = useMemo(() => {
        return new Date(new Date().getTime() + 24 * 3600 * 1000 + 5 * 60 * 1000)
    }, [])
    const [startDate, setStartDate] = useState(startDateDefault)
    const [endDate, setEndDate] = useState(endDateDefault)
    const [eventName, setEventName] = useState(defaultTextFieldValue)
    const [location, setLocation] = useState(defaultTextFieldValue)
    const [description, setDescription] = useState(defaultTextFieldValue)
    const [isFree, setIsFree] = useState(true)
    const [isChainEvents, setIsChainEvents] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [price, setPrice] = useState(0)
    useEffect(() => {
        if (isFree) setPrice(0)
        else setPrice(1000)
    }, [isFree])

    const eventNameChangeHandler = (event) => {
        error.title && setError((previousError) => ({ ...previousError, title: null }))
        setEventName((previousValue) => ({ ...previousValue, value: event.target.value }))
    }
    const locationChangeHandler = (event) => {
        error.location && setError((previousError) => ({ ...previousError, location: null }))
        setLocation((previousValue) => ({ ...previousValue, value: event.target.value }))
    }
    const descriptionChangeHandler = (event) => {
        error.description && setError((previousError) => ({ ...previousError, description: null }))
        setDescription((previousValue) => ({ ...previousValue, value: event.target.value }))
    }
    const priceChangeHandler = (event) => {
        error.expectPrice && setError((previousError) => ({ ...previousError, expectPrice: null }))
        setPrice(event.target.value)
    }
    const startDateChangeHandler = (newDate) => {
        error.startDate && setError((previousError) => ({ ...previousError, startDate: null }))
        setStartDate(newDate)
    }
    const endDateChangeHandler = (newDate) => {
        error.endDate && setError((previousError) => ({ ...previousError, endDate: null }))
        setEndDate(newDate)
    }
    const eventNameTouchedHandler = () => {
        setEventName((previousValue) => ({ ...previousValue, isTouched: true }))
    }
    const locationTouchedHandler = () => {
        setLocation((previousValue) => ({ ...previousValue, isTouched: true }))
    }
    const descriptionTouchedHandler = () => {
        setDescription((previousValue) => ({ ...previousValue, isTouched: true }))
    }
    const eventNameIsInValid = isEmpty(eventName.value) && eventName.isTouched
    const locationIsInValid = isEmpty(location.value) && location.isTouched
    const descriptionIsInValid = isEmpty(description.value) && description.isTouched
    const overallTextFieldIsValid =
        !isEmpty(eventName.value) && !isEmpty(location.value) && !isEmpty(description.value)
    const formIsHalfFilled = useMemo(() => {
        return !isEmpty(eventName.value) || !isEmpty(location.value) || !isEmpty(description.value)
    }, [eventName.value, location.value, description.value])

    const submitHandler = (event) => {
        event.preventDefault()
        const eventDetailed = {
            eventTitle: eventName.value,
            location: location.value,
            eventDescription: description.value,
            expectPrice: parseInt(price),
            isFree,
            isPrivate,
            startDate,
            endDate,
        }
        onCreateEvent(eventDetailed)
    }
    return (
        <React.Fragment>
            <Prompt
                when={formIsHalfFilled}
                message={(location) => {
                    return location.pathname === '/event/create'
                        ? false
                        : 'Changes you made may not be sent'
                }}
            />
            <Box component="form" p={2} autoComplete="off" onSubmit={submitHandler}>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between">
                    <FormControl sx={{ m: 1.5, width: { md: '45%', xs: '100%' } }} required>
                        <InputLabel htmlFor="event-name">Event name</InputLabel>
                        <OutlinedInput
                            id="event-name"
                            label="Event Name"
                            value={eventName.value}
                            onChange={eventNameChangeHandler}
                            onBlur={eventNameTouchedHandler}
                            error={eventNameIsInValid || !!error?.title}
                        />
                        {(error?.title || eventNameIsInValid) && (
                            <FormHelperText error={eventNameIsInValid || !!error?.title}>
                                {error?.title ? `${error.title}` : 'Event name must be not empty'}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ m: 1.5, width: { md: '45%', xs: '100%' } }} required>
                        <InputLabel htmlFor="location">Location</InputLabel>
                        <OutlinedInput
                            id="location"
                            label="Location"
                            value={location.value}
                            onChange={locationChangeHandler}
                            onBlur={locationTouchedHandler}
                            error={locationIsInValid || !!error?.location}
                        />
                        {(error?.location || locationIsInValid) && (
                            <FormHelperText error={locationIsInValid || !!error?.title}>
                                {error?.location
                                    ? `${error.location}`
                                    : 'Location must not be empty'}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1.5 }} required>
                        <TextField
                            label="Description"
                            id="description"
                            minRows={5}
                            multiline
                            value={description.value}
                            onChange={descriptionChangeHandler}
                            onBlur={descriptionTouchedHandler}
                            error={descriptionIsInValid || !!error?.description}
                        />
                        {(error?.description || descriptionIsInValid) && (
                            <FormHelperText error={descriptionIsInValid || !!error?.description}>
                                {error?.description
                                    ? `${error.description}`
                                    : 'Description must not be empty'}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ ml: 1.5 }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Free"
                            onChange={() => setIsFree((previousValue) => !previousValue)}
                            checked={isFree}
                        />
                    </FormControl>
                    {!isFree && (
                        <FormControl fullWidth required sx={{ m: 1.5 }}>
                            <InputLabel htmlFor="price" shrink>
                                Price
                            </InputLabel>
                            <OutlinedInput
                                id="price"
                                endAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                label="Price"
                                inputProps={{
                                    type: 'number',
                                    min: 500,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                value={price}
                                onChange={priceChangeHandler}
                                sx={{
                                    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button':
                                        { display: 'none' },
                                }}
                            />
                            {error?.expectPrice && (
                                <FormHelperText error={!!error?.expectPrice}>
                                    {error?.expectPrice && `${error.expectPrice}`}
                                </FormHelperText>
                            )}
                        </FormControl>
                    )}
                    <FormControl sx={{ mx: 1.5 }} fullWidth>
                        <RadioGroup row name="row-radio-buttons-group" value={isPrivate}>
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="Public"
                                onChange={() => setIsPrivate(false)}
                            />
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Private"
                                onChange={() => setIsPrivate(true)}
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{ ml: 1.5 }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Chain of events"
                            value={isChainEvents}
                            onChange={() => setIsChainEvents((previousValue) => !previousValue)}
                        />
                    </FormControl>
                </Box>
                <Box
                    sx={{
                        m: 1.5,
                        display: 'flex',
                        alignItems: { sm: 'center', xs: 'flex-start' },
                        flexDirection: { sm: 'row', xs: 'column' },
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl>
                            <MobileDateTimePicker
                                value={startDate}
                                onChange={(newValue) => {
                                    startDateChangeHandler(newValue)
                                }}
                                label="Start Date"
                                minDateTime={startDateDefault}
                                inputFormat="yyyy/MM/dd hh:mm a"
                                mask="___/__/__ __:__ _M"
                                renderInput={(params) => <TextField {...params} />}
                            />
                            {error?.startDate && (
                                <FormHelperText error={!!error?.startDate}>
                                    {error?.startDate && `${error.startDate}`}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ mx: { sm: 2 }, my: { xs: 2, sm: 0 } }}>To</Box>
                        <FormControl>
                            <MobileDateTimePicker
                                value={endDate}
                                onChange={(newValue) => {
                                    endDateChangeHandler(newValue)
                                }}
                                label="End Date"
                                minDateTime={endDateDefault}
                                inputFormat="yyyy/MM/dd hh:mm a"
                                mask="___/__/__ __:__ _M"
                                renderInput={(params) => <TextField {...params} />}
                            />
                            {error?.endDate && (
                                <FormHelperText error={!!error?.endDate}>
                                    {error?.endDate && `${error.endDate}`}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </LocalizationProvider>
                </Box>
                <Box sx={{ m: 1.5 }}>
                    <InputLabel htmlFor="upload-photo" sx={{ display: 'inline-block' }}>
                        <input
                            style={{ display: 'none' }}
                            id="upload-photo"
                            type="file"
                            onChange={onUploadImage}
                            accept="image/*"
                        />
                        <Button variant="outlined" component="span" startIcon={<CameraAlt />}>
                            Upload
                        </Button>
                    </InputLabel>
                </Box>
                <Box sx={{ m: 1.5, mt: 3 }} display="flex" justifyContent="flex-end">
                    <Button variant="contained" type="submit" disabled={!overallTextFieldIsValid}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default CreateEventForm
