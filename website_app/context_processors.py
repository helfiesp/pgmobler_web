from . import models

def base_info(request):
    products = models.product.objects.all().order_by('-date_added')
    categories = models.category.objects.all()
    text_areas = models.text_areas.objects.first()
    footer_textareas = models.footer_textareas.objects.first()
    business_information = models.business_information.objects.first()
    recent_products = models.product.objects.filter(enabled=True).order_by('-date_added')[:8]
    bestsellers = models.product.objects.filter(enabled=True, bestseller=True).order_by('-date_added')[:8]

    return {
        'all_products': products,
        'all_categories': categories,
        'text_areas': text_areas,
        'footer_textareas': footer_textareas,
        'business_information': business_information,
        'recent_products': recent_products,
        'bestsellers': bestsellers,
    }