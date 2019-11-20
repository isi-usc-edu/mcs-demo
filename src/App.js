import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Submit from './components/Submit'
import Emoji from './components/Emoji'
import Input from './components/Input'
import Score from './components/Score'
import Truth from './components/Truth'
import Lie from './components/Lie'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  '@global': {
    body: {
      background: 'linear-gradient(-45deg, rgba(190, 255, 75, 0.75), rgba(50, 200, 255, 0.75), rgba(125, 0, 250, 0.75), rgba(250, 25, 0, 0.75))',
      backgroundSize: '400% 400%',
      padding: '3em 1em 1em 1em',
    },
  },
  paper: {
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    backgroundColor: 'rgba(254, 254, 254, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  h1: {
    color: '#fefefe',
    marginBottom: theme.spacing(5),
  },
  popover: {
    pointerEvents: 'none',
    borderRadius: 0,
  },
  popoverContent: {
    padding: theme.spacing(2),
  },
  divider: {
    width: '100%',
    display: 'block',
    height: theme.spacing(2),
    borderBottom: '1px solid #555',
    marginBottom: theme.spacing(2),
  },
  anchorEl: {
    borderBottom: '2px solid whitesmoke',
    cursor: 'pointer',
    float: 'right',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  clearButton: {
    color: 'white',
    float: 'right',
    borderColor: 'whitesmoke',
    borderRadius: 3,
    fontSize: theme.spacing(3.5),
    padding: theme.spacing(3),
  },
})


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      processed: false,
      inputs: {
        s1: {
          id: 's1',
          name: 's1',
          label: 'input 1',
          changed: true,
          score: null,
          lie: false,
          value: 'roses are flowers',
        },
        s2: {
          id: 's2',
          name: 's2',
          label: 'input 2',
          changed: true,
          score: null,
          lie: false,
          value: 'roses are red',
        },
        s3: {
          id: 's3',
          name: 's3',
          label: 'input 3',
          changed: true,
          score: null,
          lie: false,
          value: 'roses are blue',
        },
      },
    }
  }

  handlePopoverOpen(event) {
    this.setState({anchorEl: event.currentTarget})
  }

  handlePopoverClose() {
    this.setState({anchorEl: null})
  }

  handleUpdate(id, value) {
    let inputs = {...this.state.inputs}
    inputs[id] = {...inputs[id], value, changed: true}
    this.setState({inputs}, () => {
      const count = Object.keys(inputs).reduce((c, id) => {
        return c + (+inputs[id]['changed'])
      }, 0)
      if ( count === 1 ) {
        Object.keys(inputs).forEach(id => {
          if ( !inputs[id].changed ) {
            inputs[id] = {...inputs[id], value}
            this.setState({inputs})
          }
        })
      }
    })
  }

  submit(event) {
    event.preventDefault()
    const { inputs } = this.state

    if ( !Object.keys(inputs).every(key => !!inputs[key].value) ) {
      return
    }

    const url = `/classify?s1=${inputs.s1.value}&s2=${inputs.s2.value}&s3=${inputs.s3.value}`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          processed: true,
          inputs: {
            s1: {...inputs.s1, ...data['s1']['system_1']},
            s2: {...inputs.s2, ...data['s2']['system_1']},
            s3: {...inputs.s3, ...data['s3']['system_1']},
          },
        })
      })
      .catch((error) => console.log(error))
  }

  getInputRef(refs) {
    this.inputField = refs.input.getElementsByTagName('input')[0]
  }

  handleOnClear() {
    const { inputs } = this.state
    inputs.s1 = {...inputs.s1, value: '', changed: false, lie: false, score: null}
    inputs.s2 = {...inputs.s2, value: '', changed: false, lie: false, score: null}
    inputs.s3 = {...inputs.s3, value: '', changed: false, lie: false, score: null}
    this.setState({processed: false, inputs})
  }

  render() {
    const { classes } = this.props
    const { processed, inputs, anchorEl } = this.state
    return (
      <Container maxWidth="xl">
        <CssBaseline />
        <Typography
          component="h1"
          variant="h4"
          className={classes.h1}>
          Enter 3 common sense statements (2 truths and 1 lie)
          <span className={classes.anchorEl}
            onMouseEnter={this.handlePopoverOpen.bind(this)}
            onMouseLeave={this.handlePopoverClose.bind(this)}>
            * terms and conditions apply
          </span>
        </Typography>
        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          className={classes.popover}
          classes={{
            paper: classes.popoverContent,
          }}
          onClose={this.handlePopoverClose.bind(this)}
          disableRestoreFocus>
          <Typography>
            1. All statements should be common sense<br/>
            2. Statements should be about the same subject<br/>
            3. Two of the statements should be true, one false (lie)<br/>
            <span className={classes.divider} />
            <b>All user input will be logged for scientific purposes <Emoji symbol="🔬" label="science" /></b>
          </Typography>
        </Popover>
        <form className={classes.form} noValidate onSubmit={this.submit.bind(this)}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={inputs.s1} autoFocus={true} updateText={this.handleUpdate.bind(this)} passInputRef={this.getInputRef.bind(this)} />
                {inputs.s1.score != null && <Score statement={inputs.s1} />}
                {processed && !!inputs.s1.lie && <Lie />}
                {processed && !inputs.s1.lie && <Truth />}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={inputs.s2} updateText={this.handleUpdate.bind(this)} />
                {inputs.s2.score != null && <Score statement={inputs.s2} />}
                {processed && !!inputs.s2.lie && <Lie />}
                {processed && !inputs.s2.lie && <Truth />}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={inputs.s3} updateText={this.handleUpdate.bind(this)} />
                {inputs.s3.score != null && <Score statement={inputs.s3} />}
                {processed && !!inputs.s3.lie && <Lie />}
                {processed && !inputs.s3.lie && <Truth />}
              </Paper>
            </Grid>
            <Grid item xs={12} align="center">
              <Submit />
              <Button variant="outlined" className={classes.clearButton} onClick={this.handleOnClear.bind(this)}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}


export default withStyles(styles)(App)
