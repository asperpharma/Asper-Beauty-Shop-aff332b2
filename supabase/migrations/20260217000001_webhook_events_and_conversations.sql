-- Create conversations table to store customer conversation context
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL, -- External customer ID (from Gorgias/ManyChat)
  channel TEXT NOT NULL, -- 'gorgias', 'manychat', 'generic'
  context JSONB, -- Conversation history/context
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, channel)
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only (webhook function uses service role)
CREATE POLICY "Service role can manage conversations"
ON public.conversations FOR ALL
USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_conversations_customer_channel ON public.conversations(customer_id, channel);

-- Create webhook_events table to log all webhook requests
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT, -- Optional idempotency key from webhook sender
  route TEXT NOT NULL, -- 'gorgias', 'manychat', 'generic'
  source_ip TEXT,
  headers JSONB,
  body JSONB NOT NULL,
  signature_valid BOOLEAN,
  conversation_id UUID REFERENCES public.conversations(id),
  ai_reply TEXT,
  concern_slug TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'error'
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, route) -- Prevent duplicate processing of same event
);

-- Enable RLS on webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only
CREATE POLICY "Service role can manage webhook_events"
ON public.webhook_events FOR ALL
USING (auth.role() = 'service_role');

-- Admins can view webhook events for monitoring
CREATE POLICY "Admins can view webhook_events"
ON public.webhook_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for common queries
CREATE INDEX idx_webhook_events_route ON public.webhook_events(route);
CREATE INDEX idx_webhook_events_created_at ON public.webhook_events(created_at DESC);
CREATE INDEX idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX idx_webhook_events_status ON public.webhook_events(status);

-- Trigger for automatic timestamp updates on conversations
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
