import { Injectable, Logger, Scope } from "@nestjs/common";
import { IPayloadSlack, NotiSlack } from "src/shared/config/slack.config";

@Injectable({scope: Scope.REQUEST})
export class LoggerService extends Logger {
    constructor(private notiSlack?: NotiSlack){
      super()
    }
    error(message: any, trace?: string, context?: string) {
      // TO DO
      super.error(message)
      const payload = {
          channel: process.env.CHANNEL_SLACK_ID || "",
          attachments: [
            {
              title: "Error message from service",
              text: message,
              author_name: "system",
              color: "#ff0000",
            },
          ],
        };
      this.notiSlack.sendError(payload as IPayloadSlack);
    }
    
    log(message: any, context?: string) {
        super.log(message, context)
    }
    warn(message: any, context?: string) {
        super.warn(message, context)
    }
}