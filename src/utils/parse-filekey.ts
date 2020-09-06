import path from 'path';

export function parseFileKey(f, pad, delimeter = "-") {
    return path.dirname(f) + "/" + path.basename(f, path.extname(f)) + delimeter + pad + path.extname(f.toLowerCase());
}
