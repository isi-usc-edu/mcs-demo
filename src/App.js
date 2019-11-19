import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Submit from './components/Submit'
import Input from './components/Input'
import Score from './components/Score'
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
})


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      s1: {
        id: 's1',
        name: 's1',
        label: 'input 1',
        changed: false,
        score: null,
        lie: false,
        value: '',
      },
      s2: {
        id: 's2',
        name: 's2',
        label: 'input 2',
        changed: false,
        score: null,
        lie: false,
        value: '',
      },
      s3: {
        id: 's3',
        name: 's3',
        label: 'input 3',
        changed: false,
        score: null,
        lie: false,
        value: '',
      }
    }
  }

  handleUpdate(id, value) {
    let update = {}
    update[id] = {...this.state[id], value, changed: true}
    this.setState(update, () => {
      const count = Object.keys(this.state).reduce((c, id) => {
        return c + (+this.state[id]['changed'])
      }, 0)
      if ( count === 1 ) {
        Object.keys(this.state).forEach(id => {
          if ( !this.state[id].changed ) {
            let updated = {}
            updated[id] = {...this.state[id], value}
            this.setState(updated)
          }
        })
      }
    })
  }

  validate(statements) {
    return statements.every(s => !!s.value)
  }

  submit(event) {
    event.preventDefault()
    const { s1, s2, s3 } = this.state

    if ( !this.validate([s1, s2, s3]) ) {
      return
    }

    const url = `/classify?s1=${s1.value}&s2=${s2.value}&s3=${s3.value}`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          s1: {...s1, ...data['s1']['system_1']},
          s2: {...s2, ...data['s2']['system_1']},
          s3: {...s3, ...data['s3']['system_1']},
        })
      })
      .catch((error) => console.log(error))
  }

  render() {
    const { classes } = this.props
    const { s1, s2, s3 } = this.state
    return (
      <Container maxWidth="xl">
        <CssBaseline />
        <Typography component="h1" variant="h4" className={classes.h1}>
          Please enter 2 truths and 1 lie (three common sense statements, they should be <em><b>slightly</b></em> different)
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.submit.bind(this)}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={s1} autoFocus={true} updateText={this.handleUpdate.bind(this)} />
                {!!s1.score && <Score statement={s1} />}
                {!!s1.lie && <Lie />}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={s2} updateText={this.handleUpdate.bind(this)} />
                {!!s2.score && <Score statement={s2} />}
                {!!s2.lie && <Lie />}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper component="div" className={classes.paper} square>
                <Input text={s3} updateText={this.handleUpdate.bind(this)} />
                {!!s3.score && <Score statement={s3} />}
                {!!s3.lie && <Lie />}
              </Paper>
            </Grid>
            <Grid item xs={12} align="center">
              <Submit />
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}


export default withStyles(styles)(App)
