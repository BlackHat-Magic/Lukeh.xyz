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

  if (!email || !subject || !body) {
    return Response.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    await sendEmail(env, email, subject, body);
    return Response.json({ success: true, message: "Message sent. You have been CCed." });
  } catch (err) {
    console.error("Failed to send email:", err);
    return Response.json(
      { success: false, message: "Failed to send email. Try again later or send from your email client." },
      { status: 500 }
    );
  }
};

async function sendEmail(env: Env, replyTo: string, subject: string, body: string): Promise<void> {
  const host = env.SMTP_SERVER;
  const port = parseInt(env.SMTP_PORT || "465", 10);
  const username = env.SMTP_USERNAME;
  const password = env.SMTP_PASSWORD;
  const fromName = env.FROM_NAME;
  const fromEmail = env.FROM_EMAIL;
  const toEmail = env.TO_EMAIL;

  const smtp = await SMTPSession.connect(host, port, username, password);
  await smtp.sendMail(fromName, fromEmail, toEmail, replyTo, subject, body);
  await smtp.quit();
}

class SMTPSession {
  private socket: Socket;
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private buffer = "";

  private constructor(socket: Socket) {
    this.socket = socket;
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  static async connect(host: string, port: number, username: string, password: string): Promise<SMTPSession> {
    const url = `${host}:${port}`;
    const socket = connect(url, { tls: true });
    const session = new SMTPSession(socket);

    await session.readResponse(220);
    await session.sendCommand(`EHLO lukeh.xyz`);
    await session.readResponse(250);

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
    await this.sendCommand(`MAIL FROM:<${fromEmail}>`);
    await this.readResponse(250);

    await this.sendCommand(`RCPT TO:<${toEmail}>`);
    await this.readResponse(250);

    await this.sendCommand("DATA");
    await this.readResponse(354);

    const raw = [
      `From: ${fromName} <${fromEmail}>`,
      `To: ${toEmail}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      "",
      body,
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
      this.socket.close();
    }
  }

  private async sendCommand(cmd: string): Promise<void> {
    const encoder = new TextEncoder();
    await this.writer.write(encoder.encode(cmd + "\r\n"));
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
          const code = parseInt(line.slice(0, 3), 10);
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
