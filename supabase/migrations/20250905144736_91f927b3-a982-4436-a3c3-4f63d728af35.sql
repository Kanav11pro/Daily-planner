-- Remove default tags that were previously inserted
DELETE FROM public.quick_tags WHERE is_default = true;