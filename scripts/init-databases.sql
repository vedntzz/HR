-- Initialize separate databases for each microservice
-- This runs automatically when the PostgreSQL container starts

CREATE DATABASE hrflow_auth;
CREATE DATABASE hrflow_employee;
CREATE DATABASE hrflow_attendance;
CREATE DATABASE hrflow_payroll;
CREATE DATABASE hrflow_recruitment;
CREATE DATABASE hrflow_lms;
CREATE DATABASE hrflow_policy;

-- Enable UUID extension in each database
\c hrflow_auth
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_employee
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_attendance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_payroll
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_recruitment
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_lms
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c hrflow_policy
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
