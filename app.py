from flask import Flask, render_template, redirect
app = Flask(__name__)

@app.route("/")
def home():
	return(render_template("index.html"))

@app.route("/Math")
def math():
    return(render_template("math.html"))

@app.route("/Math/Vector-Calc")
def vectorCalc():
    return(render_template("vector-calc.html"))
@app.route("/Vector-Calc")
def vectorCalcRedirect():
    return(redirect("/Math/Vector-Calc"))

@app.route("/Math/Vector-Calc/Vector-Addition")
def vectorAddition():
    return(render_template("vector-addition.html"))
@app.route("/Vector-Calc/Vector-Addition")
@app.route("/Math/Vector-Addition")
@app.route("/Vector-Addition")
def vectorAdditionRedirect():
    return(redirect("/Math/Vector-Calc/Vector-Addition"))

@app.route("/Math/Vector-Calc/Scalar-Multiplication")
def scalarMultiplication():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Scalar-Multiplication")
@app.route("/Math/Scalar-Multiplication")
@app.route("/Scalar-Multiplication")
def scalarMultiplicationRedirect():
    return(redirect("/Math/Vector-Calc/Scalar-Multiplication"))

@app.route("/Math/Vector-Calculus/Vector-Magnitude")
def vectorMagnitude():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Vector-Magnitude")
@app.route("/Math/Vector-Magnitude")
@app.route("/Vector-Magnitude")
def vectorMagnitudeRedirect():
    return(redirect("/Math/Vector-Calc/Scalar-Multiplication"))

@app.route("/Math/Vector-Calc/Unit-Vector")
def unitVector():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Unit-Vector")
@app.route("/Math/Unit-Vector")
@app.route("/Unit-Vector")
def unitVectorRedirect():
    return(redirrect("/Math/Vector-Calc/Unit-Vector"))

@app.route("/Math/Vector-Calc/Dot-Product")
def dotProduct():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Dot-Product")
@app.route("/Math/Dot-Product")
@app.route("/Dot-Product")
def dotProductRedirect():
    return(redirect("/Math/Vector-Calc/Dot-Product"))

@app.route("/Math/Vector-Calc/Cross-Product")
def crossProduct():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Cross-Product")
@app.route("/Math/Cross-Product")
@app.route("/Cross-Product")
def crossProductRedirect():
    return(redirect("/Math/Vector-Calc/Cross-Product"))

@app.route("/Math/Vector-Calc/TSP")
def TSP():
    return(render_template("under-construction.html"))
@app.route("/Math/Vector-Calculus/Triple-Scalar-Product")
@app.route("/Vector-Calc/Triple-Scalar-Product")
@app.route("/Math/Triple-ScalarProduct")
@app.route("/Triple-Scalar-Product")
@app.route("/Vector-Calc/TSP")
@app.route("/Math/TSP")
@app.route("/TSP")
def TSPRedirect():
    return(redirect("/Math/Vector-Calc/TSP"))

@app.route("/Math/Vector-Calc/Vector-Projection")
def vectorProjection():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Vector-Projection")
@app.route("/Math/Vector-Projection")
@app.route("/Vector-Projection")
def vectorProjectionRedirect():
    return(redirect("/Math/Vector-Calc/Vector-Projection"))

@app.route("/Math/Vector-Calc/Line-Equation")
def lineEquation():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Line-Equation")
@app.route("/Math/Line-Equation")
@app.route("/Line-Equation")
def lineEquationRedirect():
    return(redirect("/Math/Vector-Calc/Line-Equation"))

@app.route("/Math/Vector-Calc/Distance")
def distance():
    return(render_template("under-construction.html"))
@app.route("/Vector-Calc/Distance")
@app.route("/Math/Distance")
@app.route("/Distance")
def distanceRedirect():
    return(redirect("/Math/Vector-Calc/Distance"))

if(__name__ == "__main__"):
	app.run(host="0.0.0.0")
