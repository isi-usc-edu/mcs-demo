import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import True from './True'
import False from './False'
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
})


class Scores extends React.Component {

  render() {
    const { classes } = this.props
    const { statement } = this.props
    return Object.keys(statement.scores).map((systemId, i) => (
      <div className={classes.score} key={systemId}>
        <label title={statement.scores[systemId].prob} className={classes.label}>
          {systemId} (probability of truth: {statement.scores[systemId].prob.toFixed(2)}%, score: {statement.scores[systemId].score.toFixed(2)})
        </label>
        <div className={classes.scoreBar}
          style={{'width': `${statement.scores[systemId].prob.toFixed(2)}%`, 'background': colors[i]}}>
          <span className={classes.scoreLabel}>{statement.scores[systemId].prob.toFixed(2)}%</span>
        </div>
      </div>
    ))
  }
}


export default withStyles(styles)(Scores)
