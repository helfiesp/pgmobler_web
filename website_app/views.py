from django.shortcuts import render
from django.db.models import Q, F, FloatField, ExpressionWrapper, Case, When
from django.db.models.functions import Coalesce
from django.core.paginator import Paginator
from . import models
from . import forms
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, get_user_model
import json
from django.views.decorators.http import require_POST
from django.db import transaction


def apply_sort_and_pagination(request, base_queryset, default_sort='newly_added'):
    # Annotate the queryset with discount_percentage and effective_price
    queryset = base_queryset.annotate(
        discount_percentage=Case(
            When(
                sale_price__isnull=False,
                sale_price__lt=F('price'),
                then=ExpressionWrapper(
                    (F('price') - F('sale_price')) * 100.0 / F('price'),
                    output_field=FloatField()
                )
            ),
            default=None,
            output_field=FloatField()
        ),
        effective_price=Coalesce('sale_price', 'price')
    )

    sort = request.GET.get('sort', default_sort)
    per_page = request.GET.get('per_page', 4)

    try:
        per_page = max(int(per_page), 1)  # Ensure at least 1 item per page and handle possible ValueError
    except ValueError:
        per_page = 4

    # Applying sorting based on the request
    if sort == 'price_low_high':
        queryset = queryset.order_by('effective_price')
    elif sort == 'price_high_low':
        queryset = queryset.order_by('-effective_price')
    elif sort == 'name_a_z':
        queryset = queryset.order_by('title')
    elif sort == 'name_z_a':
        queryset = queryset.order_by('-title')
    elif sort == 'most_discounted':
        queryset = queryset.filter(sale_price__isnull=False, sale_price__lt=F('price'))
        queryset = queryset.order_by('-discount_percentage')
    else:  # Default sort, including 'newly_added'
        queryset = queryset.order_by('-date_added')


    page_number = request.GET.get('page', 1)

    # Return the paginated products, the sort, and the per_page values
    return queryset, sort, per_page


def error_404_view(request, exception):
    return render(request, 'error/404.html', status=404)

def error_500_view(request):
    return render(request, 'error/500.html', status=500)
    
def index(request):
    return render(request, 'index.html')

def fetch_admin_alerts():
    # Calculate the date 1 day ago from now
    alert_interval = 90
    days_ago = timezone.now() - timedelta(days=alert_interval)

    # Query to find products not updated in the last day and return only their id and title
    alerts = models.product.objects.filter(date_edited__isnull=True, date_added__lt=days_ago) | \
             models.product.objects.filter(date_edited__lt=days_ago) \
             .values('id', 'title')  # Use .values() to specify which fields to include

    return list(alerts), alert_interval



@login_required(login_url='/admin')
def administration(request):
    admin_alerts = fetch_admin_alerts()
    context = {
        'alerts': admin_alerts[0],
        'alert_interval': admin_alerts[1],
    }
    return render(request, 'admin/admin_base.html', context)

def categories(request):
    return render(request, 'categories.html')

def sale_catalogue(request):
    return render(request, 'sale_catalogue.html')

def all_products(request):
    products, sort, per_page = apply_sort_and_pagination(request, models.product.objects.all())
    context = {
        'products': products,  # This now contains the paginated and sorted products
        'current_sort': sort,
        'per_page': per_page
    }

    return render(request, 'products.html', context)

def about_us(request):
    about_us_text = models.business_information.objects.values_list('about_us_text', flat=True).first()
    context = {
        'about_us':about_us_text.replace("\n", "<br>"),
    }
    return render(request, 'about_us.html', context)

def contact(request):
    return render(request, 'contact.html')

def category_search(request, category_name):
    # Fetch the main category
    main_category = get_object_or_404(models.category, name=category_name)

    # Fetch the names of all subcategories of the main category
    subcategory_names = models.category.objects.filter(parent=main_category).values_list('name', flat=True)

    # Create a list to hold the main category name and all subcategory names
    category_names = [category_name] + list(subcategory_names)

    # Fetch products that belong to the main category or any of its subcategories by name
    products = models.product.objects.filter(
        Q(category__in=category_names),
        enabled=True
    )

    # Apply sorting and pagination
    products_page, sort, per_page = apply_sort_and_pagination(request, products)

    context = {
        'category': main_category,
        'products': products_page,
        'current_sort': sort,      
        'per_page': per_page,      
        'query': True,
    }

    # Render the template with the products for the category and its subcategories
    return render(request, 'products.html', context)


