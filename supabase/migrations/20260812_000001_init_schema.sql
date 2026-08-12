CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.is_app_role(role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = role_name
  );
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  short_description text,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(12,2) CHECK (compare_at_price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  sku text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  discount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total numeric(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'midtrans',
  payment_method text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  transaction_id text UNIQUE,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percent', 'fixed')),
  value numeric(12,2) NOT NULL CHECK (value >= 0),
  min_order numeric(12,2) DEFAULT 0 CHECK (min_order >= 0),
  max_discount numeric(12,2) CHECK (max_discount >= 0),
  valid_from timestamptz,
  valid_to timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  score numeric(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner or staff/admin" ON public.profiles
FOR SELECT
USING (
  auth.uid() = id
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff and admins can manage profiles" ON public.profiles
FOR UPDATE
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Public can read active categories" ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Staff and admins can manage categories" ON public.categories
FOR ALL
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Public can read active products" ON public.products
FOR SELECT
USING (
  status = 'active'
  OR auth.uid() IS NOT NULL AND (public.is_app_role('staff') OR public.is_app_role('admin'))
);

CREATE POLICY "Staff and admins can manage products" ON public.products
FOR ALL
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Public can read product images" ON public.product_images
FOR SELECT
USING (true);

CREATE POLICY "Staff and admins can manage product images" ON public.product_images
FOR ALL
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Users can manage own cart" ON public.cart_items
FOR ALL
USING (
  user_id = auth.uid()
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
);

CREATE POLICY "Users can manage own wishlist" ON public.wishlists
FOR ALL
USING (
  user_id = auth.uid()
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
);

CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_app_role('staff')
  OR public.is_app_role('admin')
);

CREATE POLICY "Users can create own orders" ON public.orders
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff and admins can update orders" ON public.orders
FOR UPDATE
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Order items are readable by order owners and staff/admin" ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_id
      AND (o.user_id = auth.uid() OR public.is_app_role('staff') OR public.is_app_role('admin'))
  )
);

CREATE POLICY "Order items can be created with owned orders" ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_id
      AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Payments readable by owner or staff/admin" ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_id
      AND (o.user_id = auth.uid() OR public.is_app_role('staff') OR public.is_app_role('admin'))
  )
);

CREATE POLICY "Payments can be created with owned orders" ON public.payments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_id
      AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Payments can be updated by staff/admin" ON public.payments
FOR UPDATE
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Reviews are publicly viewable" ON public.reviews
FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews for own purchases" ON public.reviews
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "Owners and admins can manage reviews" ON public.reviews
FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.is_app_role('admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_app_role('admin')
);

CREATE POLICY "Public can read vouchers when active" ON public.vouchers
FOR SELECT
USING (is_active = true);

CREATE POLICY "Staff and admins can manage vouchers" ON public.vouchers
FOR ALL
USING (public.is_app_role('staff') OR public.is_app_role('admin'))
WITH CHECK (public.is_app_role('staff') OR public.is_app_role('admin'));

CREATE POLICY "Product views are insertable by authenticated users" ON public.product_views
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public can read recommendations for product discovery" ON public.recommendations
FOR SELECT
USING (true);

CREATE POLICY "Users can manage own recommendations" ON public.recommendations
FOR ALL
USING (
  user_id = auth.uid()
  OR public.is_app_role('admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_app_role('admin')
);

-- Default service-role and authenticated access is intentionally limited to the app role policies above.
