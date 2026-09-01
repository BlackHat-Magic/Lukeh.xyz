import { connect } from "cloudflare:sockets";

interface Env {
  SMTP_SERVER: string;
  SMTP_PORT: string;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
  TO_EMAIL: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  let email: string, subject: string, body: string;

  try {
    if (contentType.includes("application/json")) {
      const json = await request.json() as Record<string, string>;
      email = json.email || "";
      subject = json.subject || "";
      body = json.body || "";
    } else {
      const formData = await request.formData();
      email = (formData.get("email") as string) || "";
      subject = (formData.get("subject") as string) || "";
      body = (formData.get("body") as string) || "";
    }
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!email || !subject || !body) {
    return Response.json(
      { success: false, message: "All fields are required." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return Response.json(
      { success: false, message: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  try {
    await sendEmail(env, email, subject, body);
    return Response.json({ success: true, message: "Message sent. You have been CCed." });
  } catch (err) {
    console.error("Failed to send email:", err);
    return Response.json(
      { success: false, message: "Failed to send email. Try again later or send from your email client." },
      { status: 500 },
    );
  }
};

async function sendEmail(env: Env, replyTo: string, subject: string, body: string): Promise<void> {
  const smtp = await SMTPSession.connect(
    env.SMTP_SERVER || "smtp.protonmail.ch",
    parsePort(env.SMTP_PORT || "587"),
    requiredEnv(env.SMTP_USERNAME, "SMTP_USERNAME"),
    requiredEnv(env.SMTP_PASSWORD, "SMTP_PASSWORD"),
  );

  try {
    await smtp.sendMail(
      requiredEnv(env.FROM_NAME, "FROM_NAME"),
      requiredEnv(env.FROM_EMAIL, "FROM_EMAIL"),
      requiredEnv(env.TO_EMAIL, "TO_EMAIL"),
      replyTo,
      subject,
      body,
    );
  } finally {
    await smtp.quit();
  }
}

function parsePort(value: string): number {
  const port = Number.parseInt(value, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port");
  }
  return port;
}

function requiredEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function headerValue(value: string, name: string): string {
  const clean = value.replace(/[\r\n]/g, " ").trim();
  if (!clean) throw new Error(`${name} is empty`);
  return clean;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n]/.test(value);
}

class SMTPSession {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private buffer = "";

  private constructor(private socket: Socket) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  static async connect(host: string, port: number, username: string, password: string): Promise<SMTPSession> {
    // Proton Mail SMTP submission uses plaintext SMTP followed by STARTTLS on port 587.
    const socket = connect(
      { hostname: host, port },
      { secureTransport: "starttls", allowHalfOpen: false },
    );
    const session = new SMTPSession(socket);

    await session.readResponse(220);
    await session.ehlo();

    await session.sendCommand("STARTTLS");
    await session.readResponse(220);
    session.upgradeToTls(host);
    await session.ehlo();

    await session.sendCommand("AUTH LOGIN");
    await session.readResponse(334);
    await session.sendCommand(btoa(username));
    await session.readResponse(334);
    await session.sendCommand(btoa(password));
    await session.readResponse(235);

    return session;
  }

  async sendMail(
    fromName: string,
    fromEmail: string,
    toEmail: string,
    replyTo: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const cleanFromName = headerValue(fromName, "FROM_NAME");
    const cleanFromEmail = headerValue(fromEmail, "FROM_EMAIL");
    const cleanToEmail = headerValue(toEmail, "TO_EMAIL");
    const cleanReplyTo = headerValue(replyTo, "Reply-To");
    const cleanSubject = headerValue(subject, "Subject");

    await this.sendCommand(`MAIL FROM:<${cleanFromEmail}>`);
    await this.readResponse(250);

    for (const recipient of [cleanToEmail, cleanReplyTo]) {
      await this.sendCommand(`RCPT TO:<${recipient}>`);
      await this.readResponse(250);
    }

    await this.sendCommand("DATA");
    await this.readResponse(354);

    const safeBody = body.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    const raw = [
      `From: ${cleanFromName} <${cleanFromEmail}>`,
      `To: ${cleanToEmail}`,
      `Cc: ${cleanReplyTo}`,
      `Reply-To: ${cleanReplyTo}`,
      `Subject: ${cleanSubject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      safeBody,
      ".",
    ].join("\r\n");

    await this.sendCommand(raw);
    await this.readResponse(250);
  }

  async quit(): Promise<void> {
    try {
      await this.sendCommand("QUIT");
      await this.readResponse(221);
    } finally {
      this.reader.releaseLock();
      this.writer.releaseLock();
      await this.socket.close();
    }
  }

  private async ehlo(): Promise<void> {
    await this.sendCommand("EHLO lukeh.xyz");
    await this.readResponse(250);
  }

  private upgradeToTls(host: string): void {
    this.reader.releaseLock();
    this.writer.releaseLock();
    this.socket = this.socket.startTls({ expectedServerHostname: host });
    this.reader = this.socket.readable.getReader();
    this.writer = this.socket.writable.getWriter();
  }

  private async sendCommand(command: string): Promise<void> {
    await this.writer.write(new TextEncoder().encode(command + "\r\n"));
  }

  private async readResponse(expectedCode?: number): Promise<string> {
    while (true) {
      const { value, done } = await this.reader.read();
      if (done) throw new Error("SMTP connection closed unexpectedly");
      this.buffer += new TextDecoder().decode(value);

      while (this.buffer.includes("\r\n")) {
        const nlIndex = this.buffer.indexOf("\r\n");
        const line = this.buffer.slice(0, nlIndex);
        this.buffer = this.buffer.slice(nlIndex + 2);

        if (line.length >= 3) {
          const code = Number.parseInt(line.slice(0, 3), 10);
          const isLast = line.length < 4 || line[3] === " ";

          if (isLast) {
            if (expectedCode && code !== expectedCode) {
              throw new Error(`SMTP error: expected ${expectedCode}, got ${code}: ${line}`);
            }
            return line;
          }
        }
      }
    }
  }
}
