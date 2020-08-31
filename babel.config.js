module.exports = {
    "ignore": [
        "node_modules",
        "build"
    ],
    "presets": [
        "@babel/preset-env",
        "@babel/preset-typescript"
    ],
    "plugins": [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        ["module-resolver", {
            "root": ["."],
            "extensions": [
                ".js",
                ".ts",
                ".tsx",
                ".json"
            ],
            "alias": {
                "src": ["./src/"],
                "server": ["./server/"]
            }
        }]
    ],
    "sourceMaps": "inline"
}
