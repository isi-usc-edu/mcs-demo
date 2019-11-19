import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  cancelIcon: {
    color: 'red',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3),
  },
  shadowIcon: {
    color: 'darkred',
    position: 'absolute',
    fontSize: theme.spacing(15),
    right: theme.spacing(3),
    top: theme.spacing(3.5),
  },
})


class Lie extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <span>
        <CancelIcon className={classes.shadowIcon} />
        <CancelIcon className={classes.cancelIcon} />
      </span>
    )
  }
}


export default withStyles(styles)(Lie)
