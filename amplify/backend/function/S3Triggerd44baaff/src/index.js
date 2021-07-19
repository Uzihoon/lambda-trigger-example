// eslint-disable-next-line

const sharp = require('sharp');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function(event, context) {
  if (event.Records[0].eventName === 'ObjectRemoved:Delete') return;

  const BUCKET = event.Records[0].s3.bucket.name;
  const KEY = event.Records[0].s3.object.key;

  try {
    let image = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise();
    image = await sharp(image.Body);

    const metadata = await image.metadata();

    if (metadata.width > 1000) {
      const resizedImage = await image.resize({ width: 1000 }).toBuffer();

      await s3
        .putObject({
          Bucket: BUCKET,
          Body: resizedImage,
          key: KEY
        })
        .promise();

      return;
    } else {
      return;
    }
  } catch (err) {
    context.fail('Error getting files');
  }
};
