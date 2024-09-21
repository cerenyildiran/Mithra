from django.contrib import admin
from .models import Post, Like

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category']
    list_filter = ['category', 'author']
    search_fields = ['title', 'content']
    
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    list_filter = ('post', 'user')
    search_fields = ('post__title', 'user__username')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('post', 'user')
        return queryset