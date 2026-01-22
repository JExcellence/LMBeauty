-- Add missing columns to treatments table for enhanced functionality
ALTER TABLE treatments 
ADD COLUMN slug VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'WIMPERN',
ADD COLUMN image_url VARCHAR(500),
ADD COLUMN version_number INT DEFAULT 1,
ADD COLUMN previous_version_id BIGINT,
ADD COLUMN url_slug VARCHAR(100),
ADD COLUMN has_refill_options BOOLEAN DEFAULT FALSE;

-- Add unique constraint for slug
ALTER TABLE treatments ADD CONSTRAINT uk_treatments_slug UNIQUE (slug);

-- Add index for url_slug for fast lookups
CREATE INDEX idx_treatments_url_slug ON treatments(url_slug);

-- Add index for category filtering
CREATE INDEX idx_treatments_category ON treatments(category);

-- Create treatment_refills table for time-based refill pricing
CREATE TABLE IF NOT EXISTS treatment_refills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    treatment_id BIGINT NOT NULL,
    week_threshold INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_treatment_refills_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
    CONSTRAINT chk_week_threshold CHECK (week_threshold > 0 AND week_threshold <= 52),
    CONSTRAINT chk_refill_price CHECK (price > 0),
    CONSTRAINT uk_treatment_refills_treatment_week UNIQUE (treatment_id, week_threshold)
);

-- Indexes for refill queries
CREATE INDEX idx_treatment_refills_treatment ON treatment_refills(treatment_id);
CREATE INDEX idx_treatment_refills_week ON treatment_refills(week_threshold);

-- Create treatment_audit table for tracking changes
CREATE TABLE IF NOT EXISTS treatment_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    treatment_id BIGINT,
    action VARCHAR(20) NOT NULL,
    field_changed VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    admin_user_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_audit_action CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'SEED')),
    CONSTRAINT fk_treatment_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(id)
);

-- Indexes for audit queries
CREATE INDEX idx_treatment_audit_treatment ON treatment_audit(treatment_id);
CREATE INDEX idx_treatment_audit_timestamp ON treatment_audit(timestamp);
CREATE INDEX idx_treatment_audit_admin ON treatment_audit(admin_user_id);
CREATE INDEX idx_treatment_audit_action ON treatment_audit(action);