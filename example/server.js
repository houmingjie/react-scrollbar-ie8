var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var appWebpackConfig = require('./webpack.config');

appWebpackConfig.entry.unshift('eventsource-polyfill', 'webpack-dev-server/client?http://localhost:8001', 'webpack/hot/dev-server');
appWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

const app = new WebpackDevServer(webpack(appWebpackConfig), {
    publicPath: appWebpackConfig.output.publicPath,
    hot: true,
    inline: true,
    historyApiFallback: false,
    stats: { colors: true },
    disableHostCheck: true,
});
app.listen(8001);

console.info('server started at 8001');
