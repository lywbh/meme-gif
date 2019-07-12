$(() => {
	subtitleInfos = [];
    image_list = $("#imageList");
    image_list.show();
    image_list.children().eq(0).show();
    total_page = image_list.children().length;
    progress_bar = new scale("#progress-button", "#all-progress", "#current-progress");
});

scale = function (btn, bar, cur_bar) {
    this.btn = $(btn);
    this.bar = $(bar);
    this.cur_bar = $(cur_bar);
    this.minLength = this.bar.offset().left;
    this.maxLength = this.minLength + this.bar.width();
    this.currentX = this.btn.offset().left;
    this.currentY = this.btn.offset().top;
    this.init();
};

scale.prototype = {
    init: function () {
        var f = this;
        ["touchstart", "mousedown"].forEach(est => {
            $(document).bind(est, e1 => {
                e1.preventDefault();
                ["touchmove", "mousemove"].forEach(emv => {
                    $(document).bind(emv, e2 => {
                        var p = e2;
                        if (e2.touches) {
                            p = e2.touches[0];
                        }
                        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                        var moveX = p.clientX + scrollX;
                        var moveY = p.clientY + scrollY;
                        console.log(moveX + "-" + f.currentX + "," + moveY + "-" + f.currentY);
                        if ((Math.abs(moveX - f.currentX) < 100) && (Math.abs(moveY - f.currentY) < 100)) {
                            if (moveX < f.minLength) {
                                f.cur_bar.css("width", "0%");
                                f.currentX = f.minLength;
                            } else if (moveX > f.maxLength) {
                                f.cur_bar.css("width", "100%");
                                f.currentX = f.maxLength;
                            } else {
                                var percent = (moveX - f.minLength) / (f.maxLength - f.minLength);
                                f.cur_bar.css("width", percent * 100 + "%");
                                f.currentX = moveX;
                                image_list.children().hide();
                                var page = Math.floor(percent * image_list.children().length);
                                if (page < 0) page = 0;
                                if (page > total_page - 1) page = total_page - 1;
                                image_list.children().eq(page).show();
                            }
                        }
                    });
                });
            });
        });
        ["touchend", "mouseup"].forEach(eed => {
            $(document).bind(eed, () => {
                ["touchmove", "mousemove"].forEach(emv => {
                    $(document).unbind(emv);
                });
            });
        });
    }
};


var tempSection = {};
function insertClick() {
	for (var i in image_list) {
		// TODO 判断落点不在已有段落的内部
	}
	if (!tempSection.start) {
		// TODO 记录临时起点
	} else {
		// TODO 判断终点>起点，并且没有横跨段落
	}
}
