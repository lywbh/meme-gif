import base64
import imageio
from io import BytesIO


def create_gif(base64_list):
    frames = []
    for img_base64 in base64_list:
        img_data = base64.b64decode(img_base64)
        buffer_in = BytesIO()
        buffer_in.write(img_data)
        buffer_in.seek(0)
        frames.append(imageio.imread(buffer_in))
    buffer_out = BytesIO()
    # TODO duration怎么确定？
    imageio.mimsave(buffer_out, frames, 'GIF', duration=0.1)
    gif_base64 = base64.b64encode(buffer_out.getvalue())
    return str(gif_base64, 'utf-8')
