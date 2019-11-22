import React from 'react'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Emoji from './Emoji'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  root: {
    width: '60vw',
    left: '20vw',
    top: '20vh',
    height: '60vh',
    position: 'absolute',
    padding: theme.spacing(10),
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    background: 'linear-gradient(150deg, #EC6A5A, #A662D6)',
    backgroundSize: '100% 150%',
    border: 0,
    borderRadius: 3,
    outline: 'none',
  },
  header: {
    color: '#fefefe',
    marginBottom: theme.spacing(5),
  },
  content: {
    color: '#fefefe',
    fontSize: theme.spacing(3),
  },
  divider: {
    width: '100%',
    display: 'block',
    height: theme.spacing(2),
    borderBottom: '1px solid #fefefe',
    marginBottom: theme.spacing(2),
  },
})


class Terms extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      open: true,
    }
  }

  handleClose() {
    this.setState({open: false})
  }

  render() {
    const { classes } = this.props
    const { open } = this.state

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose.bind(this)}>
          <div className={classes.root}>
            <Typography component="h1" variant="h4" className={classes.header}>
              Terms and Conditions
            </Typography>
            <Typography className={classes.content}>
              <p>1. All statements should be common sense</p>
              <p>2. Statements should be about the same subject</p>
              <p>3. Two of the statements should be true, one false (lie)</p>
              <span className={classes.divider} />
              <p><b><Emoji symbol="📝" label="notes" /><Emoji symbol="👩‍🔬" label="scientist" /> all user input will be logged for scientific purposes!</b></p>
            </Typography>
          </div>
        </Modal>
      </div>
    )
  }
}


export default withStyles(styles)(Terms)
