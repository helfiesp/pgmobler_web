from django.db import models
from django.db.models import IntegerField
import uuid
from django.utils.text import slugify
from django.utils import timezone

# Create your models here.

from django.db import models
from django.utils.text import slugify
from django.utils import timezone

class product(models.Model):
    string_id = models.CharField(max_length=200, unique=True, blank=True, null=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(
        'category', on_delete=models.SET_NULL, null=True, blank=True, related_name='products'
    )
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    sale_price = models.IntegerField(null=True, blank=True)
    material = models.CharField(max_length=200, null=True, blank=True)
    color = models.CharField(
        max_length=200, default="Mange varianter tilgjengelige, flere hundre kombinasjoner "
    )
    height = models.CharField(max_length=200, null=True, blank=True)
    width = models.CharField(max_length=200, null=True, blank=True)
    depth = models.CharField(max_length=200, null=True, blank=True)
    length = models.CharField(max_length=200, null=True, blank=True)
    supplier = models.CharField(max_length=200, null=True, blank=True)
    enabled = models.BooleanField(default=True)
    bestseller = models.BooleanField(default=False)
    more_information = models.TextField(null=True, blank=True)
    price_tag_info = models.CharField(null=True, blank=True)
    price_tag_type = models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(null=True, blank=True)

    # Boolean fields for specific colors
    color_black = models.BooleanField(default=False)
    color_smoked = models.BooleanField(default=False)
    color_greyoiled = models.BooleanField(default=False)
    color_whiteoiled = models.BooleanField(default=False)
    color_light_oak = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.string_id:
            base_string_id = slugify(self.title)
            new_string_id = base_string_id
            increment = 1
            # Check if the string_id already exists and increment until a unique one is found
            while product.objects.filter(string_id=new_string_id).exists():
                new_string_id = f"{base_string_id}-{increment}"
                increment += 1
            self.string_id = new_string_id

        self.date_edited = timezone.now()
        super(product, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class product_image(models.Model):
    product = models.ForeignKey(product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    order = models.IntegerField(default=0)

    # Optional color association
    COLOR_CHOICES = [
        ('black', 'Black'),
        ('smoked', 'Smoked'),
        ('greyoiled', 'Greyoiled'),
        ('whiteoiled', 'Whiteoiled'),
        ('light_oak', 'Light Oak'),
    ]
    color = models.CharField(
        max_length=20, choices=COLOR_CHOICES, null=True, blank=True,
        help_text="Associate this image with a specific color, or leave blank."
    )

    def __str__(self):
        return f"{self.product.title} - Image {self.order} ({self.color or 'No Color'})"



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
    bestseller_header = models.CharField(max_length=200, null=True, blank=True)
    bestseller_text = models.CharField(max_length=200, null=True, blank=True)
    nav_item_1 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_2 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_3 = models.CharField(max_length=200, null=True, blank=True)
    nav_item_4 = models.CharField(max_length=200, null=True, blank=True)
    purchase_button_1 = models.CharField(max_length=200, null=True, blank=True)
    purchase_button_2 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_1 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_2 = models.CharField(max_length=200, null=True, blank=True)
    product_desc_item_3 = models.CharField(max_length=200, null=True, blank=True)
    sale_catalogue = models.TextField(null=True, blank=True)


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
    about_us_text = models.TextField(null=True, blank=True)

class supplier(models.Model):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='supplier_images/', null=True, blank=True)

    def __str__(self):
        return self.name

class customers(models.Model):
    name = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=255, blank=True)
    street_address = models.CharField(max_length=255, blank=True)
    email = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=255)

    class Meta:
        unique_together = ['name', 'phone_number']

    def __str__(self):
        return self.name

class orders(models.Model):
    order_number = models.AutoField(primary_key=True, verbose_name="Order Number")
    customer = models.ForeignKey(customers, on_delete=models.CASCADE)
    items = models.JSONField()  # This will contain item_info, fabric, legs, amount, and productprice
    delivery_info = models.CharField(max_length=255, blank=True)
    delivery_price = models.IntegerField(blank=True, null=True)
    extra_info = models.CharField(max_length=255, blank=True)
    price = models.CharField(max_length=255, blank=True)
    paid = models.CharField(max_length=255, blank=True)
    remaining = models.CharField(max_length=255, blank=True)
    a_paid = models.CharField(max_length=255, blank=True)
    salesman = models.CharField(max_length=255, blank=True)
    instock = models.CharField(max_length=255, blank=True)
    delivered = models.CharField(max_length=255, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    deleted = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:  # If the record is being created, i.e., it doesn't have a primary key yet
            last_order_number = orders.objects.all().order_by('order_number').last()
            if last_order_number:
                self.order_number = last_order_number.order_number + 1
            else:
                self.order_number = 1000  # Start from 1000 if there are no orders
        super(orders, self).save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number}"

    class Meta:
        verbose_name_plural = "Orders"