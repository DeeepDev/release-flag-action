import * as core from "@actions/core";
import axios from "axios";
import FormData from "form-data";

export async function sendTelegramMessage(flagBuf: Buffer): Promise<any> {
  const chatId = core.getInput("telegram_to");
  const token = core.getInput("telegram_token");
  const message = core.getInput("telegram_message");
  const messageFormat = core.getInput("telegram_message_format");

  const telegramUrl = `https://api.telegram.org/bot${token}/sendPhoto`;

  const form = new FormData();

  form.append("chat_id", chatId);
  form.append("photo", flagBuf, { filename: "image.jpeg" });
  form.append("caption", message);
  form.append("parse_mode", messageFormat);

  return axios.post(telegramUrl, form).then((res) => {
    console.log(`Telegram message response status code: ${res.status}`);
    console.log(res.data.ok ? "Telegram message sent successfully" : "Sending telegram message failed!");
  });
}
