import React from 'react'
import { Fab } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  root: {
    background: 'linear-gradient(-45deg, rgba(236, 255, 203, 0.75), rgba(178, 234, 255, 0.75), rgba(189, 123, 255, 0.75), rgba(255, 136, 123, 0.75))',
    backgroundSize: '400% 400%',
    border: 0,
    borderRadius: 3,
    color: 'white',
    fontSize: theme.spacing(3.5),
    padding: theme.spacing(6, 12),
    '&> .MuiFab-label': {
      marginTop: -1 * theme.spacing(2.5),
    },
  },
})


class Submit extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <Fab variant="extended" type="submit" className={classes.root}>
        Submit
      </Fab>
    )
  }
}


export default withStyles(styles)(Submit)
