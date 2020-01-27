import React from 'react'
import { Grid, Modal, Typography, Hidden, Button } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import Emoji from './Emoji'
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
    '@media (min-width:600px)': {
    },
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


class Rules extends React.Component {

  render() {
    const { classes, open, onClose } = this.props

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
              Rules
            </Typography>
            <span className={classes.divider} />
            <div className={classes.content}>
              <p>1. All statements should be common sense</p>
              <p>2. One of the statements should be true, one false (lie)</p>
              <p>3. Statements should be about the same (common sense) subject</p>
              <p style={{marginBottom: '0'}}>4. Please refrain from using personal information, unless</p>
              <p style={{margin: '0', paddingLeft: '3em'}}>a. it is about a well-known person (a famous person)</p>
              <p style={{margin: '0', paddingLeft: '3em'}}>b. there is a lot of published information about this person online</p>
              <p>5. <Emoji symbol="📝" label="notes" /><Emoji symbol="👩‍🔬" label="scientist" /> All user input will be logged for scientific purposes</p>
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


export default withStyles(styles)(Rules)
