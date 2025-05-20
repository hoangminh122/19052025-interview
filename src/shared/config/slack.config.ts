import { Injectable } from "@nestjs/common";
import { fetchApi } from "../utils/fetch-api";

interface IPayloadSlack {
    channel: string,
    attachments: [
      {
        title: string,
        text: string,
        author_name: string,
        color: string,
      },
    ],
}

@Injectable()
class NotiSlack {
    constructor(){}

    async sendError(payload: IPayloadSlack){
        try{
            const result = await fetchApi(
                { host: "https://slack.com/api/chat.postMessage" },
                { 
                    body: JSON.stringify(payload),
                    method:METHOD_REQUEST.POST,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Content-Length": JSON.stringify(payload).length,
                        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN || ''}`,
                        Accept: "application/json",
                    }
                }
            );
            
            if(result?.ok === false) console.error(`[SLACK]: Send message error to slack fail!`);
            return true;
        } catch(err){
            console.log(err)
            // do not something
        }
    }
}

export {
    IPayloadSlack,
    NotiSlack
}