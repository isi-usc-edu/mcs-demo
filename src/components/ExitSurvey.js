import React from 'react'
import { Grid, Modal, Typography, Hidden, Button } from '@material-ui/core/'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import RadioButton from './RadioButton'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  root: {
    zIndex: 10,
    position: 'absolute',
    padding: theme.spacing(3, 3, 15, 3),
    '@media (min-width:600px)': {
      padding: theme.spacing(5),
      width: '60vw',
      left: '20vw',
      top: '10vh',
    },
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    background: 'linear-gradient(150deg, #EC6A5A, #A662D6)',
    backgroundSize: '100% 150%',
    border: 0,
    borderRadius: 3,
    outline: 'none',
  },
  header: {
    color: '#fefefe',
  },
  code: {
    color: '#fefefe',
    textAlign: 'center',
    fontWeight: 'bolder',
  },
  content: {
    color: '#fefefe',
    fontSize: theme.spacing(2),
  },
  divider: {
    width: '100%',
    display: 'block',
    height: theme.spacing(2),
    borderBottom: '1px solid #fefefe',
    marginBottom: theme.spacing(2),
  },
  radioGroup: {
    color: 'white',
    display: 'inline',
  },
  closeIcon: {
    color: '#fefefe',
    cursor: 'pointer',
    fontSize: theme.spacing(6),
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  button: {
    color: 'white',
    borderColor: 'whitesmoke',
  },
})


class ExitSurvey extends React.Component {

  render() {
    const { classes, open, code, onAnswer, onClose } = this.props

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={() => onClose()}>
        <Grid container spacing={5} className={classes.root}>
          <Hidden smDown>
            <CloseIcon
              className={classes.closeIcon}
              onClick={() => onClose()} />
          </Hidden>
          <Grid item xs={12}>
            <Typography component="h5" variant="h5" className={classes.header}>
              Thank you for participating!
            </Typography>
            <div className={classes.content}>
              <Typography component="h5" variant="h5" className={classes.header}>
                Use this completion code on MTurk to complete your HIT:
              </Typography>
              <Typography component="h5" variant="h5" className={classes.code}>
                {code}
              </Typography>
            </div>
            <span className={classes.divider} />
            <div className={classes.content}>
              <Typography component="h5" variant="h5" className={classes.header}>
                Exit Survey
              </Typography>
              <p>How much did you enjoy participating in this experiment?</p>
              <p>(from 1 being not at all to 10 being very much)</p>
              <RadioGroup name="q1" className={classes.radioGroup}>
                <FormControlLabel value="1" control={<RadioButton />} label="1" />
                <FormControlLabel value="2" control={<RadioButton />} label="2" />
                <FormControlLabel value="3" control={<RadioButton />} label="3" />
                <FormControlLabel value="4" control={<RadioButton />} label="4" />
                <FormControlLabel value="5" control={<RadioButton />} label="5" />
                <FormControlLabel value="6" control={<RadioButton />} label="6" />
                <FormControlLabel value="7" control={<RadioButton />} label="7" />
                <FormControlLabel value="8" control={<RadioButton />} label="8" />
                <FormControlLabel value="9" control={<RadioButton />} label="9" />
                <FormControlLabel value="10" control={<RadioButton />} label="10" />
              </RadioGroup>
              <br/>
              <p>How likely are you to participate again in a similar experiment?</p>
              <p>(from 1 being very unlikely to 10 being very likely)</p>
              <RadioGroup name="q1" className={classes.radioGroup}>
                <FormControlLabel value="1" control={<RadioButton />} label="1" />
                <FormControlLabel value="2" control={<RadioButton />} label="2" />
                <FormControlLabel value="3" control={<RadioButton />} label="3" />
                <FormControlLabel value="4" control={<RadioButton />} label="4" />
                <FormControlLabel value="5" control={<RadioButton />} label="5" />
                <FormControlLabel value="6" control={<RadioButton />} label="6" />
                <FormControlLabel value="7" control={<RadioButton />} label="7" />
                <FormControlLabel value="8" control={<RadioButton />} label="8" />
                <FormControlLabel value="9" control={<RadioButton />} label="9" />
                <FormControlLabel value="10" control={<RadioButton />} label="10" />
              </RadioGroup>
              <br/>
            </div>
          </Grid>
          <Grid item xs={12} align="left">
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => onClose()}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }
}


export default withStyles(styles)(ExitSurvey)
