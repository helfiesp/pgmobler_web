from django.core.management.base import BaseCommand
from django.utils import timezone
from website_app.models import product  

class Command(BaseCommand):
    help = 'Update all products and set their last updated date to today'

    def handle(self, *args, **kwargs):
        # Get the current time
        current_time = timezone.now()

        # Update all products and set date_edited to current time
        updated_count = product.objects.all().update(date_edited=current_time)

        # Output how many products were updated
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} products'))
