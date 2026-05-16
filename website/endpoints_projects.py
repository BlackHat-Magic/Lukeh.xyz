from flask import Blueprint, redirect, render_template, url_for
from flask.typing import ResponseReturnValue

endpoints_projects = Blueprint("endpoints_projects", __name__)


@endpoints_projects.route("/")
def projects() -> ResponseReturnValue:
    """Projects directory page."""
    return "incomplete", 501


@endpoints_projects.route("/Lukeh.xyz")
def portfolio() -> ResponseReturnValue:
    """Portfolio."""
    return render_template("projects/portfolio.html")


@endpoints_projects.route("/SD-Runpod")
def sd_runpod() -> ResponseReturnValue:
    """SD Runpod."""
    return render_template("projects/sd_runpod.html")


@endpoints_projects.route("/Silverquill-Compiler")
def silverquill() -> ResponseReturnValue:
    """Silverquill was renamed."""
    return redirect(url_for("endpoints_projects.piru"))


@endpoints_projects.route("/Piru")
def piru() -> ResponseReturnValue:
    """Piru (Formerly Silverquill)."""
    return render_template("projects/piru.html")


@endpoints_projects.route("/Asmadi-Engine")
def asmadi() -> ResponseReturnValue:
    """Asmadi was renamed."""
    return redirect(url_for("endpoints_projects.palladia"))


@endpoints_projects.route("/Palladia-Engine")
def palladia() -> ResponseReturnValue:
    """Palladia engine (formerly Asmadi)."""
    return render_template("projects/palladia.html")


@endpoints_projects.route("/Math")
def math() -> ResponseReturnValue:
    """Math tools."""
    return render_template("projects/math.html")


@endpoints_projects.route("/Other")
def other() -> ResponseReturnValue:
    """Other projects."""
    return render_template("projects/other.html")
