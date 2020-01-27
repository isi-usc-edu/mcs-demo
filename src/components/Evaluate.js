import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  header: {
    color: '#fefefe',
    padding: theme.spacing(2, 5),
  },
  buttonYes: {
    color: 'whitesmoke',
    background: 'darkgreen',
    fontSize: theme.spacing(3),
    margin: theme.spacing(2, 5),
    padding: theme.spacing(2, 10),
    '&:hover': {
      background: 'limegreen',
    },
  },
  buttonNo: {
    color: 'whitesmoke',
    background: 'darkred',
    fontSize: theme.spacing(3),
    margin: theme.spacing(2, 5),
    padding: theme.spacing(2, 10),
    '&:hover': {
      background: 'red',
    },
  },
  link: {
    cursor: 'pointer',
    marginTop: theme.spacing(5),
    textDecoration: 'underline',
  },
})


class Evaluate extends React.Component {

  renderEvalButtons() {
    const { classes, onSelect } = this.props
    return (
      <div>
        <Typography
          component="h3"
          variant="h3"
          className={classes.header}>
          Was the machine output correct?
        </Typography>
        <Button
          variant="contained"
          className={classes.buttonYes}
          onClick={() => onSelect('yes')}>
          Yes
        </Button>
        <Button
          variant="contained"
          className={classes.buttonNo}
          onClick={() => onSelect('no')}>
          No
        </Button>
      </div>
    )
  }

  renderReset() {
    const { classes, onReset } = this.props
    return (
      <div>
        <Typography
          component="h3"
          variant="h3"
          className={classes.header}>
          Thank you for participating!
          <div className={classes.link} onClick={() => onReset()}>
            Try again
          </div>
        </Typography>
      </div>
    )
  }

  render() {
    const { evaluated } = this.props
    return (
      <div>
        {!!evaluated ? this.renderReset() : this.renderEvalButtons()}
      </div>
    )
  }
}


export default withStyles(styles)(Evaluate)
