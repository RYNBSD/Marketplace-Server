import { createTransport } from "nodemailer";
import { ENV } from "../constant/index.js";

export default class Mail {
  private readonly to: string;
  private readonly subject: string;
  private readonly html: string;

  private readonly options = {
    transport: {
      service: "gmail",
      auth: {
        user: ENV.MAIL.USER,
        pass: ENV.MAIL.PASS,
      },
    },
  };
  private readonly transport: ReturnType<typeof createTransport>;

  constructor(to: string, subject: string, html: string) {
    this.transport = createTransport(this.options.transport);
    this.to = to;
    this.subject = subject;
    this.html = html;
  }

  async send() {
    await this.transport.sendMail({
      to: this.to,
      subject: this.subject,
      html: this.html,
    });
    this.transport.close();
  }

  static errorTemplate(error: object) {
    return `
      <pre>
        ${JSON.stringify(error, null, 4)}
      </pre>
    `;
  }
}
