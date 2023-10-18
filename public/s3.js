
const AWS_ACCESS_KEY_ID = 'AKIAXKQEJUDLDKV45O7O';
const AWS_SECRET_ACCESS_KEY = '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';
const AWS_REGION = 'us-east-1';

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const s3 = new AWS.S3();

const imageButton = document.getElementById("imageInput");
imageButton.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (file) {
        const params = {
            Bucket: "xchange-users",
            Key: 'keyOfObject', // The unique key for the image might need to use UID here?
            Body: file
        }
        s3.upload(params, (err, data) => {
            // console.log("loading")
            if (err) {
                console.error('S3 upload error:', err);
            } else {
                console.log('Image uploaded:', data.Location);
            }
        });
    }
});