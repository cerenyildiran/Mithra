from django.urls import path
from .views import home, login_view, register_view, verify_token, create_post, get_posts, get_user_posts
from .views import get_user_likes, post_liked, get_post, create_comment, delete_comment, delete_post, edit_profile
from .views import change_password

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_view, name='api_login'),
    path('register/', register_view, name='api_register'),
    path('verifyToken/', verify_token, name='api_verifyToken'),
    path('createPost/', create_post, name='api_createPost'),
    path('posts/', get_posts, name='api_getPosts'),
    path('posts/<int:post_id>/', get_post, name='api_getPost'),
    path('userposts/<int:user_id>/', get_user_posts, name='get_user_posts'),
    path('posts/<int:post_id>/like/', post_liked, name='post_like'),
    path('posts/<int:post_id>/delete/', delete_post, name='post_delete'),
    path('likes/<int:user_id>/', get_user_likes, name='get_user_likes'),
    path('comment/<int:post_id>/', create_comment, name='post_comment'),
    path('comment/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
    path('edit-profile/', edit_profile , name='edit_profile'),
    path('change-password/', change_password , name='change_password'),
]
