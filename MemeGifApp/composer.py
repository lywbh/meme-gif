import base64
import imageio
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont


def embed_subtitle(img_base64, subtitle):
    img_data = base64.b64decode(img_base64)
    buffer_in = BytesIO()
    buffer_in.write(img_data)
    buffer_in.seek(0)
    img = Image.open(buffer_in)
    (width, height) = img.size
    font_size = width / 20
    x_offset = (width - font_size * len(subtitle)) / 2
    font = ImageFont.truetype("msyh.ttc", int(font_size))
    draw = ImageDraw.Draw(img)
    draw.text((int(x_offset), int(height - 2 * font_size)), subtitle, font=font, fill="white")
    buffer_out = BytesIO()
    img.save(buffer_out, 'PNG')
    out_base64 = base64.b64encode(buffer_out.getvalue())
    return str(out_base64, 'utf-8')


def create_gif(base64_list, duration):
    frames = []
    for img_base64 in base64_list:
        img_data = base64.b64decode(img_base64)
        buffer_in = BytesIO()
        buffer_in.write(img_data)
        buffer_in.seek(0)
        frames.append(imageio.imread(buffer_in))
    buffer_out = BytesIO()
    # TODO duration怎么确定？
    imageio.mimsave(buffer_out, frames, 'GIF', duration=duration / 1000)
    gif_base64 = base64.b64encode(buffer_out.getvalue())
    return str(gif_base64, 'utf-8')
