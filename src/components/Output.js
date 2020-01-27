import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Truth from './Truth'
import Lie from './Lie'


const styles = theme => ({
  score: {
    position: 'relative',
    cursor: 'pointer',
    width: '100%',
    '@media (min-width:600px)': {
    },
  },
  outputLabels: {
    position: 'absolute',
    top: -1 * theme.spacing(3),
    right: 0,
  },
})

class Output extends React.Component {

  findTruth(statement) {
    return true
  }

  render() {
    const { classes } = this.props
    const { statement } = this.props
    let truth = this.findTruth(statement)
    return (
      <div className={classes.score}>
        <div className={classes.outputLabels}>
          {truth && <Truth />}
          {!truth && <Lie />}
        </div>
      </div>
    )
  }
}


export default withStyles(styles)(Output)
