from django import template
from django.forms.widgets import Widget
from website_app.models import product, category

register = template.Library()

@register.filter
def get_category_count(category_name):
	# Checks how many items are in a specific category
    if not category_name:
        return 0
    return product.objects.filter(category=category_name, enabled=True).count()

@register.filter
def fetch_category_id(category_name):
    category_results = category.objects.get(name=category_name)  # Assuming the model name is Category
    if not category_name:
        return 0
    try:
        category_results = category.objects.get(name=category_name)  # Assuming the model name is Category
        return category_results.id
    except category_results.DoesNotExist:
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