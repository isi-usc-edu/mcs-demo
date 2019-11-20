import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Emoji from './Emoji'


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
    position: 'absolute',
    fontSize: theme.spacing(5),
    right: theme.spacing(20),
    top: theme.spacing(8),
    zIndex: 6,
  },
  text: {
    color: 'red',
    marginRight: theme.spacing(1),
    fontWeight: 'bolder',
    textShadow: '2px 2px 0px darkred',
  },
})


class Lie extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <span>
        <Typography component="h1" variant="h4" className={classes.h1}>
          <span className={classes.text}>LIE!</span>
          <Emoji symbol="🤥" label="lying_face" />
        </Typography>
        <CancelIcon className={classes.shadowIcon} />
        <CancelIcon className={classes.cancelIcon} />
      </span>
    )
  }
}


export default withStyles(styles)(Lie)
