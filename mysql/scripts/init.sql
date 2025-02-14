CREATE DATABASE IF NOT EXISTS dev;
use dev;
CREATE USER IF NOT EXISTS 'dev'@'localhost' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON dev.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS bot_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evt_code INT NOT NULL,
    type  CHAR(5) NOT NULL, -- ERROR / EVENT
    `read` TINYINT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS bot_errors (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     error_code INT NOT NULL,
--     timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS bot_reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TINYTEXT NOT NULL,
    need_to_change TINYINT NOT NULL DEFAULT 0,
    `read` TINYINT NOT NULL DEFAULT 1,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_saved_pattern (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pattern JSON NOT NULL
);

-- Idempotent inserts for bot_reminders:
INSERT INTO `bot_reminders` (`name`, `need_to_change`, `read`)
SELECT 'dust_bag', 0, 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM bot_reminders WHERE name = 'dust_bag'
);

INSERT INTO `bot_reminders` (`name`, `need_to_change`, `read`)
SELECT 'mop', 0, 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM bot_reminders WHERE name = 'mop'
);
