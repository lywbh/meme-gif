const BASE64_HEAD = "data:image/png;base64,";

let tempSection;
let currentPage;
let image_list;
let subtitle_list;
let total_page;
let progress_panel;
let insert_button;
let result_img;

$(() => {
    tempSection = {};
    currentPage = 0;
    image_list = $("#imageList");
    subtitle_list = $("#subtitleList");
    image_list.show();
    image_list.children().eq(0).show();
    total_page = image_list.children().length;
    progress_panel = $(".progress-bar");
    insert_button = $("#insertButton");
    result_img = $("#generatedGif > img");
    new scale("#progress-button", "#all-progress", "#current-progress");
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
        const f = this;
        ["touchstart", "mousedown"].forEach(est => {
            progress_panel.bind(est, e1 => {
                e1.preventDefault();
                ["touchmove", "mousemove"].forEach(emv => {
                    progress_panel.bind(emv, e2 => {
                        let p = e2;
                        if (e2.touches) {
                            p = e2.touches[0];
                        }
                        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                        let moveX = p.clientX + scrollX;
                        let moveY = p.clientY + scrollY;
                        if ((Math.abs(moveX - f.currentX) < 100) && (Math.abs(moveY - f.currentY) < 100)) {
                            if (moveX < f.minLength) {
                                f.cur_bar.css("width", "0%");
                                f.currentX = f.minLength;
                            } else if (moveX > f.maxLength) {
                                f.cur_bar.css("width", "100%");
                                f.currentX = f.maxLength;
                            } else {
                                let percent = (moveX - f.minLength) / (f.maxLength - f.minLength);
                                f.cur_bar.css("width", percent * 100 + "%");
                                f.currentX = moveX;
                                image_list.children().hide();
                                currentPage = Math.floor(percent * image_list.children().length);
                                if (currentPage < 0) currentPage = 0;
                                if (currentPage > total_page - 1) currentPage = total_page - 1;
                                image_list.children().eq(currentPage).show();
                            }
                        }
                    });
                });
            });
        });
        ["touchend", "mouseup"].forEach(eed => {
            progress_panel.bind(eed, () => {
                ["touchmove", "mousemove"].forEach(emv => {
                    progress_panel.unbind(emv);
                });
            });
        });
    }
};

function buildSubtitleInfos() {
    let subtitleInfos = [];
    subtitle_list.children().each((i, e) => {
        let section = {
            text: $(e).find(".subtitle_text").val(),
            start: parseInt($(e).find(".subtitle_start").val()),
            end: parseInt($(e).find(".subtitle_end").val())
        };
        subtitleInfos.push(section);
    });
    return subtitleInfos;
}

function insertClick() {
    let subtitleInfos = buildSubtitleInfos();
    for (let i in subtitleInfos) {
        let section = subtitleInfos[i];
        if (currentPage >= section.start && currentPage <= section.end) {
            alert("当前位置已存在字幕");
            return;
        }
    }
    if (tempSection.start === undefined) {
        tempSection.start = currentPage;
        insert_button.text("点击确定结束位置");
    } else {
        if (currentPage <= tempSection.start) {
            alert("结束位置不能小于或等于起始位置");
            return;
        }
        for (let i in subtitleInfos) {
            let section = subtitleInfos[i];
            if (section.start > tempSection.start && section.end < currentPage) {
                alert("字幕有重叠，请重新选择");
                return;
            }
        }
        tempSection.end = currentPage;
        tempSection.text = prompt("请输入字幕内容：");
        let cloneSection = JSON.parse(JSON.stringify(tempSection));
        tempSection = {};
        let pos;
        for (pos = 0; pos < subtitleInfos.length; pos++) {
            let section = subtitleInfos[pos];
            if (section.start > cloneSection.end) {
                break;
            }
        }
        subtitleInfos.splice(pos, 0, cloneSection);
        reloadSubtitleList(subtitleInfos);
        insert_button.text("点击在此处插入字幕");
    }
}

function reloadSubtitleList(subtitleInfos) {
    subtitle_list.empty();
    for (let i in subtitleInfos) {
        let section = subtitleInfos[i];
        subtitle_list.append($("<li></li>").append(buildSubtitleItem(section)));
    }
}

function buildSubtitleItem(section) {
    return $('<div class="subtitle_item">' +
        '<input class="subtitle_text" type="text" value="' + section.text + '">' +
        '<input class="subtitle_start" type="hidden" value="' + section.start + '">' +
        '<input class="subtitle_end" type="hidden" value="' + section.end + '">' +
        '</div>');
}

function submitMeme() {
    let submitBody = {};
    let imgList = [];
    image_list.find("img").each((i, e) => {
        let imgBase64 = $(e).attr("src").replace(BASE64_HEAD, "");
        imgList.push(imgBase64);
    });
    submitBody.imgList = imgList;
    submitBody.subtitleList = buildSubtitleInfos();
    $.ajax({
        url: "/generate",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(submitBody),
        success: r => {
            result_img.attr("src", BASE64_HEAD + r);
            result_img.show();
        }
    });
}
