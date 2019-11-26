import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Emoji from './Emoji'


const styles = theme => ({
  cancelIcon: {
    color: 'red',
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: '2px',
    top: 0,
    zIndex: 5,
  },
  shadowIcon: {
    color: 'darkred',
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: 0,
    top: '2px',
    zIndex: 4,
  },
  h1: {
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: theme.spacing(7),
    top: 0,
    zIndex: 6,
    color: 'red',
    fontWeight: 'bolder',
    textShadow: '2px 2px 0px darkred',
  },
})


class Lie extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <span>
        <Typography component="h1" variant="h4" className={classes.h1}>LIE!</Typography>
        <CancelIcon className={classes.shadowIcon} />
        <CancelIcon className={classes.cancelIcon} />
      </span>
    )
  }
}


export default withStyles(styles)(Lie)
