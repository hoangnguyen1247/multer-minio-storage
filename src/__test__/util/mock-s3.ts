import events from "events";
import concat from "concat-stream";

function createMockS3(): any {
    function upload(opts) {
        const ee: any = new events.EventEmitter();

        ee.send = function send(cb) {
            opts["Body"].pipe(concat(function (body) {
                ee.emit("httpUploadProgress", { total: body.length });
                cb(null, {
                    "Location": "mock-location",
                    "ETag": "mock-etag"
                });
            }));
        };

        return ee;
    }

    function putObject(bucket, key, streamOrBuffer, size, cb) {
        cb(null, {
            "location": "mock-location",
            "etag": "mock-etag",
        });
    }

    return {
        upload: upload,
        putObject: putObject,
    };
}

export default createMockS3;
