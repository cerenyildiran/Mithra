from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
import json
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.authentication import default_user_authentication_rule
from .models import Post, Like

# Create your views here.
def home(request):
    return HttpResponse("Home Page")


@require_http_methods(["POST"])
@csrf_exempt
def login_view(request):
    if request.headers.get('Content-Type') == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
    else:
        data = request.POST

    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'error': 'Please provide username and password'}, status=400)
    

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data,
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid Username or Password'}, status=400)
    

@require_http_methods(["POST"])
@csrf_exempt
def register_view(request):
    if request.headers.get('Content-Type') == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
    else:
        data = request.POST

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not password or not email:
        return JsonResponse({'error': 'Please enter the information completely.'}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'This username is already taken.'}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'An account with this email address already exists.'}, status=400)
    try:
        validate_password(password)
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return JsonResponse({'success': 'User registered successfully.'}, status=201)
    except ValidationError as e:
        return JsonResponse({'error': list(e.messages)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@require_http_methods(["POST"])
@csrf_exempt
def verify_token(request):
    if request.headers.get('Content-Type') == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
    else:
        data = request.POST

    token = data.get('token')
    if not token:
        return JsonResponse({'error': 'Tokens are required'}, status=400)

    try:
        untyped_token = UntypedToken(token)
        user_id = untyped_token['user_id']
        user = User.objects.get(id=user_id)

        if not default_user_authentication_rule(user):
            raise InvalidToken('User is inactive or deleted')

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        return JsonResponse({
            'user': user_data
        }, status=200)
    except (InvalidToken, TokenError) as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)


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
    posts = Post.objects.all()
    posts_data = []
    for post in posts:
        post_data = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "category": post.category,
            "author": post.author.username
        }
        posts_data.append(post_data)
    
    return JsonResponse(posts_data, safe=False)

@require_http_methods(['GET'])
def get_user_posts(request, user_id):
    posts = Post.objects.filter(author_id=user_id)
    posts_data = [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "category": post.category,
            "author": post.author.username
        }
        for post in posts
    ]
    return JsonResponse(posts_data, safe=False)


@require_http_methods(['GET'])
def get_user_likes(request, user_id):
    likes = Like.objects.filter(user_id=user_id).select_related('post', 'user')
    likes_data = [
        {
            "like_id": like.id,
            "post_id": like.post.id,
            "post_title": like.post.title,
            "post_content": like.post.content,
            "post_category": like.post.category,
            "author_username": like.post.author.username
        }
        for like in likes
    ]
    return JsonResponse(likes_data, safe=False)




