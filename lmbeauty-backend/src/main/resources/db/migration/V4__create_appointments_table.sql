-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    treatment_id BIGINT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    customer_notes TEXT,
    owner_notes TEXT,
    rejection_reason VARCHAR(500),
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT fk_appointments_treatment FOREIGN KEY (treatment_id) REFERENCES treatments(id),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'))
);

-- Indexes for common queries
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_customer_status ON appointments(customer_id, status);
CREATE INDEX idx_appointments_scheduled_status ON appointments(scheduled_at, status);
