const express = require('express');
const pool = require('../pool.js');
const r = express.Router();


// 用户注册接口 方法：post
// http://127.0.0.1:4242/v1/user/register
r.post('/register', (req, res, next) => {
    var uname = req.body.uname;
    if (!uname || uname.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'uname-required'
        });
        return;
    }
    if (/^fuck|shit|damn|bitch$/.test(uname)) {
        res.send({
            code: 401,
            msg: '输入的用户名非法'
        });
        return;
    }
    var upwd = req.body.upwd;
    if (!upwd || upwd.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'upwd-required'
        });
        return;
    }
    var reg = /^[a-zA-Z0-9_-]{6,16}$/;
    if (!reg.test(upwd)) {
        res.send({
            code: 401,
            mag: '密码格式为6-16位的数字和字母'
        });
        return;
    }
    var email = req.body.email;
    if (!email || email.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'email-required'
        });
        return;
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        res.send({
            code: 401,
            msg: '邮箱格式错误'
        });
        return;
    }
    var phone = req.body.phone;
    if (!phone || phone.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'phone-required'
        });
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        res.send({
            code: 401,
            msg: '手机号码格式错误'
        });
        return;
    }
    var user_name = req.body.user_name;
    if (!user_name || user_name.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'user_name-required'
        });
        return;
    }
    if (!/^[\u4e00-\u9fa5]{0,}$/.test(user_name)) {
        res.send({
            code: 401,
            msg: '请输入正确的姓名格式'
        });
        return;
    }
    pool.query('select uid from tel_user where uname=? or email=? or phone=?', [uname, email, phone], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length !== 0) {
            res.send({
                code: 412,
                msg: 'data exists'
            });
        } else {
            pool.query('insert into tel_user set?', [req.body], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                res.send({
                    code: 200,
                    msg: '注册成功',
                });
            });
        }
    });
});

// 用户登录接口 方法：post
// http://127.0.0.1:4242/v1/user/login
r.post('/login', (req, res, next) => {
    pool.query('select * from tel_user where uname=? and upwd=?', [req.body.uname, req.body.upwd], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        console.log(result);
        if (result.length === 0) {
            res.send({
                code: 501,
                msg: '用户名或密码有误，登录失败！'
            });
        } else {
            res.send({
                code: 200,
                msg: '登录成功！'
            });
        }
    });
});

// 用户修改接口 方法：put
// http://127.0.0.1:4242/v1/user/info
r.put('/info', (req, res, next) => {
    var uname = req.body.uname;
    if (!uname || uname.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'uname-required'
        });
        return;
    }
    if (/^fuck|shit|damn|bitch$/.test(uname)) {
        res.send({
            code: 401,
            msg: '输入的用户名非法'
        });
        return;
    }
    var upwd = req.body.upwd;
    if (!upwd || upwd.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'upwd-required'
        });
        return;
    }
    var reg = /^[a-zA-Z0-9_-]{6,16}$/;
    if (!reg.test(upwd)) {
        res.send({
            code: 401,
            mag: '密码格式为6-16位的数字和字母'
        });
        return;
    }
    var email = req.body.email;
    if (!email || email.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'email-required'
        });
        return;
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        res.send({
            code: 401,
            msg: '邮箱格式错误'
        });
        return;
    }
    var phone = req.body.phone;
    if (!phone || phone.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'phone-required'
        });
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        res.send({
            code: 401,
            msg: '手机号码格式错误'
        });
        return;
    }
    var user_name = req.body.user_name;
    if (!user_name || user_name.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'user_name-required'
        });
        return;
    }
    if (!/^[\u4e00-\u9fa5]{0,}$/.test(user_name)) {
        res.send({
            code: 401,
            msg: '请输入正确的姓名格式'
        });
        return;
    }
    pool.query('select uid from tel_user where uname=? or email=? or phone=?', [uname, email, phone], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length !== 0) {
            res.send({
                code: 412,
                msg: 'data exists'
            });
        } else {
            pool.query('update tel_user set? where uid=?', [req.body, req.body.uid], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                if (result.affectedRows === 0) {
                    res.send({
                        code: 500,
                        msg: '修改失败，该用户不存在'
                    });

                } else {
                    res.send({
                        code: 200,
                        msg: '修改成功'
                    });
                }
            });
        }
    });
});

