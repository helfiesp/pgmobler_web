import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from website_app import models


class AdministrationAccessTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.customer = models.customers.objects.create(
            name="Test Customer",
            phone_number="12345678",
            email="customer@example.com",
            street_address="Test Street 1",
            zip_code="0001",
        )
        cls.order = models.orders.objects.create(
            customer=cls.customer,
            items=json.dumps([
                {
                    "product": "Chair",
                    "amount": 1,
                    "price": "1000",
                }
            ]),
            price="1000",
            paid="0",
            remaining="1000",
        )
        cls.product = models.product.objects.create(
            title="Test Product",
            price=1000,
        )
        cls.staff_user = get_user_model().objects.create_user(
            username="staff",
            password="strong-password-123",
            is_staff=True,
        )
        cls.non_staff_user = get_user_model().objects.create_user(
            username="customer-user",
            password="strong-password-123",
            is_staff=False,
        )

    def test_sensitive_admin_routes_redirect_anonymous_users_to_login(self):
        protected_urls = [
            reverse('administration'),
            reverse('add_customer'),
            reverse('customer_detail', args=[self.customer.id]),
            reverse('add_order', args=[self.customer.id]),
            reverse('all_orders'),
            reverse('order_detail', args=[self.order.order_number]),
            reverse('update_order', args=[self.order.order_number]),
            reverse('show_order_pdf', args=[self.order.order_number]),
            reverse('order_confirmation', args=[self.order.order_number]),
            reverse('show_price_tag_pdf', args=[self.product.id]),
        ]

        for url in protected_urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertRedirects(
                    response,
                    f"{reverse('login')}?next={url}",
                    fetch_redirect_response=False,
                )

    def test_non_staff_users_get_forbidden_for_admin_routes(self):
        self.client.force_login(self.non_staff_user)

        response = self.client.get(reverse('all_orders'))

        self.assertEqual(response.status_code, 403)

    def test_staff_users_can_access_order_overview(self):
        self.client.force_login(self.staff_user)

        response = self.client.get(reverse('all_orders'))

        self.assertEqual(response.status_code, 200)
