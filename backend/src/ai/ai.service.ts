import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AiService {

  async summarize(messages: string[]) {

    const res = await axios.post(
      "http://localhost:8001/summarize",
      { messages }
    );

    return res.data;

  }

  async smartReplies(messages: string[]) {

    const res = await axios.post(
      "http://localhost:8001/smart-reply",
      { messages }
    );

    return res.data;

  }

}
