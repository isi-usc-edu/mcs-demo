import React from 'react';
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'


const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: 'whitesmoke',
    backgroundImage: 'linear-gradient(180deg, hsla(0,0%,100%,.8), hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(25,  229, 101, 0.5)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: 'white',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'whitesmoke',
    },
  },
  checkedIcon: {
    backgroundColor: '#19E565',
    backgroundImage: 'linear-gradient(180deg,rgba(25,229,101,0.1),rgb(25,229,101))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#16ce5b',
    },
  },
})


export default function CustomizedRadios(props) {
  const classes = useStyles();
  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}
