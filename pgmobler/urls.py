"""
URL configuration for pgmobler project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from website_app import views
from django.conf.urls.static import static
from pgmobler import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='hjem'),
    path('categories', views.categories, name='categories'),
    path('categories/<str:category_name>', views.category_search, name='category_search'),

    path('products', views.all_products, name='products'),
    path('product/<int:product_id>/', views.product_page, name='product_page'),
    path('search/', views.general_search, name='general_search'),


    # ADMIN STUFF
    path('administration', views.administration, name='administration'),

    path('products/add', views.add_product, name='add_product'),

    path('products/edit/', views.product_list_and_update, name='update_products'),
    path('products/edit/<int:product_id>/', views.product_list_and_update, name='update_products_id'),

    path('categories/add/', views.add_category, name='add_category'),
    path('categories/edit/', views.category_list_and_update, name='update_categories'),
    path('categories/edit/<int:category_id>/', views.category_list_and_update, name='update_categories_id'),

    path('text_areas/edit/', views.text_areas_list_and_update, name='update_text_areas'),
    path('text_areas/edit/<int:text_area_id>/', views.text_areas_list_and_update, name='update_text_areas_id'),
    path('text_areas/create/', views.text_areas_list_and_update, name='create_text_area'),


    path('footer_textareas/edit/', views.text_areas_list_and_update, name='update_footer_text_areas'),
    path('footer_textareas/edit/<int:footer_text_area_id>/', views.text_areas_list_and_update, name='update_footer_textareas_id'),
    path('footer_textareas/create/', views.text_areas_list_and_update, name='create_footer_text_area'),

    path('business_information/', views.text_areas_list_and_update, name='business_information'),
    path('business_information/create/', views.text_areas_list_and_update, name='create_business_information'),
    path('business_information/edit/<int:business_info_id>/', views.text_areas_list_and_update, name='update_business_information'),
    # END OF ADMIN STUFF

    path('about_us', views.about_us, name='about_us'),
    path('contact', views.contact, name='contact'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

