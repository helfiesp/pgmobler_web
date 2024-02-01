from django import template
from django.forms.widgets import Widget
from website_app.models import product

register = template.Library()

@register.filter
def get_category_count(category_name):
	# Checks how many items are in a specific category
    if not category_name:
        return 0
    return product.objects.filter(category=category_name, enabled=True).count()