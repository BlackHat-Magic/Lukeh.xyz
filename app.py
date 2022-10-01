from flask import Flask, render_template, redirect
app = Flask(__name__)

## HOME
@app.route("/")
def home():
	return(render_template("index.html"))

## MATH
@app.route("/Math")
def math():
    return(render_template("math.html"))

## VECTOR CALCULUS
@app.route("/Math/Vector-Calc")
def vectorCalc():
    return(render_template("vector-calc.html"))

@app.route("/Math/Vector-Calc/Vector-Addition")
def vectorAddition():
    return(render_template("vector-addition.html"))

@app.route("/Math/Vector-Calc/Scalar-Multiplication")
def scalarMultiplication():
    return(render_template("scalar-multiplication.html"))

@app.route("/Math/Vector-Calc/Vector-Magnitude")
def vectorMagnitude():
    return(render_template("vector-magnitude.html"))

@app.route("/Math/Vector-Calc/Unit-Vector")
def unitVector():
    return(render_template("unit-vector.html"))

@app.route("/Math/Vector-Calc/Dot-Product")
def dotProduct():
    return(render_template("dot-product.html"))

@app.route("/Math/Vector-Calc/Cross-Product")
def crossProduct():
    return(render_template("cross-product.html"))

@app.route("/Math/Vector-Calc/TSP")
def TSP():
    return(render_template("tsp.html"))

@app.route("/Math/Vector-Calc/Vector-Projection")
def vectorProjection():
    return(render_template("under-construction.html"))

@app.route("/Math/Vector-Calc/Line-Equation")
def lineEquation():
    return(render_template("under-construction.html"))

@app.route("/Math/Vector-Calc/Distance")
def distance():
    return(render_template("under-construction.html"))

## PROBABILITY AND STATISTICS
@app.route("/Math/Prob-Stat")
def probStat():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Inclusion-Exclusion")
def incEx():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Independence-Dependence")
def indepDep():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Conditional-Probability")
def conditionalProb():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Bayes-Theorem")
def bayesTheorem():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Mean-Median")
def meanMedian():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Variance")
def variance():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Expectation")
def expectation():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Binomial-Distribution")
def binomialDistribution():
    return(render_template("under-construction.html"))

@app.route("/Math/Prob-Stat/Cumulative-Probabilities")
def cumProb():
    return(render_template("under-construction.html"))

if(__name__ == "__main__"):
	app.run(host="0.0.0.0")
