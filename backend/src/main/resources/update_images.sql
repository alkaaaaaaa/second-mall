-- 更新商品主图片为有效的示例图片URL
UPDATE product SET 
    main_image = CASE id
        WHEN 1 THEN 'https://picsum.photos/600/600?random=1'
        WHEN 2 THEN 'https://picsum.photos/600/600?random=2'
        WHEN 3 THEN 'https://picsum.photos/600/600?random=3'
        WHEN 4 THEN 'https://picsum.photos/600/600?random=4'
        WHEN 5 THEN 'https://picsum.photos/600/600?random=5'
        ELSE main_image
    END,
    original_price = CASE id
        WHEN 1 THEN 11999.00
        WHEN 2 THEN 16999.00
        WHEN 3 THEN 6999.00
        WHEN 4 THEN 9999.00
        WHEN 5 THEN 1599.00
        ELSE original_price
    END,
    brand = CASE id
        WHEN 1 THEN 'Apple'
        WHEN 2 THEN 'Apple'
        WHEN 3 THEN '小米'
        WHEN 4 THEN '华为'
        WHEN 5 THEN 'Nike'
        ELSE brand
    END
WHERE id IN (1, 2, 3, 4, 5);

-- 更新商品图片表的图片URL
UPDATE product_image SET 
    image_url = CASE 
        WHEN product_id = 1 AND sort_order = 1 THEN 'https://picsum.photos/600/600?random=11'
        WHEN product_id = 1 AND sort_order = 2 THEN 'https://picsum.photos/600/600?random=12'
        WHEN product_id = 1 AND sort_order = 3 THEN 'https://picsum.photos/600/600?random=13'
        WHEN product_id = 2 AND sort_order = 1 THEN 'https://picsum.photos/600/600?random=21'
        WHEN product_id = 2 AND sort_order = 2 THEN 'https://picsum.photos/600/600?random=22'
        WHEN product_id = 3 AND sort_order = 1 THEN 'https://picsum.photos/600/600?random=31'
        WHEN product_id = 3 AND sort_order = 2 THEN 'https://picsum.photos/600/600?random=32'
        WHEN product_id = 4 AND sort_order = 1 THEN 'https://picsum.photos/600/600?random=41'
        WHEN product_id = 5 AND sort_order = 1 THEN 'https://picsum.photos/600/600?random=51'
        ELSE image_url
    END
WHERE product_id IN (1, 2, 3, 4, 5);
