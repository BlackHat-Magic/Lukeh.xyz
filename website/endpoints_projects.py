from quart import Blueprint, redirect, render_template, url_for
from quart.typing import ResponseReturnValue

endpoints_projects = Blueprint("endpoints_projects", __name__)


@endpoints_projects.route("/")
async def projects() -> ResponseReturnValue:
    """Projects directory page."""
    return "incomplete", 501


@endpoints_projects.route("/Lukeh.xyz")
async def portfolio() -> ResponseReturnValue:
    """Portfolio."""
    return await render_template("projects/portfolio.html")


@endpoints_projects.route("/SD-Runpod")
async def sd_runpod() -> ResponseReturnValue:
    """SD Runpod."""
    return await render_template("projects/sd_runpod.html")


@endpoints_projects.route("/Silverquill-Compiler")
async def silverquill() -> ResponseReturnValue:
    """Silverquill was renamed."""
    return redirect(url_for("endpoints_projects.piru"))


@endpoints_projects.route("/Piru")
async def piru() -> ResponseReturnValue:
    """Piru (Formerly Silverquill)."""
    return await render_template("projects/piru.html")


@endpoints_projects.route("/Asmadi-Engine")
async def asmadi() -> ResponseReturnValue:
    """Asmadi was renamed."""
    return redirect(url_for("endpoints_projects.palladia"))


@endpoints_projects.route("/Palladia-Engine")
async def palladia() -> ResponseReturnValue:
    """Palladia engine (formerly Asmadi)."""
    return await render_template("projects/palladia.html")


@endpoints_projects.route("/Math")
async def math() -> ResponseReturnValue:
    """Math tools."""
    return await render_template("projects/math.html")


@endpoints_projects.route("/Other")
async def other() -> ResponseReturnValue:
    """Other projects."""
    return await render_template("projects/other.html")
