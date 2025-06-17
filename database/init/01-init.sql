-- Initial database setup
-- This file runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (already handled by POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS opptak;

-- Create user if it doesn't exist (already handled by POSTGRES_USER)
-- CREATE USER opptak_user WITH PASSWORD 'opptak_password';

-- Grant privileges (already handled by PostgreSQL container)
-- GRANT ALL PRIVILEGES ON DATABASE opptak TO opptak_user;

-- Set timezone
SET timezone = 'Europe/Oslo';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initial schema will be created by Flyway migrations