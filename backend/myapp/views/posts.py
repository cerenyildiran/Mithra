from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import json
from .auth import verify_token
from myapp.models import Post


@require_http_methods(['POST'])
@csrf_exempt
def create_post(request):
    if request.headers.get('Content-Type') == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
    else:
        return JsonResponse({'error': 'Content type must be application/json'}, status=415)

    token = data.get('token')
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=400)
    
    response = verify_token(request)
    response_data = json.loads(response.content)
    
    if 'error' in response_data:
        return response
    
    user_data = response_data.get('user')
    if not user_data:
        return JsonResponse({'error': 'Token validation failed'}, status=401)

    title = data.get('title')
    content = data.get('content')
    category = data.get('category')

    if not 3 <= len(title) <= 50:
        return JsonResponse({'error': 'Title must be between 3 and 50 characters'}, status=400)
    
    if len(content) > 300:
        return JsonResponse({'error': 'Content must be under 300 characters'}, status=400)
    
    if category not in ['animals', 'foods', 'celebrities', 'politics', 'art']:
        return JsonResponse({'error': 'Invalid category'}, status=400)

    try:
        user = User.objects.get(id=user_data['id'])
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    post = Post(title=title, content=content, author=user, category=category)
    post.save()

    return JsonResponse({'message': 'Post created successfully'}, status=201)


@require_http_methods(['GET'])
def get_posts(request):
    posts = Post.objects.all().prefetch_related('likes')
    posts_data = []
    for post in posts:
        post_data = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "category": post.category,
            "created_at": post.created_at,
            "author": post.author.username,
            "likes": [like.user.username for like in post.likes.all()]
        }
        posts_data.append(post_data)
    
    return JsonResponse(posts_data, safe=False)

@require_http_methods(['GET'])
def get_post(request, post_id):
    try:
        post = Post.objects.prefetch_related('likes', 'comments').get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    post_data = {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "category": post.category,
        "created_at": post.created_at,
        "author": post.author.username,
        "likes": [like.user.username for like in post.likes.all()],
        "comments": [
            {
                "id": comment.id,
                "username": comment.user.username,
                "comment": comment.text,
                "created_at": comment.created_at
            } for comment in post.comments.all()
        ]
    }
    return JsonResponse(post_data, safe=False)



@require_http_methods(['GET'])
def get_user_posts(request, user_id):
    posts = Post.objects.filter(author_id=user_id).prefetch_related('likes')
    posts_data = [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "category": post.category,
            "created_at": post.created_at,
            "author": post.author.username,
            "likes": [like.user.username for like in post.likes.all()]
        }
        for post in posts
    ]
    return JsonResponse(posts_data, safe=False)

@csrf_exempt
@require_http_methods(['POST'])
def delete_post(request, post_id):
    if request.headers.get('Content-Type') != 'application/json':
        return JsonResponse({'error': 'Content type must be application/json'}, status=415)
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('token')
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=400)
    response = verify_token(request)
    response_data = json.loads(response.content)
    if 'error' in response_data:
        return JsonResponse({'error': response_data['error']}, status=response_data.get('status', 400))
    user_data = response_data.get('user')
    if not user_data:
        return JsonResponse({'error': 'Token validation failed'}, status=401)
    try:
        post = Post.objects.get(id=post_id)
        if post.author.id != user_data['id']:
            return JsonResponse({'error': 'Unauthorized to delete this post'}, status=403)
        post.delete()
        return JsonResponse({'message': 'Post deleted successfully'}, status=204)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
