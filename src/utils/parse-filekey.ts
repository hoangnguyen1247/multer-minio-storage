import path from 'path';

export function parseFileKey(fileKey, pad) {
    return (
        path.basename(fileKey, path.extname(fileKey)) +
        pad +
        '.' +
        path.extname(fileKey)
    );
}
