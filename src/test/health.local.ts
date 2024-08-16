import {handler} from '../functions/health/handler'
const eventpayload = {
    "body": "this is a test",
} as unknown
const context = {'test': 'me'}
import {
    APIGatewayProxyEventV2,
  } from "aws-lambda";
//@ts-ignore
handler(eventpayload, context).then((response:APIGatewayProxyEventV2) => console.log(response)).catch((error:any) => console.log(error))