// 查找用户id 方法：post
// http://127.0.0.1:4242/v1/user/check_uid
r.post('/check_uid', (req, res, next) => {
    var userName = req.body.uname;
    var sql = 'select uid from tel_user where uname=?';
    pool.query(sql, userName, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length === 0) {
            res.send({
                code: 400,
                msg: '查无此人'
            });
        } else {
            res.send({
                code: 200,
                msg: '成功',
                thisId: result[0].uid
            });
        }
    });
});

// 验证用户名 方法：post
// http://127.0.0.1:4242/v1/user/check_uname
r.post('/check_uname', (req, res, next) => {
    var uname = req.body.uname;
    // console.log(uname);
    // console.log(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(uname));
    if (!uname || uname.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'uname-required'
        });
        return;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(uname)) {
        res.send({
            code: 401,
            msg: '格式错误'
        });
        return;
    }
    pool.query('select * from tel_user where uname=?', [uname], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length !== 0) {
            res.send({
                code: 412,
                msg: 'exists'
            });
        } else {
            res.send({
                code: 200,
                msg: 'non-exists'
            });
        }
    });
});

// 验证密码 方法：post
// http://127.0.0.1:4242/v1/user/check_upwd
r.post('/check_upwd', (req, res, next) => {
    var upwd = req.body.upwd;
    if (!upwd || upwd.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'upwd-required'
        });
        return;
    }
    var reg = /^[a-zA-Z0-9_-]{6,16}$/;
    if (!reg.test(upwd)) {
        res.send({
            code: 401,
            mag: '密码格式为6-16位的数字和字母'
        });
    } else {
        res.send({
            code: 200,
            mag: 'right'
        });
    }
});

// 验证邮箱 方法：post
// http://127.0.0.1:4242/v1/user/check_email
r.post('/check_email', (req, res, next) => {
    var email = req.body.email;
    if (!email || email.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'email-required'
        });
        return;
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        res.send({
            code: 401,
            msg: '邮箱格式错误'
        });
        return;
    }
    pool.query('select * from tel_user where email=?', email, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length !== 0) {
            res.send({
                code: 412,
                msg: 'exists'
            });
        } else {
            res.send({
                code: 200,
                msg: 'non-exists'
            });
        }
    });
});

// 验证手机 方法：post
// http://127.0.0.1:4242/v1/user/check_phone
r.post('/check_phone', (req, res, next) => {
    var phone = req.body.phone;
    if (!phone || phone.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'phone-required'
        });
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        res.send({
            code: 401,
            msg: '手机号码格式错误'
        });
        return;
    }
    pool.query('select uid from tel_user where phone=?', phone, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.length !== 0) {
            res.send({
                code: 412,
                msg: 'exists'
            });
        } else {
            res.send({
                code: 200,
                msg: 'non-exists'
            });
        }
    });
});

// 验证年龄 方法：post
// http://127.0.0.1:4242/v1/user/check_age
r.post('/check_age', (req, res, next) => {
    var age = req.body.age;
    if (!age || age.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'age-required'
        });
    } else {
        res.send({
            code: 200,
            msg: '格式正确'
        });
    }
});

// 验证真实姓名 方法：post
// http://127.0.0.1:4242/v1/user/check_user_name
r.post('/check_user_name', (req, res, next) => {
    var user_name = req.body.user_name;
    if (!user_name || user_name.trim().length === 0) {
        res.send({
            code: 400,
            msg: 'user_name-required'
        });
        return;
    }
    if (!/^[\u4e00-\u9fa5]{0,}$/.test(user_name)) {
        res.send({
            code: 401,
            msg: '请输入正确的姓名格式'
        });
    } else {
        res.send({
            code: 200,
            msg: '格式正确'
        });
    }
});


// 个人中心接口 方法：userPage
// http://127.0.0.1:4242/v1/user/userPage
r.get('/userPage', (req, res, next) => {
    pool.query('select * from tel_user where uid=?', [req.query.uid], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.send({
            code: 200,
            msg: result
        });
    });
});

// 用户注销接口 方法：delete
// http://127.0.0.1:4242/v1/user/delete
r.delete('/delete', (req, res, next) => {
    pool.query('delete from tel_user where uid=?', [req.body.uid], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        if (result.affectedRows === 0) {
            res.send({
                code: 500,
                msg: '删除失败'
            });
        } else {
            res.send({
                code: 200,
                msg: '删除成功'
            });
        }
    });
});


module.exports = r;