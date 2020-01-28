import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import True from './True'
import False from './False'


const styles = theme => ({
  output: {
    position: 'relative',
    cursor: 'pointer',
    width: '100%',
  },
  outputLabels: {
    position: 'absolute',
    top: -1 * theme.spacing(3),
    right: 0,
  },
})


class Output extends React.Component {

  renderOutputLabels() {
    const { classes, statement } = this.props
    return (
      <div className={classes.outputLabels}>
        {statement.output && <True />}
        {!statement.output && <False />}
      </div>
    )
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.output}>
        {this.renderOutputLabels()}
      </div>
    )
  }
}


export default withStyles(styles)(Output)
