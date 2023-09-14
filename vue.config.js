let publicPath = '/tractoscope';

if (process.env.NODE_ENV !== 'production') {
    publicPath = '/';
} else if (process.env.DEPLOY_ENV === 'netlify') {
    publicPath = '/';
}

module.exports = {
  publicPath: publicPath
}

