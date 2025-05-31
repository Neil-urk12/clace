-- Events table schema for the Clace application
CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    all_day BOOLEAN DEFAULT FALSE,
    type ENUM('Assignment', 'Quiz', 'Project', 'Reminder', 'ClassSession', 'Exam', 'GeneralActivity') NOT NULL,
    subject VARCHAR(255),
    course VARCHAR(255),
    status ENUM('Pending', 'InProgress', 'Completed', 'Submitted', 'Graded', 'Overdue', 'Scheduled') DEFAULT 'Scheduled',
    location VARCHAR(255),
    image_url VARCHAR(512),
    color VARCHAR(7), -- For hex color codes like #FF5733
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint (assuming users table exists)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_user_id (user_id),
    INDEX idx_start_date (start_date),
    INDEX idx_type (type),
    INDEX idx_course (course),
    INDEX idx_status (status)
);
