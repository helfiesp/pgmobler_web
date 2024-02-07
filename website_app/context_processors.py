from . import models

def base_info(request):
    products = models.product.objects.all()
    categories = models.category.objects.all()
    text_areas = models.text_areas.objects.first()
    footer_textareas = models.footer_textareas.objects.first()
    business_information = models.business_information.objects.first()

    return {
        'all_products': products,
        'all_categories': categories,
        'text_areas': text_areas,
        'footer_textareas': footer_textareas,
        'business_information': business_information
    }