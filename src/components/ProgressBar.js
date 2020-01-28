import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {positive} from '../utils/colors'


const styles = theme => ({
  progressBar: {
    background: positive,
    position: 'fixed',
    left: 0,
    bottom: 0,
    height: theme.spacing(1),
  },
})


class ProgressBar extends React.Component {

  render() {
    const { classes, progress } = this.props
    return (
      <div className={classes.progressBar} style={{right: `${100 - progress}%`}} />
    )
  }
}


export default withStyles(styles)(ProgressBar)
