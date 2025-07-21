-- 数据库迁移脚本：将deleted字段重命名为is_deleted

USE ecommerce;

-- 更新用户表
ALTER TABLE user CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新商品分类表
ALTER TABLE category CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新商品表
ALTER TABLE product CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新商品图片表
ALTER TABLE product_image CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新购物车表
ALTER TABLE cart CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新用户地址表
ALTER TABLE user_address CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新订单表
ALTER TABLE orders CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新订单项表
ALTER TABLE order_item CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';

-- 更新支付记录表
ALTER TABLE payment CHANGE COLUMN deleted is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';
