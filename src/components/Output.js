import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import True from './True'
import False from './False'
import Scores from './Scores'


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

  render() {
    const { classes } = this.props
    const { statement } = this.props
    return (
      <div className={classes.score}>
        <div className={classes.outputLabels}>
          {statement.output && <True />}
          {!statement.output && <False />}
        </div>
      </div>
    )
  }
}


export default withStyles(styles)(Output)
