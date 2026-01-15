-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for business status
CREATE TYPE public.business_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'suspended');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cities table
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communes table
CREATE TABLE public.communes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (name, city_id)
);

-- Create businesses table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description_short TEXT,
    description_long TEXT,
    phone TEXT,
    phone_secondary TEXT,
    email TEXT,
    website TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    commune_id UUID REFERENCES public.communes(id) ON DELETE SET NULL,
    address TEXT,
    landmark TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    logo_url TEXT,
    status business_status DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    whatsapp TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_hours table
CREATE TABLE public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    UNIQUE (business_id, day_of_week)
);

-- Create business_images table
CREATE TABLE public.business_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_services table (tags)
CREATE TABLE public.business_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    service_name TEXT NOT NULL,
    UNIQUE (business_id, service_name)
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (business_id, user_id)
);

-- Create pharmacies_garde table
CREATE TABLE public.pharmacies_garde (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    commune_id UUID REFERENCES public.communes(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies_garde ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create has_role function for checking user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cities (public read)
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON public.cities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for communes (public read)
CREATE POLICY "Anyone can view communes" ON public.communes FOR SELECT USING (true);
CREATE POLICY "Admins can manage communes" ON public.communes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for businesses
CREATE POLICY "Anyone can view approved businesses" ON public.businesses FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can create their own businesses" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own businesses" ON public.businesses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own businesses" ON public.businesses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all businesses" ON public.businesses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for business_hours
CREATE POLICY "Anyone can view business hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Business owners can manage hours" ON public.business_hours FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND user_id = auth.uid())
);

-- RLS Policies for business_images
CREATE POLICY "Anyone can view business images" ON public.business_images FOR SELECT USING (true);
CREATE POLICY "Business owners can manage images" ON public.business_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND user_id = auth.uid())
);

-- RLS Policies for business_services
CREATE POLICY "Anyone can view business services" ON public.business_services FOR SELECT USING (true);
CREATE POLICY "Business owners can manage services" ON public.business_services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND user_id = auth.uid())
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pharmacies_garde (public read)
CREATE POLICY "Anyone can view pharmacies" ON public.pharmacies_garde FOR SELECT USING (true);
CREATE POLICY "Admins can manage pharmacies" ON public.pharmacies_garde FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Authors can manage their articles" ON public.articles FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all articles" ON public.articles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();