-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customer
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty Program
CREATE TABLE loyalty_program (
    loyalty_id SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE REFERENCES customer(customer_id),
    points INTEGER DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'BRONZE',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

