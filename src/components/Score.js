import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Truth from './Truth'
import Lie from './Lie'
import { colors } from '../utils/colors'


const styles = theme => ({
  score: {
    position: 'relative',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    color: '#fefefe',
    width: '100%',
    '@media (min-width:600px)': {
      marginTop: theme.spacing(3),
    },
  },
  label: {
    opacity: 0.85,
    textAlign: 'left',
    fontSize: theme.spacing(2),
    '@media (min-width:600px)': {
      marginTop: theme.spacing(3),
      fontSize: theme.spacing(3),
    },
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
    top: theme.spacing(2),
    right: 0,
  },
})

class Score extends React.Component {

  render() {
    const { classes } = this.props
    const { statement } = this.props
    return Object.keys(statement.output).map((systemId, i) => (
      <div className={classes.score} key={systemId}>
        <label title={statement.output[systemId].prob} className={classes.label}>
          {systemId} (probability of truth: {statement.output[systemId].prob.toFixed(2)}%, score: {statement.output[systemId].score.toFixed(2)})
        </label>
        <div className={classes.scoreBar}
          style={{'width': `${statement.output[systemId].prob.toFixed(2)}%`, 'background': colors[i]}}>
          <span className={classes.scoreLabel}>{statement.output[systemId].prob.toFixed(2)}%</span>
        </div>
        <div className={classes.outputLabels}>
          {!!statement.output[systemId].lie && <Lie />}
          {!statement.output[systemId].lie && <Truth />}
        </div>
      </div>
    ))
  }
}


export default withStyles(styles)(Score)
