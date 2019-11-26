import React from 'react'
import { Typography } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import Truth from './Truth'
import Lie from './Lie'
import { colors } from '../utils/colors'


const styles = theme => ({
  h5: {
    width: '100%',
    color: '#fefefe',
    textAlign: 'left',
    marginTop: '1em',
    cursor: 'pointer',
  },
  score: {
    position: 'relative',
    width: '94%',
  },
  scoreBar: {
    position: 'relative',
    height: theme.spacing(2),
    minWidth: '0.5%',
  },
  scoreLabel: {
    position: 'absolute',
    fontSize: theme.spacing(2),
    marginTop: -1 * theme.spacing(0.25),
    right: -1 * theme.spacing(7.5),
  },
  outputLabels: {
    position: 'absolute',
    right: -1 * theme.spacing(10),
    top: theme.spacing(2),
  },
})

class Score extends React.Component {

  render() {
    const { classes } = this.props
    const { statement } = this.props
    return Object.keys(statement.output).map((systemId, i) => (
      <Typography component="h5" variant="h5" className={classes.h5} key={systemId}>
        <div title={statement.output[systemId].prob} className={classes.score}>
          <label>{systemId} (probability of truth: {statement.output[systemId].prob.toFixed(2)}%, score: {statement.output[systemId].score.toFixed(2)})</label>
          <div className={classes.scoreBar}
            style={{'width': `${statement.output[systemId].prob.toFixed(2)}%`, 'background': colors[i]}}>
            <span className={classes.scoreLabel}>{statement.output[systemId].prob.toFixed(2)}%</span>
          </div>
          <div className={classes.outputLabels}>
            {!!statement.output[systemId].lie && <Lie />}
            {!statement.output[systemId].lie && <Truth />}
          </div>
        </div>
      </Typography>
    ))
  }
}


export default withStyles(styles)(Score)
