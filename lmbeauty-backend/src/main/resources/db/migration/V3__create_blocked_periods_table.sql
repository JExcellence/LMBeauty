-- Create blocked_periods table
CREATE TABLE IF NOT EXISTS blocked_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_datetime_range CHECK (start_date_time < end_date_time)
);

CREATE INDEX idx_blocked_periods_range ON blocked_periods(start_date_time, end_date_time);
