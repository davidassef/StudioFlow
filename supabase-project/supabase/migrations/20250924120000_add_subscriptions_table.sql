-- Create subscriptions table for StudioFlow subscription system
-- Migration: 20250924120000_add_subscriptions_table.sql

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL, -- 'studioflow_basic' or 'studioflow_pro'
  status TEXT CHECK (status IN ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID')) DEFAULT 'TRIAL',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  payment_method_id TEXT, -- Mercado Pago payment method ID
  mercadopago_customer_id TEXT, -- Mercado Pago customer ID
  mercadopago_subscription_id TEXT, -- Mercado Pago subscription ID
  last_payment_date TIMESTAMP WITH TIME ZONE,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL, -- Monthly amount in BRL
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_trial_period CHECK (trial_end >= trial_start),
  CONSTRAINT valid_subscription_period CHECK (current_period_end >= current_period_start),
  CONSTRAINT unique_active_subscription_per_user EXCLUDE (user_id WITH =) WHERE (status IN ('TRIAL', 'ACTIVE'))
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);
CREATE INDEX idx_subscriptions_mercadopago_customer_id ON subscriptions(mercadopago_customer_id);
CREATE INDEX idx_subscriptions_mercadopago_subscription_id ON subscriptions(mercadopago_subscription_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_update_subscription_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_updated_at();

-- Function to handle trial expiration
CREATE OR REPLACE FUNCTION handle_trial_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- If trial has expired and status is still TRIAL, mark as UNPAID
    IF NEW.trial_end < NOW() AND OLD.status = 'TRIAL' AND NEW.status = 'TRIAL' THEN
        NEW.status = 'UNPAID';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for trial expiration
CREATE TRIGGER trigger_trial_expiration
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION handle_trial_expiration();

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own subscriptions
CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Only admins can delete subscriptions
CREATE POLICY "Only admins can delete subscriptions" ON subscriptions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'ADMIN'
    )
  );

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_uuid
    AND status IN ('TRIAL', 'ACTIVE')
    AND (trial_end > NOW() OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  plan_id TEXT,
  status TEXT,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.plan_id,
    s.status,
    s.trial_end,
    s.current_period_end,
    s.amount
  FROM subscriptions s
  WHERE s.user_id = user_uuid
  AND s.status IN ('TRIAL', 'ACTIVE')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;