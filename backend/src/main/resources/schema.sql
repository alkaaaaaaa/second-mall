-- 创建数据库
CREATE DATABASE IF NOT EXISTS ecommerce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecommerce;

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像URL',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
) COMMENT '用户表';

-- 商品分类表
CREATE TABLE IF NOT EXISTS category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类',
    sort_order INT DEFAULT 0 COMMENT '排序字段',
    status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '商品分类表';

-- 商品表
CREATE TABLE IF NOT EXISTS product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    description TEXT COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    original_price DECIMAL(10,2) COMMENT '原价',
    stock INT DEFAULT 0 COMMENT '库存数量',
    sales_count INT DEFAULT 0 COMMENT '销量',
    main_image VARCHAR(255) COMMENT '主图片',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    brand VARCHAR(100) COMMENT '品牌',
    status TINYINT DEFAULT 1 COMMENT '状态：1-上架，0-下架',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_sales (sales),
    FULLTEXT KEY ft_name_desc (name, description)
) COMMENT '商品表';

-- 商品图片表
CREATE TABLE IF NOT EXISTS product_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
    sort_order INT DEFAULT 0 COMMENT '排序字段',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_product_id (product_id),
    INDEX idx_sort_order (sort_order)
) COMMENT '商品图片表';

-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    selected_sku VARCHAR(255) COMMENT '选中的SKU',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
) COMMENT '购物车表';

-- 用户地址表
CREATE TABLE IF NOT EXISTS user_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    province VARCHAR(50) NOT NULL COMMENT '省份',
    city VARCHAR(50) NOT NULL COMMENT '城市',
    district VARCHAR(50) NOT NULL COMMENT '区/县',
    detail_address VARCHAR(255) NOT NULL COMMENT '详细地址',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认地址：1-是，0-否',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_default (is_default)
) COMMENT '用户地址表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    payment_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    freight_amount DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态：0-待付款，1-待发货，2-已发货，3-已完成，4-已取消',
    payment_method VARCHAR(20) COMMENT '支付方式',
    payment_time DATETIME COMMENT '支付时间',
    delivery_time DATETIME COMMENT '发货时间',
    receive_time DATETIME COMMENT '收货时间',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    receiver_address VARCHAR(500) NOT NULL COMMENT '收货地址',
    remark TEXT COMMENT '订单备注',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_create_time (create_time)
) COMMENT '订单表';

-- 订单项表
CREATE TABLE IF NOT EXISTS order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单项ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(255) COMMENT '商品图片',
    current_price DECIMAL(10,2) NOT NULL COMMENT '商品单价（下单时价格）',
    quantity INT NOT NULL COMMENT '购买数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '小计金额',
    selected_sku VARCHAR(255) COMMENT '选中的SKU',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) COMMENT '订单项表';

-- 支付记录表
CREATE TABLE IF NOT EXISTS payment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '支付ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    payment_no VARCHAR(50) NOT NULL UNIQUE COMMENT '支付流水号',
    payment_method VARCHAR(20) NOT NULL COMMENT '支付方式',
    payment_amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    status TINYINT DEFAULT 0 COMMENT '支付状态：0-待支付，1-支付成功，2-支付失败',
    third_party_order_no VARCHAR(100) COMMENT '第三方支付订单号',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_id (order_id),
    INDEX idx_payment_no (payment_no)
) COMMENT '支付记录表';

-- 插入初始数据

-- 插入商品分类
INSERT IGNORE INTO category (id, name, description, parent_id, sort_order) VALUES
(1, '电子产品', '各类电子产品', 0, 1),
(2, '服装鞋帽', '服装、鞋子、帽子等', 0, 2),
(3, '家居用品', '家庭日用品', 0, 3),
(4, '手机数码', '手机、平板、数码配件等', 1, 1),
(5, '电脑办公', '电脑、办公用品等', 1, 2),
(6, '男装', '男士服装', 2, 1),
(7, '女装', '女士服装', 2, 2),
(8, '家具', '各类家具', 3, 1),
(9, '家纺', '床上用品、窗帘等', 3, 2);

-- 插入示例商品
INSERT IGNORE INTO product (id, name, description, price, original_price, stock, category_id, brand, main_image) VALUES
(1, 'iPhone 15 Pro Max', '苹果最新旗舰手机，搭载A17 Pro芯片', 9999.00, 11999.00, 100, 4, 'Apple', '/images/iphone15.jpg'),
(2, 'MacBook Pro 14英寸', '苹果笔记本电脑，M3芯片', 14999.00, 16999.00, 50, 5, 'Apple', '/images/macbook.jpg'),
(3, '小米14 Ultra', '小米旗舰手机，徕卡影像', 5999.00, 6999.00, 200, 4, '小米', '/images/mi14.jpg'),
(4, '华为MateBook X Pro', '华为笔记本电脑', 8999.00, 9999.00, 80, 5, '华为', '/images/huawei-laptop.jpg'),
(5, 'Nike Air Jordan 1', '经典篮球鞋', 1299.00, 1599.00, 150, 6, 'Nike', '/images/jordan1.jpg');

-- 插入商品图片
INSERT IGNORE INTO product_image (product_id, image_url, sort_order) VALUES
(1, '/images/iphone15-1.jpg', 1),
(1, '/images/iphone15-2.jpg', 2),
(1, '/images/iphone15-3.jpg', 3),
(2, '/images/macbook-1.jpg', 1),
(2, '/images/macbook-2.jpg', 2),
(3, '/images/mi14-1.jpg', 1),
(3, '/images/mi14-2.jpg', 2),
(4, '/images/huawei-laptop-1.jpg', 1),
(5, '/images/jordan1-1.jpg', 1); 