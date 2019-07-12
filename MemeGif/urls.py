from django.urls import path
from MemeGifApp import views

urlpatterns = [
    path('meme', views.home),
    path('decompose', views.decompose)
]
