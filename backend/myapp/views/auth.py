from django.http import  JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import json
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.authentication import default_user_authentication_rule
import re

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
    
@require_http_methods(["POST"])
@csrf_exempt
def edit_profile(request):
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
    email = data.get('email').strip()
    first_name = data.get('first_name').strip()
    last_name = data.get('last_name').strip()
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return JsonResponse({'error': 'Invalid email format'}, status=400)
    if not (2 <= len(first_name) <= 17):
        return JsonResponse({'error': 'First name must be between 2 and 17 alphabetic characters'}, status=400)
    if not (2 <= len(last_name) <= 17):
        return JsonResponse({'error': 'Last name must be between 2 and 17 alphabetic characters'}, status=400)
    try:
        current_user = User.objects.get(id=user_data['id'])
        if User.objects.exclude(id=current_user.id).filter(email=email).exists():
            return JsonResponse({'error': 'Email is already in use'}, status=400)

        current_user.email = email
        current_user.first_name = first_name
        current_user.last_name = last_name
        current_user.save()
        return JsonResponse({'message': 'Profile updated successfully'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)


@require_http_methods(["POST"])
@csrf_exempt
def change_password(request):
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
    User = get_user_model()
    try:
        user = User.objects.get(id=user_data['id'])
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    if not check_password(current_password, user.password):
        return JsonResponse({'error': 'Current password is incorrect'}, status=400)
    if not new_password or len(new_password) < 8:
        return JsonResponse({'error': 'New password is invalid or too short'}, status=400)
    user.set_password(new_password)
    user.save()
    return JsonResponse({'message': 'Password updated successfully'}, status=200)
