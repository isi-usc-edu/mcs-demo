import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Submit from './components/Submit'
import Rules from './components/Rules'
import Input from './components/Input'
import Output from './components/Output'
import Evaluate from './components/Evaluate'
import scramble from './utils/scramble'
import { withStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles'


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);


const styles = theme => ({
  '@global': {
    body: {
      background: 'linear-gradient(150deg, #EC6A5A, #A662D6)',
      backgroundSize: '100% 150%',
      padding: theme.spacing(3, 1),
      height: '100vh',
    },
  },
  paper: {
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6),
    backgroundColor: 'rgba(254, 254, 254, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    color: '#fefefe',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    color: 'white',
    borderColor: 'whitesmoke',
  },
})


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      processing: false,
      evaluated: false,
      openRules: false,
      inputs: {
        s1: {
          id: 's1',
          name: 's1',
          label: 'input 1',
          changed: true,
          value: 'roses are red',
          output: null,
        },
        s2: {
          id: 's2',
          name: 's2',
          label: 'input 2',
          changed: true,
          value: 'roses are blue',
          output: null,
        },
      },
    }
  }

  handleOpenRules() {
    this.setState({openRules: true})
  }

  handleCloseRules() {
    this.setState({openRules: false})
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

  scrambleText() {
    const { inputs } = this.state
    this.setState({
      inputs: {
        s1: {...inputs.s1, value: scramble(inputs.s1.value)},
        s2: {...inputs.s2, value: scramble(inputs.s2.value)},
      }
    })
  }

  fetchData(inputs) {
    return new Promise((resolve, reject) => {
      const s1 = inputs.s1.value
      const s2 = inputs.s2.value
      fetch(`http://localhost:5005/classify?s1=${s1}&s2=${s2}`)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  submit(event) {
    event.preventDefault()
    const { inputs } = this.state

    if ( !Object.keys(inputs).every(key => !!inputs[key].value) ) {
      return
    }

    this.setState({processing: true}, () => {
      this.interval = setInterval(this.scrambleText.bind(this), 50)
      this.fetchData(inputs).then(data => {
        clearInterval(this.interval)
        this.setState({
          processing: false,
          inputs: {
            s1: {...inputs.s1, output: data['s1']['truth']},
            s2: {...inputs.s2, output: data['s2']['truth']},
          },
        })
      })
    })
  }

  getInputRef(inputRef) {
    this.inputField = inputRef
  }

  handleSelect() {
    this.setState({evaluated: true})
  }

  handleOnClear() {
    const { inputs } = this.state
    inputs.s1 = {...inputs.s1, value: '', changed: false, output: null}
    inputs.s2 = {...inputs.s2, value: '', changed: false, output: null}
    this.setState({evaluated: false, inputs}, () => {
      this.inputField.focus()
    })
  }

  render() {
    const { classes } = this.props
    const { inputs, openRules, processing, evaluated} = this.state
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <CssBaseline />
          <Rules open={openRules} onClose={this.handleCloseRules.bind(this)} />
          <Typography
            component="h3"
            variant="h3"
            className={classes.header}>
            Enter 2 common sense statements (1 truth and 1 lie)
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.submit.bind(this)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper component="div" className={classes.paper} square>
                  {inputs.s1.output != null && <Output statement={inputs.s1} />}
                  <Input text={inputs.s1} autoFocus={true} updateText={this.handleUpdate.bind(this)} passInputRef={this.getInputRef.bind(this)} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper component="div" className={classes.paper} square>
                  {inputs.s2.output != null && <Output statement={inputs.s2} />}
                  <Input text={inputs.s2} updateText={this.handleUpdate.bind(this)} />
                </Paper>
              </Grid>
              <Grid item xs={12} align="center">
                {inputs.s1.output === null && <Submit disabled={processing} />}
                {inputs.s1.output != null && (
                  <Evaluate evaluated={evaluated}
                    onSelect={this.handleSelect.bind(this)}
                    onReset={this.handleOnClear.bind(this)} />
                )}
              </Grid>
              <Grid item xs={6} align="left">
                <Button
                  variant="outlined"
                  className={classes.button}
                  onClick={this.handleOpenRules.bind(this)}>
                  Rules
                </Button>
              </Grid>
              <Grid item xs={6} align="right">
                <Button
                  variant="outlined"
                  className={classes.button}
                  onClick={this.handleOnClear.bind(this)}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </ThemeProvider>
    )
  }
}


export default withStyles(styles)(App)
