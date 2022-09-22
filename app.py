from flask import Flask, render_template, redirect
app = Flask(__name__)

@app.route("/")
def home():
	return(render_template("index.html"))

@app.route("/Math/VectorCalc/Magnitude")
@app.route("/Magnitude")
def magnitude():
    return(render_template("magnitude.html"))

if(__name__ == "__main__"):
	app.run(host="0.0.0.0")
