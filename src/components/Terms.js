import React from 'react'
import { Button, Grid, Modal, Typography } from '@material-ui/core/'
import Emoji from './Emoji'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  root: {
    width: '60vw',
    left: '20vw',
    top: '10vh',
    position: 'absolute',
    padding: theme.spacing(10),
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    background: 'linear-gradient(150deg, #EC6A5A, #A662D6)',
    backgroundSize: '100% 150%',
    border: 0,
    borderRadius: 3,
    outline: 'none',
  },
  header: {
    color: '#fefefe',
    marginBottom: theme.spacing(5),
  },
  content: {
    color: '#fefefe',
    fontSize: theme.spacing(3),
  },
  divider: {
    width: '100%',
    display: 'block',
    height: theme.spacing(2),
    borderBottom: '1px solid #fefefe',
    marginBottom: theme.spacing(2),
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    fontSize: theme.spacing(3.5),
    padding: theme.spacing(3, 12),
    '&:hover': {
      backgroundColor: 'rgba(25, 229, 101, 0.95)',
    },
  },
})


class Terms extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      open: true,
    }
  }

  handleClose() {
    this.setState({open: false})
  }

  render() {
    const { classes } = this.props
    const { open } = this.state

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={this.handleClose.bind(this)}>
        <Grid container spacing={5} className={classes.root}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4" className={classes.header}>
              Terms and Conditions
            </Typography>
            <Typography className={classes.content}>
              <p>1. All statements should be common sense</p>
              <p>2. Two of the statements should be true, one false (lie)</p>
              <p>3. Statements should be about the same (common sense) subject</p>
              <p style={{marginBottom: '0'}}>4. Refrain from using personal information, unless</p>
              <p style={{margin: '0', paddingLeft: '3em'}}>a. it is about a well-known person (a famous person)</p>
              <p style={{margin: '0', paddingLeft: '3em'}}>b. there is a lot of published information about this person online</p>
              <span className={classes.divider} />
              <p><b><Emoji symbol="📝" label="notes" /><Emoji symbol="👩‍🔬" label="scientist" /> all user input will be logged for scientific purposes</b></p>
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button className={classes.button} onClick={this.handleClose.bind(this)}>
              Start
            </Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }
}


export default withStyles(styles)(Terms)
