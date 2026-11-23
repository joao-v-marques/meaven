-- MEAVEN: simulation history schema
-- PostgreSQL

-- Tabela de lookup para roles de usuários
CREATE TABLE roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name)
VALUES
    ('ADMINISTRATOR');

-- Tabela de usuários da aplicação
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- FK's
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

INSERT INTO users (username, name, password_hash, role_id)
VALUES (
    'admin',
    'Administrador do Sistema',
    '$2a$10$RdXdssPkvFogcQCyOQAO5uNd3aBE0dTCn29.B4b60AXTtQx2gmYHG',
    1
);



-- Tabela de lookup para tipos de simulação
CREATE TABLE simulation_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserção dos registros iniciais para tipos de simulação
INSERT INTO simulation_type (name, code)
VALUES
    ('Financiamento de veículo', 'CAR'),
    ('Financiamento imobiliário', 'HOUSE'),
    ('Planejamento de viagem', 'TRAVEL'),
    ('Abertura de negócio', 'BUSINESS'),
    ('Empréstimo', 'LOAN'),
    ('Quitação de dívida', 'DEBT');

-- Tabela de simulações, registra TODOS os tipos de simulação da aplicação
CREATE TABLE simulations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,
    simulation_type_id INTEGER NOT NULL,
    title VARCHAR(100),

    -- Contexto financeiro do usuário no momento da simulação
    monthly_income DECIMAL(12, 2),
    monthly_expenses DECIMAL(12, 2),
    available_capital DECIMAL(12, 2),

    -- Campos compartilhados entre tipos
    down_payment DECIMAL(12, 2),           -- CAR, HOUSE
    monthly_interest_rate DECIMAL(8, 4),   -- CAR, HOUSE, LOAN, DEBT
    term_months INTEGER,                   -- CAR, HOUSE, TRAVEL, LOAN, DEBT
    installment_amount DECIMAL(12, 2),     -- CAR, HOUSE, LOAN
    total_amount DECIMAL(12, 2),           -- CAR, HOUSE, LOAN, DEBT
    total_interest DECIMAL(12, 2),         -- LOAN, DEBT

    -- CAR
    vehicle_name VARCHAR(100),
    vehicle_price DECIMAL(12, 2),

    -- HOUSE
    property_type VARCHAR(50),
    property_price DECIMAL(12, 2),

    -- TRAVEL
    destination VARCHAR(100),
    travel_cost DECIMAL(12, 2),
    saved_amount DECIMAL(12, 2),
    monthly_savings DECIMAL(12, 2),
    remaining_amount DECIMAL(12, 2),

    -- BUSINESS
    business_name VARCHAR(100),
    business_type VARCHAR(100),
    initial_investment DECIMAL(12, 2),
    monthly_fixed_cost DECIMAL(12, 2),
    monthly_variable_cost DECIMAL(12, 2),
    monthly_revenue DECIMAL(12, 2),
    estimated_profit DECIMAL(12, 2),
    payback_months INTEGER,

    -- LOAN
    loan_amount DECIMAL(12, 2),
    amortization_system VARCHAR(30),

    -- DEBT
    debt_description VARCHAR(150),
    debt_amount DECIMAL(12, 2),
    monthly_payment DECIMAL(12, 2),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- FK's
    CONSTRAINT fk_simulations_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT fk_simulations_type
        FOREIGN KEY (simulation_type_id) REFERENCES simulation_type (id),

    -- Checks
    CONSTRAINT ck_simulations_amounts
        CHECK (
            COALESCE(monthly_income, 0) >= 0
            AND COALESCE(monthly_expenses, 0) >= 0
            AND COALESCE(available_capital, 0) >= 0
        ),

    CONSTRAINT ck_simulations_shared_amounts
        CHECK (
            (down_payment IS NULL OR down_payment >= 0)
            AND (monthly_interest_rate IS NULL OR monthly_interest_rate >= 0)
            AND (term_months IS NULL OR term_months > 0)
        ),

    CONSTRAINT ck_simulations_car_amounts
        CHECK (
            (vehicle_price IS NULL OR vehicle_price > 0)
            AND (vehicle_price IS NULL OR down_payment IS NULL OR down_payment <= vehicle_price)
        ),

    CONSTRAINT ck_simulations_house_amounts
        CHECK (
            (property_price IS NULL OR property_price > 0)
            AND (property_price IS NULL OR down_payment IS NULL OR down_payment <= property_price)
        ),

    CONSTRAINT ck_simulations_travel_amounts
        CHECK (
            (travel_cost IS NULL OR travel_cost > 0)
            AND (saved_amount IS NULL OR saved_amount >= 0)
            AND (monthly_savings IS NULL OR monthly_savings >= 0)
            AND (remaining_amount IS NULL OR remaining_amount >= 0)
        ),

    CONSTRAINT ck_simulations_business_amounts
        CHECK (
            (initial_investment IS NULL OR initial_investment > 0)
            AND (monthly_fixed_cost IS NULL OR monthly_fixed_cost >= 0)
            AND (monthly_variable_cost IS NULL OR monthly_variable_cost >= 0)
            AND (monthly_revenue IS NULL OR monthly_revenue >= 0)
            AND (payback_months IS NULL OR payback_months > 0)
        ),

    CONSTRAINT ck_simulations_loan_amounts
        CHECK (loan_amount IS NULL OR loan_amount > 0),

    CONSTRAINT ck_simulations_debt_amounts
        CHECK (debt_amount IS NULL OR debt_amount > 0)
);

CREATE INDEX ix_simulations_user_id ON simulations (user_id);
