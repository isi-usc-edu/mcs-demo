import React from 'react'
import { Typography } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import { positive } from '../utils/colors'


const styles = theme => ({
  h5: {
    width: '100%',
    color: '#fefefe',
    textAlign: 'left',
    marginTop: '1em',
    cursor: 'pointer',
  },
  score: {
    width: '94%',
  },
  scoreBar: {
    position: 'relative',
    background: positive,
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

class Score extends React.Component {

  render() {
    const { classes } = this.props
    const { statement } = this.props
    return (
      <Typography component="h5" variant="h5" className={classes.h5}>
        <div title={statement.score} className={classes.score}>
          <label>system 1 (probability of truth): {statement.score.toFixed(2)}%</label>
          <div style={{'width': `${statement.score.toFixed(2)}%`}} className={classes.scoreBar}>
            <span className={classes.scoreLabel}>{statement.score.toFixed(2)}%</span>
          </div>
        </div>
      </Typography>
    )
  }
}


export default withStyles(styles)(Score)
