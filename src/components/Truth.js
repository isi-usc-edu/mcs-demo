import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Typography, Hidden } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  checkIcon: {
    color: 'limegreen',
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: '2px',
    top: 0,
    zIndex: 5,
  },
  shadowIcon: {
    color: 'darkgreen',
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
    color: 'limegreen',
    fontWeight: 'bolder',
    textShadow: '2px 2px 0px darkgreen',
  },
})


class Truth extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <span>
        <Hidden smDown>
          <Typography component="h1" variant="h4" className={classes.h1}>TRUTH!</Typography>
        </Hidden>
        <CheckCircleIcon className={classes.shadowIcon} />
        <CheckCircleIcon className={classes.checkIcon} />
      </span>
    )
  }
}


export default withStyles(styles)(Truth)
