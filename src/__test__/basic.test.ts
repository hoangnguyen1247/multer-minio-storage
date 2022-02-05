import fs from "fs";
import path from "path";
import multer from "multer";
import stream from "stream";
import FormData from "form-data";
import onFinished from "on-finished";

import mockS3 from "./util/mock-s3";
import multerS3, { AUTO_CONTENT_TYPE } from "..";

// var VALID_OPTIONS = {
//     bucket: 'string'
// }

// var INVALID_OPTIONS = [
//     ['numeric key', { key: 1337 }],
//     ['string key', { key: 'string' }],
//     ['numeric bucket', { bucket: 1337 }],
//     ['numeric contentType', { contentType: 1337 }]
// ]

function submitForm(multer, form, cb) {
    form.getLength(function (err, length) {
        if (err) return cb(err);

        const req: any = new stream.PassThrough();

        req.complete = false;
        form.once("end", function () {
            req.complete = true;
        });

        form.pipe(req);
        req.headers = {
            "content-type": "multipart/form-data; boundary=" + form.getBoundary(),
            "content-length": length
        };

        multer(req, null, function (err) {
            onFinished(req, function () { cb(err, req); });
        });
    });
}

describe("Multer S3", function () {
    test("is exposed as a function", function () {
        expect(typeof multerS3).toBe("function");
    });

    // INVALID_OPTIONS.forEach(function (testCase) {
    //     test('throws when given ' + testCase[0], function () {
    //         function testBody() {
    //             multerS3(extend(VALID_OPTIONS, testCase[1]))
    //         }

    //         assert.throws(testBody, TypeError)
    //     })
    // })

    test("upload files", function (done) {
        const s3 = mockS3();
        const form = new FormData();
        const storage = multerS3({
            minioClient: s3,
            bucket: "test",
        });
        const upload = multer({ storage: storage });
        const parser = upload.single("image");
        const image = fs.createReadStream(path.join(__dirname, "files", "ffffff.png"));

        form.append("name", "Multer");
        form.append("image", image);

        submitForm(parser, form, function (err, req) {
            // assert.ifError(err)

            expect(req.body.name).toBe("Multer");

            expect(req.file.fieldname).toBe("image");
            expect(req.file.originalname).toBe("ffffff.png");
            // expect(req.file.size).toBe(68)
            expect(req.file.bucket).toBe("test");
            expect(req.file.etag).toBe("mock-etag");
            // expect(req.file.location).toBe('mock-location')

            done();
        });
    });

    test("uploads file with AES256 server-side encryption", function (done) {
        const s3 = mockS3();
        const form = new FormData();
        const storage = multerS3({
            minioClient: s3,
            bucket: "test",
            serverSideEncryption: "AES256",
        });
        const upload = multer({ storage: storage });
        const parser = upload.single("image");
        const image = fs.createReadStream(path.join(__dirname, "files", "ffffff.png"));

        form.append("name", "Multer");
        form.append("image", image);

        submitForm(parser, form, function (err, req) {
            // assert.ifError(err)

            expect(req.body.name).toBe("Multer");

            expect(req.file.fieldname).toBe("image");
            expect(req.file.originalname).toBe("ffffff.png");
            // expect(req.file.size).toBe(68)
            expect(req.file.bucket).toBe("test");
            expect(req.file.etag).toBe("mock-etag");
            expect(req.file.location).toBe("mock-location");
            expect(req.file.serverSideEncryption).toBe("AES256");

            done();
        });
    });

    test("uploads file with AWS KMS-managed server-side encryption", function (done) {
        const s3 = mockS3();
        const form = new FormData();
        const storage = multerS3({
            minioClient: s3,
            bucket: "test",
            serverSideEncryption: "aws:kms",
        });
        const upload = multer({ storage: storage });
        const parser = upload.single("image");
        const image = fs.createReadStream(path.join(__dirname, "files", "ffffff.png"));

        form.append("name", "Multer");
        form.append("image", image);

        submitForm(parser, form, function (err, req) {
            // assert.ifError(err)

            expect(req.body.name).toBe("Multer");

            expect(req.file.fieldname).toBe("image");
            expect(req.file.originalname).toBe("ffffff.png");
            // expect(req.file.size).toBe(68)
            expect(req.file.bucket).toBe("test");
            expect(req.file.etag).toBe("mock-etag");
            expect(req.file.location).toBe("mock-location");
            expect(req.file.serverSideEncryption).toBe("aws:kms");

            done();
        });
    });

    test("uploads PNG file with correct content-type", function (done) {
        const s3 = mockS3();
        const form = new FormData();
        const storage = multerS3({
            minioClient: s3,
            bucket: "test",
            serverSideEncryption: "aws:kms",
            contentType: AUTO_CONTENT_TYPE,
        });
        const upload = multer({ storage: storage });
        const parser = upload.single("image");
        const image = fs.createReadStream(path.join(__dirname, "files", "ffffff.png"));

        form.append("name", "Multer");
        form.append("image", image);

        submitForm(parser, form, function (err, req) {
            // assert.ifError(err)

            expect(req.body.name).toBe("Multer");

            expect(req.file.fieldname).toBe("image");
            expect(req.file.contentType).toBe("image/png");
            expect(req.file.originalname).toBe("ffffff.png");
            // expect(req.file.size).toBe(68)
            expect(req.file.bucket).toBe("test");
            expect(req.file.etag).toBe("mock-etag");
            expect(req.file.location).toBe("mock-location");
            expect(req.file.serverSideEncryption).toBe("aws:kms");

            done();
        });
    });

    test("uploads SVG file with correct content-type", function (done) {
        const s3 = mockS3();
        const form = new FormData();
        const storage = multerS3({
            minioClient: s3,
            bucket: "test",
            serverSideEncryption: "aws:kms",
            contentType: AUTO_CONTENT_TYPE,
        });
        const upload = multer({ storage: storage });
        const parser = upload.single("image");
        const image = fs.createReadStream(path.join(__dirname, "files", "test.svg"));

        form.append("name", "Multer");
        form.append("image", image);

        submitForm(parser, form, function (err, req) {
            // assert.ifError(err)

            expect(req.body.name).toBe("Multer");

            expect(req.file.fieldname).toBe("image");
            expect(req.file.contentType).toBe("image/svg+xml");
            expect(req.file.originalname).toBe("test.svg");
            // expect(req.file.size).toBe(100)
            expect(req.file.bucket).toBe("test");
            expect(req.file.etag).toBe("mock-etag");
            expect(req.file.location).toBe("mock-location");
            expect(req.file.serverSideEncryption).toBe("aws:kms");

            done();
        });
    });
});
