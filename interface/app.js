const express = require('express');
const app = express();
app.listen(4242, () => {
    console.log('服务器启动成功...');
});
app.use(express.urlencoded({
    extended: false
}));

// 添加路由
const userRouter = require('./routes/user.js');
const telRouter = require('./routes/tel.js');
app.use('/v1/user', userRouter);
app.use('/v1/tel', telRouter);

// 托管静态资源
app.use(express.static('../public'));

// 添加错误处理中间件，拦截所有路由传递过来的错误
app.use((err, req, res, next) => {
    console.log(err);
    res.send({
        code: 500,
        msg: '服务器错误'
    });
});