def supplier_search(request, supplier_name):
    # Fetch the supplier
    supplier = get_object_or_404(models.supplier, name=supplier_name)

    # Fetch products that belong to the supplier
    products = models.product.objects.filter(
        supplier=supplier.name,  # Use supplier's name to filter products
        enabled=True
    )

    # Apply sorting and pagination
    products_page, sort, per_page = apply_sort_and_pagination(request, products)

    context = {
        'supplier': supplier,
        'products': products_page,
        'current_sort': sort,
        'per_page': per_page,
        'query': True,
    }

    # Render the template with the products for the supplier
    return render(request, 'products.html', context)

def general_search(request):
    query = request.GET.get('query', '')
    # Filter products by query
    products = models.product.objects.filter(
        Q(title__icontains=query) | 
        Q(subtitle__icontains=query) | 
        Q(description__icontains=query) |
        Q(category__icontains=query),
        enabled=True
    ).distinct()

    # You may also want to search within categories
    categories = models.category.objects.filter(name__icontains=query)

    context = {
        'products': products,
        'categories': categories,
        'query': query,
    }
    
    return render(request, 'products.html', context)

def product_page(request, product_id):
    product = get_object_or_404(models.product, pk=product_id)
    
    # Filter out images with empty values
    product_images = product.images.exclude(image__isnull=True).exclude(image__exact='')

    # Print information about the images
    print("Product ID:", product_id)
    print("Product Title:", product.title)
    print("Number of images:", product_images.count())
    for idx, image in enumerate(product_images.all(), start=1):
        print(f"Image {idx} URL:", image.image.url)

    context = {'product': product, 'product_images': product_images}
    return render(request, 'product_page.html', context)

@login_required(login_url='/admin')
def add_product(request):
    categories = models.category.objects.all()
    suppliers = models.supplier.objects.all()
    if request.method == 'POST':
        form = forms.product_form(request.POST, request.FILES)
        formset = forms.product_image_formset(request.POST, request.FILES)

        if form.is_valid() and formset.is_valid():
            # Extract title and price from the form to check if the product already exists
            title = form.cleaned_data['title']
            price = form.cleaned_data['price']

            # Check if a product with the same title and price already exists
            existing_products = models.product.objects.filter(title=title, price=price)

            if existing_products.exists():
                existing_product_id = existing_products.first().id
                # If the product exists, return a JSON response indicating failure
                print("EXISTS")
                return JsonResponse({"success": False, "errors":'ERRORS', "redirect_url": reverse('edit_product', kwargs={'product_id': existing_product_id})})

            product_instance = form.save(commit=False) 
            product_instance.enabled = True
            product_instance.save()


            image_order_combined_json = request.POST.get('image_order_combined')
            if image_order_combined_json:
                image_order_combined = json.loads(image_order_combined_json)

                # Retrieve the list of uploaded image files
                images = request.FILES.getlist('images')

                # Create a dictionary to easily find images by filename
                images_dict = {image.name: image for image in images}

                # Create a list of tuples (image file, order) based on the image_order_combined
                images_with_order = []
                for item in image_order_combined:
                    filename = item['filename']
                    order = item['order']
                    image_file = images_dict.get(filename)
                    if image_file:
                        images_with_order.append((image_file, order))

                # Now, sort images_with_order by order
                images_with_order.sort(key=lambda x: int(x[1]))

                # Save the images using the order provided
                for image_file, _ in images_with_order:
                    models.product_image.objects.create(product=product_instance, image=image_file)


            formset.instance = product_instance
            formset.save()
            return JsonResponse({"success": True, "redirect_url": reverse('products')})
        else:
            print("Form errors:", form.errors)
            print("Formset errors:", formset.errors)
            return JsonResponse({"success": False, "errors": form.errors})
    else:
        form = forms.product_form()
        formset = forms.product_image_formset()
        context = {
            'form': form,
            'formset': formset,
            'categories':categories,
            'suppliers': suppliers,
        }
        return render(request, 'admin/add_product.html', context)




