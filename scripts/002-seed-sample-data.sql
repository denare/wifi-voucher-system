-- Insert sample users
INSERT INTO users (email, password_hash, full_name, phone, role, status, data_used_mb, last_login) VALUES 
('john.doe@email.com', 'demo_hash', 'John Doe', '+255712345001', 'user', 'active', 2048, NOW() - INTERVAL '2 hours'),
('jane.smith@email.com', 'demo_hash', 'Jane Smith', '+255712345002', 'user', 'active', 1536, NOW() - INTERVAL '30 minutes'),
('mike.wilson@email.com', 'demo_hash', 'Mike Wilson', '+255712345003', 'user', 'suspended', 5120, NOW() - INTERVAL '1 day'),
('sarah.johnson@email.com', 'demo_hash', 'Sarah Johnson', '+255712345004', 'user', 'active', 512, NOW() - INTERVAL '1 hour'),
('david.brown@email.com', 'demo_hash', 'David Brown', '+255712345005', 'user', 'active', 3072, NOW() - INTERVAL '4 hours'),
('emma.davis@email.com', 'demo_hash', 'Emma Davis', '+255712345006', 'user', 'active', 1024, NOW() - INTERVAL '15 minutes'),
('alex.taylor@email.com', 'demo_hash', 'Alex Taylor', '+255712345007', 'user', 'active', 2560, NOW() - INTERVAL '3 hours')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vouchers
INSERT INTO vouchers (code, plan_id, user_id, status, data_used_mb, activated_at, expires_at) 
SELECT 
    'WIFI' || LPAD((ROW_NUMBER() OVER())::text, 8, '0'),
    (SELECT id FROM voucher_plans ORDER BY RANDOM() LIMIT 1),
    u.id,
    CASE 
        WHEN RANDOM() < 0.6 THEN 'active'
        WHEN RANDOM() < 0.8 THEN 'expired'
        ELSE 'unused'
    END,
    FLOOR(RANDOM() * 2048)::INTEGER,
    NOW() - (RANDOM() * INTERVAL '7 days'),
    NOW() + (RANDOM() * INTERVAL '7 days')
FROM users u WHERE u.role = 'user';

-- Insert sample payments
INSERT INTO payments (user_id, voucher_id, amount, payment_method, status)
SELECT 
    v.user_id,
    v.id,
    vp.price,
    CASE 
        WHEN RANDOM() < 0.6 THEN 'mpesa'
        WHEN RANDOM() < 0.8 THEN 'card'
        ELSE 'bank_transfer'
    END,
    'completed'
FROM vouchers v
JOIN voucher_plans vp ON v.plan_id = vp.id
WHERE v.status != 'unused';

-- Insert sample user sessions
INSERT INTO user_sessions (user_id, voucher_id, ip_address, mac_address, device_type, device_name, data_consumed_mb, signal_strength, is_active)
SELECT 
    v.user_id,
    v.id,
    ('192.168.1.' || (100 + ROW_NUMBER() OVER()))::inet,
    UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2) || ':' || 
          SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2) || ':' || 
          SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2) || ':' || 
          SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2) || ':' || 
          SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2) || ':' || 
          SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 2)),
    CASE 
        WHEN RANDOM() < 0.4 THEN 'iPhone'
        WHEN RANDOM() < 0.7 THEN 'Android'
        ELSE 'Laptop'
    END,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'iPhone 14 Pro'
        WHEN RANDOM() < 0.5 THEN 'Samsung Galaxy S23'
        WHEN RANDOM() < 0.7 THEN 'MacBook Pro'
        ELSE 'Windows Laptop'
    END,
    FLOOR(RANDOM() * 512)::INTEGER,
    FLOOR(70 + RANDOM() * 30)::INTEGER,
    v.status = 'active'
FROM vouchers v
WHERE v.status = 'active'
LIMIT 15;

-- Insert sample activity feed
INSERT INTO activity_feed (user_id, activity_type, title, description)
SELECT 
    u.id,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'login'
        WHEN RANDOM() < 0.6 THEN 'purchase'
        WHEN RANDOM() < 0.8 THEN 'usage_alert'
        ELSE 'connection'
    END,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'User Login'
        WHEN RANDOM() < 0.6 THEN 'Voucher Purchase'
        WHEN RANDOM() < 0.8 THEN 'Usage Alert'
        ELSE 'Device Connection'
    END,
    CASE 
        WHEN RANDOM() < 0.3 THEN u.full_name || ' logged in from ' || CASE WHEN RANDOM() < 0.5 THEN 'iPhone 14 Pro' ELSE 'MacBook Pro' END
        WHEN RANDOM() < 0.6 THEN u.full_name || ' purchased ' || CASE WHEN RANDOM() < 0.5 THEN '5GB Premium' ELSE '2GB Standard' END || ' voucher'
        WHEN RANDOM() < 0.8 THEN u.full_name || ' reached 80% of data limit'
        ELSE u.full_name || ' connected new device'
    END
FROM users u 
WHERE u.role = 'user'
ORDER BY RANDOM()
LIMIT 20;

-- Insert sample system alerts
INSERT INTO system_alerts (alert_type, title, message, severity) VALUES 
('payment_gateway', 'Payment Gateway Error', 'Mobile money gateway experiencing intermittent issues', 'warning'),
('bandwidth', 'High Bandwidth Usage', 'System bandwidth usage at 85% capacity', 'warning'),
('maintenance', 'Scheduled Maintenance', 'System maintenance scheduled for 2:00 AM EST for 30 minutes', 'info'),
('security', 'Security Alert', 'Multiple failed login attempts detected', 'error'),
('system', 'System Update', 'New features deployed successfully', 'info');

-- Insert sample usage logs
INSERT INTO usage_logs (user_id, voucher_id, data_consumed_mb, activity_type, description)
SELECT 
    v.user_id,
    v.id,
    FLOOR(RANDOM() * 100)::INTEGER,
    CASE 
        WHEN RANDOM() < 0.5 THEN 'data_usage'
        WHEN RANDOM() < 0.8 THEN 'session_start'
        ELSE 'session_end'
    END,
    'Automated usage tracking'
FROM vouchers v
WHERE v.status = 'active'
ORDER BY RANDOM()
LIMIT 50;
