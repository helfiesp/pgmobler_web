from django import template
from django.forms.widgets import Widget
from website_app.models import product, category

register = template.Library()

@register.filter
def get_category_count(category_name):
    if not category_name:
        return 0
    try:
        category_obj = category.objects.get(name__iexact=category_name)  # Case-insensitive match
        return product.objects.filter(category=category_obj, enabled=True).count()
    except category.DoesNotExist:
        return 0

@register.filter
def fetch_category_id(category_name):
    if not category_name:
        return 0
    try:
        category_obj = category.objects.get(name__iexact=category_name)  # Case-insensitive match
        return category_obj.id
    except category.DoesNotExist:
        return 0

@register.filter
def subtract(value, arg):
    """Subtracts the arg from the value"""
    try:
        return float(value) - float(arg)
    except (ValueError, TypeError):
        try:
            return value - arg
        except Exception:
            return ''

@register.filter
def tostring(text):
    return str(text)