const express = require('express');
const pool = require('../pool.js');
const r = express.Router();

// 添加联系人接口 post
// http://127.0.0.1:4242/v1/tel/add
r.post('/add', (req, res, next) => {
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
    pool.query('select uid from tel_contacts where email=? or phone=?', [email, phone], (err, result) => {
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
            pool.query('insert into tel_contacts set?', [req.body], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                res.send({
                    code: 201,
                    uid: result.insertId
                });
            });
        }
    });
});

// 删除联系人接口 delete
// http://127.0.0.1:4242/v1/tel/delete
r.delete('/delete', (req, res, next) => {
    pool.query('delete from tel_contacts where uid=?', [req.body.uid], (err, result) => {
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

// 修改联系人接口 put
// http://127.0.0.1:4242/v1/tel/update
r.put('/update', (req, res, next) => {
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
            code: 402,
            msg: 'phone-required'
        });
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        res.send({
            code: 403,
            msg: '手机号码格式错误'
        });
        return;
    }
    var user_name = req.body.user_name;
    if (!user_name || user_name.trim().length === 0) {
        res.send({
            code: 404,
            msg: 'user_name-required'
        });
        return;
    }
    if (!/^[\u4e00-\u9fa5]{0,}$/.test(user_name)) {
        res.send({
            code: 405,
            msg: '请输入正确的姓名格式'
        });
        return;
    }
    pool.query('select uid from tel_contacts where email=? or phone=?', [email, phone], (err, result) => {
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
            var sql = 'update tel_contacts set? where uid=?';
            pool.query(sql, [req.body, req.body.uid], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                if (result.affectedRows === 0) {
                    res.send({
                        code: 500,
                        msg: '修改失败，该联系人不存在'
                    });

                } else {
                    res.send({
                        code: 200,
                        msg: result
                    });
                }
            });
        }
    });
});

// 分页查找联系人接口 get
// http://127.0.0.1:4242/v1/tel/find_contact
r.get('/find_contact', (req, res, next) => {
    var pageSize = parseInt(req.query.pageSize);
    var pageNum = req.query.pageNum;
    var start = (pageNum - 1) * pageSize;
    var sql1 = 'select * from tel_contacts limit ?,?';
    var sql2 = 'select count(uid) from tel_contacts';
    pool.query(sql2, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        // console.log(result[0]['count(uid)']);
        var dataCount = result[0]['count(uid)'];
        var pageCount = Math.ceil((result[0]['count(uid)'] / pageSize));
        pool.query(sql1, [start, pageSize], (err, result) => {
            if (err) {
                next(err);
                return;
            }
            res.send({
                pageSize: pageSize,
                pageNum: pageNum,
                dataCount: dataCount,
                pageCount: pageCount,
                msg: result
            });
        });
    });
});

// 模糊查找联系人接口 get
// http://127.0.0.1:4242/v1/tel/search_contact
r.get('/search_contact', (req, res, next) => {
    var sql1 = 'select count(uid) from tel_contacts where user_name like ? or phone like ?';
    var sql2 = 'select * from tel_contacts where user_name like ? or phone like ? limit ?,?';
    var user_name = '%' + req.query.user_name + '%';
    var phone = '%' + req.query.phone + '%';
    var pageSize = parseInt(req.query.pageSize);
    var pageNum = req.query.pageNum;
    var start = (pageNum - 1) * pageSize;
    pool.query(sql1, [user_name, phone], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        var dataCount = result[0]['count(uid)'];
        var pageCount = Math.ceil(dataCount / pageSize);
        pool.query(sql2, [user_name, phone, start, pageSize], (err, result) => {
            if (err) {
                next(err);
                return;
            }
            console.log(result);
            res.send({
                pageSize: pageSize,
                pageNum: pageNum,
                dataCount: dataCount,
                pageCount: pageCount,
                msg: result
            });
        });
    });
});

// 操作重要联系人 post
// http://127.0.0.1:4242/v1/tel/ope_important
r.post('/ope_important', (req, res, next) => {
    var sql = 'update tel_contacts set islove=? where uid=?';
    var uid = req.body.uid;
    var islove = req.body.islove
    pool.query(sql, [islove, uid], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        // console.log(result , islove);
        if (result.affectedRows === 0) {
            res.send({
                code: 400,
                msg: '操作重要联系人失败'
            });
        } else {
            res.send({
                code: 200,
                flag: islove,
                msg: '操作成功'
            });
        }
    });
});

// 查询重要联系人 get
// http://127.0.0.1:4242/v1/tel/important_contact
r.get('/important_contact', (req, res, next) => {
    var sql = 'select * from tel_contacts where islove=1';
    pool.query(sql, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        // console.log(result);
        if (result.length === 0) {
            res.send({
                code: 401,
                msg: 'important-empty'
            });
        } else {
            res.send({
                code: 201,
                msg: result
            });
        }
    });
});

// 验证真实姓名 方法：post
// http://127.0.0.1:4242/v1/tel/check_user_name
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

// 验证手机 方法：post
// http://127.0.0.1:4242/v1/tel/check_phone
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
    pool.query('select uid from tel_contacts where phone=?', phone, (err, result) => {
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

// 验证邮箱 方法：post
// http://127.0.0.1:4242/v1/tel/check_email
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
    pool.query('select uid from tel_contacts where email=?', email, (err, result) => {
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

module.exports = r;