import base64
from io import BytesIO
from PIL import Image


def analyse_image(file):
    im = Image.open(file)
    results = {
        'size': im.size,
        'mode': 'full',
    }
    try:
        while True:
            if im.tile:
                tile = im.tile[0]
                update_region = tile[1]
                update_region_dimensions = update_region[2:]
                if update_region_dimensions != im.size:
                    results['mode'] = 'partial'
                    break
            im.seek(im.tell() + 1)
    except EOFError:
        pass
    return results


def decompose_image(file):
    decomposed_list = []
    mode = analyse_image(file)['mode']
    im = Image.open(file)
    p = im.getpalette()
    last_frame = im.convert('RGBA')
    try:
        while True:
            if not im.getpalette():
                im.putpalette(p)
            new_frame = Image.new('RGBA', im.size)
            if mode == 'partial':
                new_frame.paste(last_frame)
            new_frame.paste(im, (0, 0), im.convert('RGBA'))
            output_buffer = BytesIO()
            new_frame.save(output_buffer, 'PNG')
            base64_data = base64.b64encode(output_buffer.getvalue())
            decomposed_list.append(str(base64_data, 'utf-8'))
            last_frame = new_frame
            im.seek(im.tell() + 1)
    except EOFError:
        pass
    return decomposed_list
