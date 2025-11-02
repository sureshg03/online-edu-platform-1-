import MySQLdb
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_admin.settings')
django.setup()

from django.conf import settings

# Connect to MySQL
db_settings = settings.DATABASES['default']
conn = MySQLdb.connect(
    host=db_settings['HOST'],
    user=db_settings['USER'],
    passwd=db_settings['PASSWORD'],
    db=db_settings['NAME']
)

cursor = conn.cursor()

# Create LSC Admins table
cursor.execute("""
CREATE TABLE IF NOT EXISTS lsc_admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lsc_code VARCHAR(50) UNIQUE NOT NULL,
    center_name VARCHAR(200) NOT NULL,
    admin_email VARCHAR(254) UNIQUE NOT NULL,
    admin_password VARCHAR(256) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")

# Create System Settings table
cursor.execute("""
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    updated_by VARCHAR(254) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")

# Create Database Backups table
cursor.execute("""
CREATE TABLE IF NOT EXISTS database_backups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    backup_name VARCHAR(200) NOT NULL,
    backup_path TEXT NOT NULL,
    backup_size BIGINT NOT NULL,
    backup_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_by VARCHAR(254) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")

# Create Audit Logs table
cursor.execute("""
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_email VARCHAR(254) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    action_description TEXT NOT NULL,
    affected_model VARCHAR(100),
    affected_record_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    INDEX idx_admin_email (admin_email),
    INDEX idx_action_type (action_type),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")

conn.commit()
cursor.close()
conn.close()

print("✅ All Super Admin tables created successfully!")
print("   - lsc_admins")
print("   - system_settings")
print("   - database_backups")
print("   - audit_logs")
