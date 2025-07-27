-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@wifisystem.com', '$2b$10$rOzJqQZ8kGjM5Y5vQZ8kGOzJqQZ8kGjM5Y5vQZ8kGOzJqQZ8kGjM5Y', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample voucher plans
INSERT INTO voucher_plans (name, data_limit_mb, time_limit_hours, price, description) VALUES 
('Basic 1GB', 1024, 24, 5.00, '1GB data valid for 24 hours'),
('Standard 3GB', 3072, 72, 12.00, '3GB data valid for 3 days'),
('Premium 5GB', 5120, 168, 20.00, '5GB data valid for 1 week'),
('Unlimited 1 Day', NULL, 24, 8.00, 'Unlimited data for 24 hours'),
('Unlimited 1 Week', NULL, 168, 25.00, 'Unlimited data for 1 week')
ON CONFLICT DO NOTHING;

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
('max_concurrent_users', '100', 'Maximum number of concurrent users allowed'),
('session_timeout_minutes', '30', 'Session timeout in minutes'),
('auto_disconnect_on_limit', 'true', 'Automatically disconnect users when data limit is reached'),
('payment_gateway', 'mpesa', 'Default payment gateway'),
('system_name', 'WiFi Access System', 'System display name')
ON CONFLICT (setting_key) DO NOTHING;
