from django.http import HttpResponse
from .auth import *
from .comments import *
from .like import *
from .posts import *

# Create your views here.
def home(request):
    return HttpResponse("Home Page")
