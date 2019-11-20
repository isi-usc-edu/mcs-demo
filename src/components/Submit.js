import React from 'react'
import { Button, Fab } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  root: {
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    background: 'linear-gradient(-45deg, rgba(236, 255, 203, 0.75), rgba(178, 234, 255, 0.75), rgba(189, 123, 255, 0.75), rgba(255, 136, 123, 0.75))',
    backgroundSize: '400% 400%',
    border: 0,
    borderRadius: 3,
    color: 'white',
    fontSize: theme.spacing(3.5),
    padding: theme.spacing(3, 12),
  },
})


class Submit extends React.Component {

  render() {
    const { classes } = this.props
    return (
      <Button type="submit" className={classes.root}>
        Submit
      </Button>
    )
  }
}


export default withStyles(styles)(Submit)
