from django import forms
from .models import product, product_image, category, text_areas, footer_textareas, business_information, supplier
from django.forms import inlineformset_factory

class product_form(forms.ModelForm):
    class Meta:
        model = product
        fields = ['title', 'subtitle', 'category', 'description', 'price', 'sale_price', 'material', 'color', 'height', 'width', 'depth','length', 'more_information', 'supplier', 'enabled', 'bestseller']

product_image_formset = inlineformset_factory(
    product, product_image,
    fields=('image',),
    extra=3,
    can_delete=True
)


class category_form(forms.ModelForm):
    class Meta:
        model = category
        fields = ['name', 'parent', 'image'] 


class supplier_form(forms.ModelForm):
    class Meta:
        model = supplier
        fields = ['name', 'image'] 

class text_areas_form(forms.ModelForm):
    class Meta:
        model = text_areas
        fields = [
            'front_page_header', 'front_page_subtitle', 'front_page_button_text',
            'recent_product_header', 'recent_product_text',
            'bestseller_header', 'bestseller_text',
            'nav_item_1', 'nav_item_2', 'nav_item_3', 'nav_item_4',
            'purchase_button_1', 'purchase_button_2',
            'product_desc_item_1', 'product_desc_item_2', 'product_desc_item_3', 'sale_catalogue'
        ]

class footer_text_areas_form(forms.ModelForm):
    class Meta:
        model = footer_textareas
        fields = [
            'footer_header_1', 'footer_header_1_subtitle',
            'footer_header_2',
            'footer_header_3', 'footer_header_3_subtitle_1', 'footer_header_3_subtitle_2',
            'footer_header_4', 'footer_header_4_subtitle_1', 'footer_header_4_subtitle_2',
            'footer_header_5', 'footer_header_5_subtitle_1', 'footer_header_5_subtitle_2',
        ]

class business_information_form(forms.ModelForm):
    class Meta:
        model = business_information
        fields = [
            'street_address', 'zip_code',
            'zip_code_area',
            'main_email', 'secondary_email', 'main_phone',
            'secondary_phone', 'about_us_text',
        ]

