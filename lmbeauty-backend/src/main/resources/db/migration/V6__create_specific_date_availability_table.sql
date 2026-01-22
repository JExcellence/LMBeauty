-- Create specific_date_availability table
CREATE TABLE specific_date_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ensure start_time is before end_time
    CONSTRAINT chk_specific_date_time_range CHECK (start_time < end_time),
    
    -- Create index for efficient date lookups
    INDEX idx_specific_date_availability_date (date),
    INDEX idx_specific_date_availability_active (active),
    INDEX idx_specific_date_availability_date_active (date, active)
);