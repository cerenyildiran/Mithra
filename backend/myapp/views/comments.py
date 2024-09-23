from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from myapp.models import Post, Comment
from .auth import verify_token


@csrf_exempt
@require_http_methods(['POST'])
def create_comment(request, post_id):
    if request.headers.get('Content-Type') == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
    else:
        return JsonResponse({'error': 'Content type must be application/json'}, status=415)
    token = data.get('token')
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=401)
    response = verify_token(request)
    response_data = json.loads(response.content)
    if 'error' in response_data:
        return JsonResponse({'error': response_data['error']}, status=response.status_code)
    user_data = response_data.get('user')
    if not user_data:
        return JsonResponse({'error': 'Token validation failed'}, status=401)
    comment_text = data.get('comment_text')
    if not comment_text:
        return JsonResponse({'error': 'Comment text is required'}, status=400)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    try:
        user = User.objects.get(id=user_data['id'])
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    comment = Comment.objects.create(post=post, user=user, text=comment_text)
    return JsonResponse({
        'message': 'Comment created successfully',
        'comment': {
            'id': comment.id,
            'text': comment.text,
            'created_at': comment.created_at.isoformat(),
            'user': user.username,
            'post_title': post.title
        }
    }, status=201)

@require_http_methods("POST")
@csrf_exempt
def delete_comment(request, comment_id):
    if request.headers.get('Content-Type') != 'application/json':
        return JsonResponse({'error': 'Content type must be application/json'}, status=415)
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('token')
    if not token:
        return JsonResponse({'error': 'Token is required'}, status=401)
    response = verify_token(request)
    response_data = json.loads(response.content)
    if 'error' in response_data:
        return JsonResponse({'error': response_data['error']}, status=response.status_code)
    user_data = response_data.get('user')
    if not user_data:
        return JsonResponse({'error': 'Token validation failed'}, status=401)
    try:
        comment = Comment.objects.get(id=comment_id)
        user = User.objects.get(id=user_data['id'])
    except Comment.DoesNotExist:
        return JsonResponse({'error': 'Comment not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    if user.id == comment.user_id or user.id == comment.post.author_id:
        comment.delete()
        return JsonResponse({'message': 'Comment deleted successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Unauthorized to delete this comment'}, status=403)

