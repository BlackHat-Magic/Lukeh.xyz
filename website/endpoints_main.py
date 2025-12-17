"""
Main Endpoints
"""

# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# from flask import Blueprint, current_app, flash, render_template, request
from flask import Blueprint, render_template

endpoints_main = Blueprint("endpoints_main", __name__)

@endpoints_main.route("/")
def home():
    """
    Homepage
    """

    return render_template("index.html")

@endpoints_main.route("/Blog")
def blog():
    """
    Blog
    (Under construction)
    """

    return render_template("under_construction.html")

@endpoints_main.route("/Contact", methods=["POST", "GET"])
def contact():
    """
    Contact form
    """

    # if request.method == "POST":
    #     email = request.form.get("email")
    #     if not email:
    #         flash("Email is required.", "error")
    #         return render_template("contact.html")

    #     subject = request.form.get("subject")
    #     if not subject:
    #         flash("Subject is required.", "error")
    #         return render_template("contact.html")

    #     body = request.form.get("body")
    #     if not body:
    #         flash("Body is required.", "error")
    #         return render_template("contact.html")

    #     msg = MIMEMultipart()
    #     msg["from"] = f"{current_app.config['from_name']} <{current_app.config['from_email']}>"
    #     msg["To"] = current_app.config["to_email"]
    #     msg["Cc"] = email
    #     msg["Subject"] = subject
    #     msg.attach(MIMEText(body, "plain"))
    #     current_app.config["smtp"].send_message(msg)
    #     flash("Message sent. You have been CCed.", "success")

    return render_template("contact.html")
