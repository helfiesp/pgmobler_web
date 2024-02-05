from django.shortcuts import render
from django.db.models import Q
from . import models
from . import forms
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone


def index(request):
    return render(request, 'index.html')

def administration(request):
    return render(request, 'admin/admin_base.html')

def categories(request):
    return render(request, 'categories.html')

def all_products(request):
    return render(request, 'products.html')

def about_us(request):
    return render(request, 'about_us.html')

def contact(request):
    return render(request, 'contact.html')

def category_search(request, category_name):
    # Fetch the main category
    main_category = get_object_or_404(models.category, name=category_name)

    # Fetch the names of all subcategories of the main category
    subcategory_names = models.category.objects.filter(parent=main_category).values_list('name', flat=True)

    # Fetch products that belong to the main category or any of its subcategories
    products = models.product.objects.filter(
        Q(category=category_name) | Q(category__in=subcategory_names),
        enabled=True
    ).order_by('-date_added')

    context = {
        'category': main_category,
        'products': products,
        'query': True,
    }

    # Render the template with the products for the category and its subcategories
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
    product = get_object_or_404(models.product, pk=product_id)  # Replace 'Product' with your product model
    context = {'product': product}
    return render(request, 'product_page.html', context)

def add_product(request):
    categories = models.category.objects.all()
    if request.method == 'POST':
        form = forms.product_form(request.POST, request.FILES)
        formset = forms.product_image_formset(request.POST, request.FILES)

        if form.is_valid() and formset.is_valid():
            product_instance = form.save(commit=False) 
            product_instance.enabled = True
            product_instance.save()

            images = request.FILES.getlist('images')
            for image_file in images:
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
            'categories':categories
        }
        return render(request, 'admin/add_product.html', context)

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
        products = models.product.objects.all()
        return render(request, 'admin/update_products.html', {'products': products, 'admin':True })

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