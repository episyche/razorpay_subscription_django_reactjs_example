from . import views
from django.urls import path

urlpatterns = [
    path("new-subscription", views.create_subscription),
    path("callback", views.subscription_callback),
]