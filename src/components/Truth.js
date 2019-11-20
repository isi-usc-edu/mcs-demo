import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Emoji from './Emoji'


const styles = theme => ({
  checkIcon: {
    color: 'limegreen',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3),
    zIndex: 5,
  },
  shadowIcon: {
    color: 'darkgreen',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3.5),
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
