from django.db import models
from django.db.models import IntegerField

# Create your models here.

class product(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    sale_price = models.FloatField(null=True, blank=True)
    material = models.CharField(max_length=200, null=True, blank=True)
    color = models.CharField(max_length=200, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    width = models.IntegerField(null=True, blank=True)
    depth = models.IntegerField(null=True, blank=True)
    length = models.IntegerField(null=True, blank=True)
    supplier = models.CharField(max_length=200, null=True, blank=True)
    enabled = models.BooleanField(default=True)
    bestseller = models.BooleanField(default=False)
    more_information = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(null=True, blank=True)  

    def __str__(self):
        return self.title

class product_image(models.Model):
    product = models.ForeignKey(product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)


class category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)

    def __str__(self):
        return self.name

 
class text_areas(models.Model):
    front_page_header = models.CharField(max_length=200, null=True, blank=True)
    front_page_subtitle = models.CharField(max_length=200, null=True, blank=True)
    front_page_button_text= models.CharField(max_length=200, null=True, blank=True)
    recent_product_header = models.CharField(max_length=200, null=True, blank=True)
    recent_product_text = models.CharField(max_length=200, null=True, blank=True)
    nav_item_1 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_2 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_3 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_4 = models.CharField(max_length=200, null=True, blank=True)
    purchase_button_1 = models.CharField(max_length=200, null=True, blank=True)
    purchase_button_2 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_1 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_2 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_3 = models.CharField(max_length=200, null=True, blank=True)

class footer_textareas(models.Model):
    footer_header_1 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_1_subtitle = models.CharField(max_length=200, null=True, blank=True)
    footer_header_2 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_3 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_3_subtitle_1 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_3_subtitle_2 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_4 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_4_subtitle_1 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_4_subtitle_2 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_5 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_5_subtitle_1 = models.CharField(max_length=200, null=True, blank=True)
    footer_header_5_subtitle_2 = models.CharField(max_length=200, null=True, blank=True)

class business_information(models.Model):
    street_address = models.CharField(max_length=200, null=True, blank=True)
    zip_code = models.IntegerField(null=True, blank=True)
    zip_code_area = models.CharField(max_length=200, null=True, blank=True)
    main_email = models.CharField(max_length=300, null=True, blank=True)
    secondary_email = models.CharField(max_length=300, null=True, blank=True)
    main_phone = models.CharField(max_length=300, null=True, blank=True)
    secondary_phone = models.CharField(max_length=300, null=True, blank=True)
