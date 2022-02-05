# Multer MinIO Storage

Multer storage for MinIO.

This project is inspired from [Multer S3](https://github.com/badunk/multer-s3)

## Installation

```sh
npm install --save multer-minio-storage
```

## Usage

```javascript
var minio = require('minio')
var express = require('express')
var multer = require('multer')
var multerMinIOStorage = require('multer-minio-storage')

var app = express()
var minioClient = new minio.Client({ /* ... */ })

var upload = multer({
  storage: multerMinIOStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.post('/upload', upload.single('file'), function(req, res, next) {
  res.send('Successfully uploaded ' + req.file.originalname);
})

app.post('/upload', upload.array('photos', 3), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!');
})
```

### File information

Each file contains the following information exposed by `multer-minio-storage`:

Key | Description | Note
--- | --- | ---
`size` | Size of the file in bytes |
`bucket` | The bucket used to store the file | `MulterMinioStorage`
`key` | The name of the file | `MulterMinioStorage`
`acl` | Access control for the file | `MulterMinioStorage`
`contentType` | The `mimetype` used to upload the file | `MulterMinioStorage`
`metadata` | The `metadata` object to be sent to Minio | `MulterMinioStorage`
`location` | The Minio `url` to access the file  | `MulterMinioStorage`
`etag` | The `etag`of the uploaded file in Minio  | `MulterMinioStorage`
`contentDisposition` | The `contentDisposition` used to upload the file | `MulterMinioStorage`
`storageClass` | The `storageClass` to be used for the uploaded file in Minio | `MulterMinioStorage`
`versionId` | The `versionId` is an optional param returned by Minio for versioned buckets. | `MulterMinioStorage`

### Setting ACL

[ACL values](http://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) can be set by passing an optional `acl` parameter into the `multerMinioStorage` object.

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```

Available options for canned ACL.

ACL Option | Permissions added to ACL
--- | ---
`private` | Owner gets `FULL_CONTROL`. No one else has access rights (default).
`public-read` | Owner gets `FULL_CONTROL`. The `AllUsers` group gets `READ` access.
`public-read-write` | Owner gets `FULL_CONTROL`. The `AllUsers` group gets `READ` and `WRITE` access. Granting this on a bucket is generally not recommended.
`aws-exec-read` | Owner gets `FULL_CONTROL`. Amazon EC2 gets `READ` access to `GET` an Amazon Machine Image (AMI) bundle from Amazon S3.
`authenticated-read` | Owner gets `FULL_CONTROL`. The `AuthenticatedUsers` group gets `READ` access.
`bucket-owner-read` | Object owner gets `FULL_CONTROL`. Bucket owner gets `READ` access. If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
`bucket-owner-full-control` | Both the object owner and the bucket owner get `FULL_CONTROL` over the object. If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
`log-delivery-write` | The `LogDelivery` group gets `WRITE` and `READ_ACP` permissions on the bucket. For more information on logs.

## Setting Metadata

The `metadata` option is a callback that accepts the request and file, and returns a metadata object to be saved to Minio.

Here is an example that stores all fields in the request body as metadata, and uses an `id` param as the key: 

```javascript
var opts = {
    minioClient: minioClient,
    bucket: config.originalsBucket,
    metadata: function (req, file, cb) {
      cb(null, Object.assign({}, req.body));
    },
    key: function (req, file, cb) {
      cb(null, req.params.id + ".jpg");
    }
  };
```

## Setting Cache-Control header

The optional `cacheControl` option sets the `Cache-Control` HTTP header that will be sent if you're serving the files directly from Minio. You can pass either a string or a function that returns a string.

Here is an example that will tell browsers and CDNs to cache the file for one year:

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    cacheControl: 'max-age=31536000',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```

## Setting Custom Content-Type

The optional `contentType` option can be used to set Content/mime type of the file. By default the content type is set to `application/octet-stream`. If you want multer-s3 to automatically find the content-type of the file, use the `multerMinioStorage.AUTO_CONTENT_TYPE` constant. Here is an example that will detect the content type of the file being uploaded.

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    contentType: multerMinioStorage.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```
You may also use a function as the `contentType`, which should be of the form `function(req, file, cb)`.

## Setting StorageClass

[storageClass values](https://aws.amazon.com/s3/storage-classes/) can be set by passing an optional `storageClass` parameter into the `multerMinioStorage` object.

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    acl: 'public-read',
    storageClass: 'REDUCED_REDUNDANCY',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```

## Setting Content-Disposition

The optional `contentDisposition` option can be used to set the `Content-Disposition` header for the uploaded file. By default, the `contentDisposition` isn't forwarded. As an example below, using the value `attachment` forces the browser to download the uploaded file instead of trying to open it.

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    acl: 'public-read',
    contentDisposition: 'attachment',
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```

## Using Server-Side Encryption

*An overview of S3's server-side encryption can be found in the [S3 Docs] (http://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html); be advised that customer-managed keys (SSE-C) is not implemented at this time.*

You may use the S3 server-side encryption functionality via the optional `serverSideEncryption` and `sseKmsKeyId` parameters. Full documentation of these parameters in relation to the S3 API can be found [here] (http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property) and [here] (http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html). 

`serverSideEncryption` has two valid values: 'AES256' and 'aws:kms'. 'AES256' utilizes the S3-managed key system, while 'aws:kms' utilizes the AWS KMS system and accepts the optional `sseKmsKeyId` parameter to specify the key ID of the key you wish to use. Leaving `sseKmsKeyId` blank when 'aws:kms' is specified will use the default KMS key. **Note:** *You must instantiate the S3 instance with `signatureVersion: 'v4'` in order to use KMS-managed keys [[Docs]] (http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingAWSSDK.html#specify-signature-version), and the specified key must be in the same AWS region as the S3 bucket used.*

```javascript
var upload = multer({
  storage: multerMinioStorage({
    minioClient: minioClient,
    bucket: 'some-bucket',
    acl: 'authenticated-read',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256',
    key: function(req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
```

## Testing

The tests mock all access to S3 and can be run completely offline.

```sh
npm test
```