@login_required(login_url='/admin')
def edit_product(request, product_id):
    product_instance = get_object_or_404(models.product, id=product_id)
    categories = models.category.objects.all()
    suppliers = models.supplier.objects.all()
    if request.method == 'POST':
        form = forms.product_form(request.POST, request.FILES, instance=product_instance)
        formset = forms.product_image_formset(request.POST, request.FILES, queryset=product_instance.images.all())

        if form.is_valid() and formset.is_valid():
            with transaction.atomic():
                # Save product instance
                product_instance = form.save(commit=False) 
                product_instance.enabled = True
                product_instance.save()

                # Delete any images that were marked for deletion
                for form in formset.deleted_forms:
                    if form.instance.pk:
                        form.instance.delete()

                # Update the remaining images
                formset.save()

                # Handle new images
                image_order_combined_json = request.POST.get('image_order_combined')
                if image_order_combined_json:
                    image_order_combined = json.loads(image_order_combined_json)
                    images = request.FILES.getlist('images')
                    images_dict = {image.name: image for image in images}
                    images_with_order = [
                        (images_dict[item['filename']], item['order'])
                        for item in image_order_combined
                        if item['filename'] in images_dict
                    ]
                    images_with_order.sort(key=lambda x: int(x[1]))
                    for image_file, _ in images_with_order:
                        models.product_image.objects.create(product=product_instance, image=image_file)

            return JsonResponse({"success": True, "redirect_url": reverse('edit_product', kwargs={'product_id': product_instance.id})})
        else:
            return JsonResponse({"success": False, "errors": form.errors, "formset_errors": formset.errors})
    else:
        form = forms.product_form(instance=product_instance)
        formset = forms.product_image_formset(queryset=product_instance.images.all())
        return render(request, 'admin/edit_product.html', {
            'form': form,
            'formset': formset,
            'product': product_instance,
            'categories': categories,
            'suppliers': suppliers,
        })



@require_POST
@login_required(login_url='/admin')
def delete_product_image(request, image_id):
    image = get_object_or_404(models.product_image, id=image_id)
    image.delete()
    return JsonResponse({"success": True, "redirect_url": reverse('edit_product', kwargs={'product_id': image.product.id})})

@login_required(login_url='/admin')
def delete_product(request, product_id):
    product = get_object_or_404(models.product, id=product_id)
    product.delete()
    return redirect('products')

@login_required(login_url='/admin')
def add_category(request):
    if request.method == 'POST':
        form = forms.category_form(request.POST, request.FILES)
        if form.is_valid():
            category = form.save(commit=False)
            category.image = request.FILES['category_image']
            category.save()
            return redirect('hjem')  # Redirect to the index page or wherever you want
        else:
            print("Form Errors:", form.errors)
            return HttpResponse(json.dumps(form.errors), content_type="application/json")
    else:
        form = forms.category_form()

    return render(request, 'admin/add_category.html', {'category_form': form})


@login_required(login_url='/admin')
def add_supplier(request):
    if request.method == 'POST':
        form = forms.supplier_form(request.POST, request.FILES)
        if form.is_valid():
            supplier = form.save(commit=False)
            try:
                supplier.image = request.FILES['supplier_image']
            except:
                pass
            supplier.save()
            return redirect('hjem')  # Redirect to the index page or wherever you want
        else:
            print("Form Errors:", form.errors)
            return HttpResponse(json.dumps(form.errors), content_type="application/json")
    else:
        form = forms.category_form()

    return render(request, 'admin/add_supplier.html', {'supplier_form': form})

@login_required(login_url='/admin')
def product_list_and_update(request, product_id=None):
    if request.method == 'POST':
        product = get_object_or_404(models.product, pk=product_id)
        form = forms.product_form(request.POST, instance=product)
        if form.is_valid():
            # Set date_edited to now on update
            product_instance = form.save(commit=False)
            product_instance.date_edited = timezone.now()
            product_instance.save()
            form.save_m2m()  # In case there are many-to-many fields on the form
            return redirect('update_products')
    else:
        products = models.product.objects.all().order_by('id')
        return render(request, 'admin/update_products.html', {'products': products, 'admin':True, 'suppliers': models.supplier.objects.all()})


