import React from 'react'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { withStyles } from '@material-ui/core/styles'
import { colors } from '../utils/colors'


const styles = theme => ({
  scores: {
    position: 'relative',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    color: '#fefefe',
    width: '100%',
    '@media (min-width:600px)': {
      marginTop: theme.spacing(3),
    },
  },
  scoresToggle: {
  },
  expandIcon: {
    verticalAlign: 'bottom',
  },
  label: {
    opacity: 0.85,
    textAlign: 'left',
    fontSize: theme.spacing(2.25),
    '@media (min-width:600px)': {
      display: 'inline-block',
      marginTop: theme.spacing(1),
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
    right: 3,
  },
})


class Scores extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showScores: false,
    }
  }

  toggleScores() {
    const { showScores } = this.state
    this.setState({showScores: !showScores})
  }

  renderToggle() {
    const { showScores } = this.state
    const { classes } = this.props
    return (
      <Typography variant="button"
        className={classes.scoresToggle}
        onClick={this.toggleScores.bind(this)}>
        {showScores ? (
          <span>
            <ExpandLessIcon className={classes.expandIcon} /> Hide model scores
          </span>
        ) : (
          <span>
            <ExpandMoreIcon className={classes.expandIcon} /> Show model scores
          </span>
        )}
      </Typography>
    )
  }

  renderScores() {
    const { showScores } = this.state
    const { classes, statement } = this.props
    if ( showScores ) {
      return Object.keys(statement.scores).map((systemId, i) => (
        <div className={classes.score} key={systemId}>
          <label title={statement.scores[systemId].prob} className={classes.label}>
            System {i+1}: {systemId} (probability of truth: {statement.scores[systemId].prob.toFixed(2)}%, score: {statement.scores[systemId].score.toFixed(2)})
          </label>
          <div className={classes.scoreBar}
            style={{'width': `${statement.scores[systemId].prob.toFixed(2)}%`, 'background': colors[i]}}>
            <span className={classes.scoreLabel}>{statement.scores[systemId].prob.toFixed(2)}%</span>
          </div>
        </div>
      ))
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.scores}>
        {this.renderToggle()}
        {this.renderScores()}
      </div>
    )
  }
}


export default withStyles(styles)(Scores)
