from flask_login import current_user, login_required
from flask import Blueprint, render_template

from .models import User

import json

endpoints_main = Blueprint("endpoints_main", __name__)

@endpoints_main.route("/")
def home():
    admin = User.query.filter_by(id=1).first()
    return(render_template("index.html", admin = admin))

@endpoints_main.route("/Project")
def project():
    return("incomplete")

## MATH
@endpoints_main.route("/Math")
def math():
    admin = User.query.filter_by(id=1).first()
    return(render_template("math.html", admin = admin))

## VECTOR CALCULUS
@endpoints_main.route("/Math/Vector-Calc")
def vectorCalc():
    admin = User.query.filter_by(id=1).first()
    return(render_template("vector-calc.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Vector-Addition")
def vectorAddition():
    admin = User.query.filter_by(id=1).first()
    return(render_template("vector-addition.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Scalar-Multiplication")
def scalarMultiplication():
    admin = User.query.filter_by(id=1).first()
    return(render_template("scalar-multiplication.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Vector-Magnitude")
def vectorMagnitude():
    admin = User.query.filter_by(id=1).first()
    return(render_template("vector-magnitude.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Unit-Vector")
def unitVector():
    admin = User.query.filter_by(id=1).first()
    return(render_template("unit-vector.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Dot-Product")
def dotProduct():
    admin = User.query.filter_by(id=1).first()
    return(render_template("dot-product.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Cross-Product")
def crossProduct():
    admin = User.query.filter_by(id=1).first()
    return(render_template("cross-product.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/TSP")
def TSP():
    admin = User.query.filter_by(id=1).first()
    return(render_template("tsp.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Vector-Projection")
def vectorProjection():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Line-Equation")
def lineEquation():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Vector-Calc/Distance")
def distance():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

## PROBABILITY AND STATISTICS
@endpoints_main.route("/Math/Prob-Stat")
def probStat():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Inclusion-Ex")
def incEx():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Independence-Dependence")
def indepDep():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Conditional-Probability")
def conditionalProb():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Bayes-Theorem")
def bayesTheorem():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Mean-Median")
def meanMedian():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Variance")
def variance():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Expectation")
def expectation():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Binomial-Distribution")
def binomialDistribution():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

@endpoints_main.route("/Math/Prob-Stat/Cumulative-Probabilities")
def cumProb():
    admin = User.query.filter_by(id=1).first()
    return(render_template("under-construction.html", admin = admin))

