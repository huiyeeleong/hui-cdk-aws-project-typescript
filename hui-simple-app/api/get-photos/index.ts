//import dependecies
import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResultV2
} from 'aws-lambda';

//import bucket name
const bucketName = process.env.PHOTO_BUCKET_NAME;

//create function
async function getPhotos(
    event: APIGatewayProxyEventV2, 
    context: Context): Promise <APIGatewayProxyResultV2> {
        console.log("I got the bucket name and it is " + bucketName);
        return {
            statusCode: 200,
            body: 'Hello from lambda, it is working!',
        };

}
export {getPhotos}