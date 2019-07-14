import json

from django.http import HttpResponse
from django.shortcuts import render
from MemeGifApp.decomposer import decompose_image
from MemeGifApp.composer import create_gif, embed_subtitle


def home(request):
    if request.method == 'GET':
        return render(request, 'home.html')


def decompose(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        base64_list, duration = decompose_image(file)
        return render(request, 'censor.html', {'images': base64_list, 'duration': duration})


def generate(request):
    if request.method == 'POST':
        req_json = json.loads(str(request.body, "utf-8"))
        base64_list = req_json['imgList']
        subtitle_list = req_json['subtitleList']
        duration = req_json['duration']
        for subtitle_info in subtitle_list:
            for i in range(subtitle_info['start'], subtitle_info['end']):
                base64_list[i] = embed_subtitle(base64_list[i], subtitle_info['text'])
        gif_base64 = create_gif(base64_list, duration)
        return HttpResponse(gif_base64)
