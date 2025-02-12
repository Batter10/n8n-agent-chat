-- Users tabel voor account informatie
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Chat geschiedenis tabel
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),  -- Zoals "Afternoon chat about cooking"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individuele berichten in chats
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chat_history(id),
    message TEXT NOT NULL,
    is_bot BOOLEAN DEFAULT false,  -- true voor AI antwoorden, false voor gebruiker
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User settings tabel
CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(50) DEFAULT 'nl',
    notifications_enabled BOOLEAN DEFAULT true
);