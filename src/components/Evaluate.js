import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  header: {
    color: '#fefefe',
    padding: theme.spacing(2, 5),
  },
  buttonYes: {
    color: 'whitesmoke',
    background: 'darkgreen',
    margin: theme.spacing(2, 5),
    padding: theme.spacing(2, 10),
    '&:hover': {
      background: 'limegreen',
    },
  },
  buttonNo: {
    color: 'whitesmoke',
    background: 'darkred',
    margin: theme.spacing(2, 5),
    padding: theme.spacing(2, 10),
    '&:hover': {
      background: 'red',
    },
  },
})


class Evaluate extends React.Component {

  render() {
    const { classes, onSelect } = this.props
    return (
      <div>
        <Typography
          component="h2"
          variant="h2"
          className={classes.header}>
          Was the machine output correct?
        </Typography>
                <Button
                  variant="contained"
                  className={classes.buttonYes}
                  onClick={() => onSelect('yes')}>
                  Yes
                </Button>
                <Button
                  variant="contained"
                  className={classes.buttonNo}
                  onClick={() => onSelect('no')}>
                  No
                </Button>
      </div>
    )
  }
}


export default withStyles(styles)(Evaluate)
