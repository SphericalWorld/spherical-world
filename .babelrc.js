module.exports = {
	"presets": [
    "@babel/preset-typescript", ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 3%", "not ie <= 11"]
      },
      "useBuiltIns": false
    }]
  ],
	"plugins": [
    './common/ecs/utils/babelPlugin.js',
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining"
  ]
}
