from django.urls import path
from . import views   # ✅ import views from this app

urlpatterns = [
    path('movies/', views.get_movies, name='get-list'),
    path('movies/<int:pk>/', views.movie_detail, name='movie-detail'),
]