from django.contrib import admin
from .models import Post

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category']
    list_filter = ['category', 'author']
    search_fields = ['title', 'content']