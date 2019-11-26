import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
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
})


class Truth extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <span>
        <CheckCircleIcon className={classes.shadowIcon} />
        <CheckCircleIcon className={classes.checkIcon} />
      </span>
    )
  }
}


export default withStyles(styles)(Truth)
