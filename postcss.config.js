const cssnext = require('postcss-cssnext');

module.exports = {
    plugins: [
        cssnext({
            features: {
                customProperties: {
                    variables: {
                        subjectColor: '#fc8247',
                        subjectColorDeeper: '#fb7a43',

                        font1: '#515260',  // 深文字
                        font2: '#b2bcc0',  // 浅文字
                        font3: '#d7dde1',  // 边线或极浅文字

                        border: '#efefef', // 背景或者边线
                        bg: '#fafafa',
                    }
                },
                autoprefixer: {
                    browsers: [
                        'last 3 versions',
                        'ie >= 8',
                        'ff >= 30',
                        'chrome >= 34',
                        'safari >= 6',
                        'opera >= 12'
                    ]
                },
            }
        })
    ]
};
