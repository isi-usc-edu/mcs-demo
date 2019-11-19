import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  cancelIcon: {
    color: 'red',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3),
    zIndex: 5,
  },
  shadowIcon: {
    color: 'darkred',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3.5),
    zIndex: 4,
  },
  h1: {
    color: 'red',
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: theme.spacing(19),
    top: theme.spacing(8),
    fontWeight: 'bolder',
    textShadow: '2px 2px 0px darkred',
    zIndex: 6,
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
