# Machine Common Sense Demo

This demo presents an interactive system for common sense reasoning that takes a pair of common sense statements (one true and one false) and determines which one is correct.

Visit http://mcs.isi.edu/ for a live preview of the demo!

# Demo Instructions

1. Enter two common sense statements (one true and one false) and hit the submit button
2. Evaluate machine output, to examine the different systems click on `show model scores`
3. Click `Yes` if the machine output was correct or `No` if it was not

# Development Instructions

To run a local development version of the demo:

1. Clone or simply download this repository to your local drive
2. Run `pip install -r api/requirements.txt` to install back-end dependencies
3. Run `cd app && ./server.py` to start the back-end server
4. Run `npm install` to install fron-end dependencies
5. Run `npm start` to start the front-end server
