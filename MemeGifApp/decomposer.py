import base64
from io import BytesIO
from PIL import Image


def decompose_image(file):
    decomposed_list = []
    img = Image.open(file)
    duration = img.info['duration']
    try:
        while True:
            frame = Image.new('RGBA', img.size)
            frame.paste(img, (0, 0), img.convert('RGBA'))
            output_buffer = BytesIO()
            frame.save(output_buffer, 'PNG')
            base64_data = base64.b64encode(output_buffer.getvalue())
            decomposed_list.append(str(base64_data, 'utf-8'))
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    return decomposed_list, duration
