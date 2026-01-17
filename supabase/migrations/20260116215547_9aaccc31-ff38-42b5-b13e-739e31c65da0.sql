-- Create a table for COD (Cash on Delivery) orders
CREATE TABLE public.cod_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cod_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting orders (anyone can place an order)
CREATE POLICY "Anyone can create COD orders" 
ON public.cod_orders 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing orders (only admins can view)
CREATE POLICY "Admins can view all COD orders" 
ON public.cod_orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policy for updating orders (only admins can update)
CREATE POLICY "Admins can update COD orders" 
ON public.cod_orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ASP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::text, 1, 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic order number generation
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.cod_orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cod_orders_updated_at
BEFORE UPDATE ON public.cod_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();