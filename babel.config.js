module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true,
          "chrome": "58",
          "ie": "11"
        }
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    "lodash",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime"
  ]
}