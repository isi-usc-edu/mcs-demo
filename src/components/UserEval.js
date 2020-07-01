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
        fontSize: theme.spacing(3),
        margin: theme.spacing(2, 5),
        padding: theme.spacing(2, 10),
        '&:hover': {
            background: 'limegreen',
        },
    },
    buttonNo: {
        color: 'whitesmoke',
        background: 'darkred',
        fontSize: theme.spacing(3),
        margin: theme.spacing(2, 5),
        padding: theme.spacing(2, 10),
        '&:hover': {
            background: 'red',
        },
    },
    link: {
        cursor: 'pointer',
        marginTop: theme.spacing(5),
        textDecoration: 'underline',
    },
})


class Evaluate extends React.Component {

    constructor(props){
        super(props)

        this.state={
            Question1:null,
            Question2:null,
            Question3:null
        }

    }
    handleTrueQ1(){
        this.setState({Question1:true})
    }
    handleFalseQ1(){
        this.setState({Question1:false})
    }
    handleTrueQ2(){
        this.setState({Question2:true})
    }
    handleFalseQ2(){
        this.setState({Question2:false})
    }
    handleTrueQ3(){
        this.setState({Question3:true})
    }
    handleFalseQ3(){
        this.setState({Question3:false})
    }

    renderEvalButtons() {
        const { classes, onSelect } = this.props
        return (
            <div>
                <Typography
                    component="h3"
                    variant="h3"
                    className={classes.header}>
                    Was this user input commonsense statements?
                    <Button
                        variant="contained"
                        className={classes.buttonYes}
                        onClick={this.handleTrueQ1.bind(this)}>
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.buttonNo}
                        onClick={this.handleFalseQ1.bind(this)}>
                        No
                    </Button>
                </Typography>
                <Typography
                    component="h3"
                    variant="h3"
                    className={classes.header}>
                    Was this output belong to the scenarios?
                    <Button
                        variant="contained"
                        className={classes.buttonYes}
                        onClick={this.handleTrueQ2.bind(this)}>
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.buttonNo}
                        onClick={this.handleFalseQ2.bind(this)}>
                        No
                    </Button>
                </Typography>
                <Typography
                    component="h3"
                    variant="h3"
                    className={classes.header}>
                    Was the machine prediction correct?
                    <Button
                        variant="contained"
                        className={classes.buttonYes}
                        onClick={this.handleTrueQ3.bind(this)}>
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.buttonNo}
                        onClick={this.handleFalseQ3.bind(this)}>
                        No
                    </Button>
                </Typography>

            </div>
        )
    }

    renderReset() {
        const { classes, onReset } = this.props
        return (
            <div>
                <Typography
                    component="h3"
                    variant="h3"
                    className={classes.header}>
                    <div className={classes.link} onClick={() => onReset()}>
                        Let me try one more!
                    </div>
                </Typography>
            </div>
        )
    }

    render() {
        const { evaluated } = this.props
        return (
            <div>
                {!!evaluated ? this.renderReset() : this.renderEvalButtons()}
            </div>
        )
    }
}


export default withStyles(styles)(Evaluate)