@login_required(login_url='/admin')
def category_list_and_update(request, category_id=None):
    if request.method == 'POST':
        category = get_object_or_404(models.category, pk=category_id)
        form = forms.category_form(request.POST, request.FILES, instance=category)
        if form.is_valid():
            category_instance = form.save(commit=False)
            category_instance.save()
            return redirect('update_categories')
    else:
        categories = models.category.objects.all()
        return render(request, 'admin/update_categories.html', {'categories': categories, 'admin':True })

@login_required(login_url='/admin')
def text_areas_list_and_update(request, text_area_id=None, footer_text_area_id=None, business_info_id=None):
    context = {
        'text_areas': models.text_areas.objects.all(),
        'footer_text_areas': models.footer_textareas.objects.all(),
        'business_information': models.business_information.objects.all(),  # Add this line
        'admin': True
    }

    if request.method == 'POST':
        if text_area_id:
            text_area = get_object_or_404(models.text_areas, pk=text_area_id)
            form = forms.text_areas_form(request.POST, instance=text_area)
            if form.is_valid():
                form.save()
                return redirect('update_text_areas')  # Make sure this is the correct URL name
            else:
                context['text_area_form'] = form  # Include form with errors in the context

        elif footer_text_area_id:
            footer_area = get_object_or_404(models.footer_textareas, pk=footer_text_area_id)
            footer_form = forms.footer_text_areas_form(request.POST, instance=footer_area)
            if footer_form.is_valid():
                footer_form.save()
                return redirect('update_footer_text_areas')  # Make sure this is the correct URL name
            else:
                context['footer_text_area_form'] = footer_form  # Include form with errors in the context

        # Handling for business information
        elif business_info_id:
            business_info = get_object_or_404(models.business_information, pk=business_info_id)
            business_info_form = forms.business_information_form(request.POST, instance=business_info)
            if business_info_form.is_valid():
                business_info_form.save()
                return redirect('business_information')  # Redirect to appropriate URL
            else:
                context['business_info_form'] = business_info_form  # Include form with errors in the context
        elif 'street_address' in request.POST:  # Or any other unique field in the business information form
            business_info_form = forms.business_information_form(request.POST)
            if business_info_form.is_valid():
                business_info_form.save()
                return redirect('business_information')  # Redirect to appropriate URL
            else:
                context['business_info_form'] = business_info_form  # Include form with errors in the context

        # If no forms were valid, fall through to render

    # Render is called if it's a GET request or if a POST request is not valid
    return render(request, 'admin/update_text_areas.html', context)


@login_required(login_url='/admin')
def business_information_update(request, business_info_id=None):
    if request.method == 'POST':
        if business_info_id:
            # Update existing business information
            business_info_instance = get_object_or_404(models.business_information, pk=business_info_id)
            business_info_form = forms.business_information_form(request.POST, instance=business_info_instance)
        else:
            # Create new business information
            business_info_form = forms.business_information_form(request.POST)

        if business_info_form.is_valid():
            business_info_form.save()
            return redirect('update_business_info')

    else:
        business_info_form = forms.business_information_form()
        if business_info_id:
            # If an ID is provided, populate the form with that instance
            business_info_instance = get_object_or_404(models.business_information, pk=business_info_id)
            business_info_form = forms.business_information_form(instance=business_info_instance)

    # Get all instances of business information to display
    business_info_list = models.business_information.objects.all()
    
    return render(request, 'admin/update_text_areas.html', {
        'business_info_form': business_info_form,
        'business_info_list': business_info_list,
        'admin': True
    })


def login_view(request):
    if request.user.is_authenticated:
        return redirect('administration')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('administration')  # Redirect to the user's home page after login
        else:
            # Return the form with errors
            return render(request, 'login.html', {'form': form})
    else:
        form = AuthenticationForm()
        return render(request, 'login.html', {'form': form})