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

