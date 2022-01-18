SET NAMES UTF8;
DROP DATABASE IF EXISTS tel;
CREATE DATABASE tel CHARSET=UTF8;
USE tel;

/**用户表**/
CREATE TABLE tel_user(
  uid INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(32),
  upwd VARCHAR(32),
  email VARCHAR(64),
  phone VARCHAR(16),
  age INT,
  avatar VARCHAR(128) default null,  #头像图片路径
  user_name VARCHAR(32),      #真实姓名，如王小明
  gender INT                  #性别  0-女  1-男
);

/**电话表**/
CREATE TABLE tel_contacts(
  uid INT PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(32),      #真实姓名，如王小明
  email VARCHAR(64),
  phone VARCHAR(16),
  age INT,
  gender INT,                 #性别  0-女  1-男
  islove INT default 0        #是否收藏  0-否  1-是
);

/**用户信息**/
INSERT INTO tel_user VALUES
(NULL, 'dingding', '123456', 'ding@qq.com', '13501234567', '23' , default, '丁伟', '1'),
(NULL, 'dangdang', '123456', 'dang@qq.com', '13501234568', '26' , default, '林当', '1'),
(NULL, 'doudou', '123456', 'dou@qq.com', '13501234569', '45' , default, '窦志强', '1'),
(NULL, 'yaya', '123456', 'ya@qq.com', '13501234560', '15' , default, '秦小雅', '0');

/**电话表信息**/
INSERT INTO tel_contacts VALUES
(NULL, '嘉然' , 'jiaran@qq.com' , '15645678956' , '15' , '0' , default),
(NULL, '孙狗' , 'xungou@qq.com' , '13746412894' , '46' , '1' , default),
(NULL, '王喜顺' , 'xishun@qq.com' , '18656124578' , '22' , '1' , default),
(NULL, '周淑怡' , 'shuyi@qq.com' , '17013130002' , '27' , '0' , default),
(NULL, '大司马' , 'malaoshi@qq.com' , '13800261010' , '30' , '1' , default);