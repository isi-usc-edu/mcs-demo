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
import Scores from './components/Scores'
import Evaluate from './components/Evaluate'
import ExitSurvey from './components/ExitSurvey'
import ProgressBar from './components/ProgressBar'
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
  header: {
    color: '#fefefe',
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(3),
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    color: 'white',
    borderColor: 'whitesmoke',
    marginTop: theme.spacing(3),
  },
})


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      processing: false,
      evaluated: false,
      openSurvey: false,
      enjoyment: null,
      returning: null,
      openRules: false,
      dataID: null,
      progress: 0,
      count: 0,
      code: '',
      inputs: {
        s1: {
          id: 's1',
          name: 's1',
          label: 'input 1',
          changed: true,
          value: 'roses are red',
          output: null,
          scores: null,
        },
        s2: {
          id: 's2',
          name: 's2',
          label: 'input 2',
          changed: true,
          value: 'roses are blue',
          output: null,
          scores: null,
        },
      },
    }
  }

  handleOpenSurvey() {
    this.setState({openSurvey: true})
  }

  handleCloseSurvey() {
    this.setState({openSurvey: false})
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

  postData(inputs) {
    return new Promise((resolve, reject) => {
      const s1 = inputs.s1.value
      const s2 = inputs.s2.value
      fetch('/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({s1, s2}),
      })
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
      this.postData(inputs).then(data => {
        clearInterval(this.interval)
        this.setState({
          processing: false,
          dataID: data['id'],
          inputs: {
            s1: {...inputs.s1, output: data['s1']['output'], scores: data['s1']['scores']},
            s2: {...inputs.s2, output: data['s2']['output'], scores: data['s2']['scores']},
          },
        })
      })
    })
  }

  getInputRef(inputRef) {
    this.inputField = inputRef
  }

  handleEvaluate(evaluation) {
    const { dataID } = this.state
    if ( !dataID ) { return }
    fetch('/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({dataID, evaluation}),
    })
    .then((response) => response.json())
    .then((data) => {
      let progress = 0
      if ( !!data['count'] ) {
        progress = Math.max(Math.round(data['count'] / 5 * 100), 100)
      }
      this.setState({
        evaluated: true,
        count: data['count'],
        progress: progress,
        code: data['code']
      })
    })
  }

  handleAnswer(question, value) {
    let update = {}
    update[question] = value
    this.setState({...update}, () => {
      const {enjoyment, returning} = this.state
      fetch('/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({enjoyment, returning}),
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          surveyComplete: true,
          ...data,
        })
      })
    })
  }

  handleOnClear() {
    const { inputs } = this.state
    inputs.s1 = {...inputs.s1, value: '', changed: false, output: null, scores: null}
    inputs.s2 = {...inputs.s2, value: '', changed: false, output: null, scores: null}
    this.setState({dataID: null, evaluated: false, inputs}, () => {
      this.inputField.focus()
    })
  }

  render() {
    const { classes } = this.props
    const { code, inputs, openRules, openSurvey, processing, evaluated, progress, count} = this.state
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <CssBaseline />
          <ProgressBar progress={progress} />
          <Rules open={openRules} onClose={this.handleCloseRules.bind(this)} />
          <ExitSurvey open={openSurvey}
            code={code}
            onAnswer={this.handleAnswer.bind(this)}
            onClose={this.handleCloseSurvey.bind(this)} />
          <Typography
            component="h3"
            variant="h3"
            className={classes.header}>
            Enter 2 common sense statements (1 true and 1 false)
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.submit.bind(this)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper component="div" className={classes.paper} square>
                  {inputs.s1.output != null && <Output statement={inputs.s1} />}
                  <Input text={inputs.s1} autoFocus={true} disabled={inputs.s1.output != null} updateText={this.handleUpdate.bind(this)} passInputRef={this.getInputRef.bind(this)} />
                  {inputs.s1.scores != null && <Scores statement={inputs.s1} />}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper component="div" className={classes.paper} square>
                  {inputs.s2.output != null && <Output statement={inputs.s2} />}
                  <Input text={inputs.s2} disabled={inputs.s2.output != null} updateText={this.handleUpdate.bind(this)} />
                  {inputs.s2.scores != null && <Scores statement={inputs.s2} />}
                </Paper>
              </Grid>
              <Grid item xs={12} align="center">
                {inputs.s1.output === null && <Submit disabled={processing} />}
                {inputs.s1.output != null && (
                  <Evaluate evaluated={evaluated}
                    onSelect={this.handleEvaluate.bind(this)}
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
              {!!count && (
                <Grid item xs={12} align="center" style={{marginTop: '-24px'}}>
                  {!!code && (
                    <Typography
                      component="h5"
                      variant="h5"
                      className={classes.header}
                      style={{textDecoration: 'underline', cursor: 'pointer'}}
                      onClick={this.handleOpenSurvey.bind(this)}>
                      Complete the HIT and get the completion Code
                    </Typography>
                  )}
                  <Typography
                    component="h5"
                    variant="h5"
                    className={classes.header}>
                    Generated {count} out of 5 required statements.
                  </Typography>
                  {count >= 5 && (
                    <Typography
                      component="h5"
                      variant="h5"
                      className={classes.header}>
                      Current payout: {`${Math.min(0.5 + 0.05 * (count-5), 1).toFixed(2)} $`}
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>
          </form>
        </Container>
      </ThemeProvider>
    )
  }
}


export default withStyles(styles)(App)
