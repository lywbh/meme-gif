from django.shortcuts import render
from MemeGifApp.decomposer import decomposeImage

def home(request):
    if request.method == 'GET':
        return render(request, 'home.html')

def decompose(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        base64_list = decomposeImage(file)
        return render(request, 'censor.html', {'images': base64_list})