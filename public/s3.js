AWS.config.update({
    accessKeyId: 'AKIAXKQEJUDLDKV45O7O',
    secretAccessKey: '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',
    region: 'us-east-1'
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
            if (err) {
                console.error('S3 upload error:', err);
            } else {
                console.log('Image uploaded:', data.Location);
            }
        });
    }
});