module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true,
          "chrome": "50",
          "ie": "9"
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