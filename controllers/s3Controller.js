const fs = require('fs');
const mime = require('mime-types');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 Client
const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Upload files to S3
exports.uploadFiles = async (req, res) => {
    try {
        const files = req.files.file; // Access files from the request

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No file provided for upload.' });
        }

        const links = [];
        for (const file of files) {
            const ext = file.originalFilename.split('.').pop();
            const newFilename = `${Date.now()}.${ext}`;
            const fileContent = await fs.promises.readFile(file.path);

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: newFilename,
                Body: fileContent,
                ACL: 'public-read',
                ContentType: mime.lookup(file.originalFilename) || 'application/octet-stream',
            };

            await s3Client.send(new PutObjectCommand(uploadParams));
            const link = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${newFilename}`;
            links.push(link);
        }

        res.status(200).json({ links });
    } catch (error) {
        console.error('Error uploading file to S3:', error.message);
        res.status(500).json({ error: 'Failed to upload file.' });
    }
};

// Delete a file from S3
exports.deleteFile = async (req, res) => {
    try {
        const { filename } = req.query;

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required.' });
        }

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        res.status(200).json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file from S3:', error.message);
        res.status(500).json({ error: 'Failed to delete file.' });
    }
};
