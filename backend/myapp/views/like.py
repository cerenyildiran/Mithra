from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from myapp.models import Like, Post
from .auth import verify_token


@require_http_methods(['GET'])
def get_user_likes(request, user_id):
    likes = Like.objects.filter(user_id=user_id).select_related('post', 'user')
    likes_data = [
        {
            "like_id": like.id,
            "id": like.post.id,
            "title": like.post.title,
            "content": like.post.content,
            "category": like.post.category,
            "created_at": like.post.created_at,
            "like_created_at": like.created_at,
            "author": like.post.author.username,
            "likes": [like.user.username for like in like.post.likes.all()]
        }
        for like in likes
    ]
    return JsonResponse(likes_data, safe=False)


@require_http_methods(['POST', 'DELETE'])
@csrf_exempt
def post_liked(request, post_id):
    try:
        data = json.loads(request.body.decode('utf-8'))
        token = data.get('token')
        method = data.get('method')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=401)
    response = verify_token(request)
    response_data = json.loads(response.content.decode('utf-8'))
    if 'error' in response_data:
        return response
    user = response_data.get('user')
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    if method == 'POST':
        like, created = Like.objects.get_or_create(user_id=user['id'], post=post)
        if created:
            return JsonResponse({'message': 'Post liked successfully'}, status=201)
        else:
            return JsonResponse({'error': 'Already liked'}, status=409)
    elif method == 'DELETE':
        try:
            like = Like.objects.get(user_id=user['id'], post=post)
            like.delete()
            return JsonResponse({'message': 'Like deleted successfully'}, status=204)
        except Like.DoesNotExist:
            return JsonResponse({'error': 'Like not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=400)
    
