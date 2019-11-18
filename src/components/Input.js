import React from 'react'
import {
  TextField,
} from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'


const CustomTextField = withStyles({
  root: {
    '& .MuiFormLabel-root': {
      fontSize: '1.5em',
      color: '#fefefe',
    },
    '& .MuiInput-input': {
      fontSize: '2em',
      color: '#fefefe',
      transition: 'background 0.3s ease',
    },
    '& label.Mui-focused': {
      color: '#fefefe',
    },
    '&:hover .MuiInput-input': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover .MuiInput-underline:before': {
      borderBottomColor: '#fefefe',
      borderBottom: '3px solid',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fefefe',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fefefe',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0px, -10px)',
    },
  },
})(TextField)


class Input extends React.Component {

  handleOnChange(e) {
    const {updateText, text} = this.props
    const value = e.target.value
    updateText(text.id, value)
  }

  render() {
    const { autoFocus, text } = this.props
    return (
      <CustomTextField
        id={text.id}
        name={text.name}
        label={text.label}
        value={text.value}
        autoFocus={autoFocus}
        autoComplete="off"
        onChange={this.handleOnChange.bind(this)}
        fullWidth
      />
    )
  }
}


export default Input
