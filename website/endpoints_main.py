"""Main Endpoints."""

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import asyncio
import logging
import smtplib
import socket

from quart import Blueprint, current_app, flash, render_template, request
from quart.typing import ResponseReturnValue

logger = logging.getLogger(__name__)

endpoints_main = Blueprint("endpoints_main", __name__)


@endpoints_main.route("/")
async def home() -> ResponseReturnValue:
    """Homepage."""
    return await render_template("index.html")


@endpoints_main.route("/Blog")
async def blog() -> ResponseReturnValue:
    """Blog (Under construction)."""
    return await render_template("under_construction.html")


@endpoints_main.route("/Contact", methods=["POST", "GET"])
async def contact() -> ResponseReturnValue:
    """Contact form."""
    if request.method != "POST":
        return await render_template("contact.html")

    form = await request.form

    email = form.get("email")
    if not email:
        await flash("Email is required.", "error")
        return await render_template("contact.html")

    subject = form.get("subject")
    if not subject:
        await flash("Subject is required.", "error")
        return await render_template("contact.html")

    body = form.get("body")
    if not body:
        await flash("Body is required.", "error")
        return await render_template("contact.html")

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            _send_email,
            current_app.config["SMTP_SERVER"],
            current_app.config["SMTP_PORT"],
            current_app.config["SMTP_USE_TLS"],
            current_app.config["SMTP_USERNAME"],
            current_app.config["SMTP_PASSWORD"],
            current_app.config["from_name"],
            current_app.config["from_email"],
            current_app.config["to_email"],
            email,
            subject,
            body,
        )
    except (socket.timeout, smtplib.SMTPAuthenticationError, smtplib.SMTPException):
        logger.exception("Failed to send contact email")
        await flash("Failed to send email. Try again later or send from your email client.", "error")
        return await render_template("contact.html")

    await flash("Message sent. You have been CCed.", "success")
    return await render_template("contact.html")


def _send_email(
    smtp_server: str,
    smtp_port: int,
    use_tls: bool,
    username: str,
    password: str,
    from_name: str,
    from_email: str,
    to_email: str,
    reply_to: str,
    subject: str,
    body: str,
) -> None:
    """Send email via SMTP (runs in executor to avoid blocking event loop)."""
    with smtplib.SMTP(smtp_server, smtp_port, timeout=5.0) as smtp:
        if use_tls:
            smtp.starttls()
        smtp.login(username, password)

        msg = MIMEMultipart()
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = to_email
        msg["Cc"] = reply_to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        smtp.send_message(msg)
