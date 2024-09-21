from django.urls import path
from .views import home, login_view, register_view, verify_token, create_post

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_view, name='api_login'),
    path('register/', register_view, name='api_register'),
    path('verifyToken/', verify_token, name='api_verifyToken'),
    path('createPost/', create_post, name='api_createPost'),
]
