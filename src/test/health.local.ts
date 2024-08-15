import {handler} from '../functions/health/handler'
const eventpayload = {
    "body": "this is a test"
}
const context = {'test': 'me'}
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
    Context,
  } from "aws-lambda";

  handler(eventpayload, context).then((response) => console.log(response)).catch((error) => console.log(error))