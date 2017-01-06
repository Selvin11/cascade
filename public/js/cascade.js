$(function() {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
    var data = {
        "subways": [{
            "id": 1,
            "createDate": "2016-12-26 22:32:23",
            "modifyDate": "2016-12-26 22:32:47",
            "city": "深圳市",
            "name": "1号线",
            "site": "会展中心,岗厦"
        }, {
            "id": 2,
            "createDate": "2016-12-26 22:32:52",
            "modifyDate": "2016-12-26 22:33:16",
            "city": "深圳市",
            "name": "4号线",
            "site": "会展中心,市民中心"
        }]
    };

    var dataArea = {
        "areas": [{
            "billNo": "HA161100001",
            "parentBillNo": "1",
            "areaCode": "NSQ",
            "areaName": "南山区",
            "path": "SZ.NSQ",
            "parentName": null,
            "children": [{
                "billNo": "HA161100004",
                "parentBillNo": "HA161100001",
                "areaCode": "NANTOUPIAN",
                "areaName": "南头片区",
                "path": "SZ.NSQ.NANTOUPIAN",
                "parentName": null,
                "children": []
            }, {
                "billNo": "HA161100005",
                "parentBillNo": "HA161100001",
                "areaCode": "NANYOU",
                "areaName": "南油片区",
                "path": "SZ.NSQ.NANYOU",
                "parentName": null,
                "children": []
            }]
        }]
    };

    // 限制高度，禁止页面滚动
    function disabledScroll() {
        $('.container').height($(window).height() - 100).css('overflow', 'hidden');
    }
    // 释放滚动
    function letScroll() {
        $('.container').css({
            "height": "auto",
            overflow: "scroll"
        });
    }

    //  $('.sift-item1')  $('.sift-item2') 清空
    function clearAll() {
        $('.sift-item1').empty();
        $('.sift-item2').empty();
    }

    var screenTabcontent = $('.screen-tabcontent'),
        screenItem = $('.screen-item');
    screenTabcontent.hide();
    // 第一步 点击筛选栏

    screenItem.on('click', function(e) {
        // 点击时，当前索引值
        var screenIndex = $(this).index();
        // 遍历四个tabcontent，索引不为当前值，执行以下函数
        screenTabcontent.each(function(i) {
            if (i !== screenIndex) {
                // 隐藏其他tabcontent
                screenTabcontent.eq(i).hide();
                // 调整其他screenItem箭头方向，并不影响当前screenItem
                screenItem.find('.iconfont').eq(i).removeClass('icon-top-arrow').addClass('icon-bottom-arrow');
            }
        });
        // 位置筛选框
        var siftWrap = screenTabcontent.eq(screenIndex);
        // 第一次点击显示筛选框
        siftWrap.toggle();
        if (siftWrap.css('display') === "block") {
            disabledScroll();
        } else {
            letScroll();
        }

        // 箭头方向
        var iconfont = $(this).find('.iconfont');

        function arrowDirec() {
            if (iconfont.hasClass('icon-bottom-arrow')) {
                iconfont.removeClass('icon-bottom-arrow').addClass('icon-top-arrow');
            } else {
                iconfont.removeClass('icon-top-arrow').addClass('icon-bottom-arrow');
            }
        }
        arrowDirec();

        // 第二步 筛选框内容点击更新
        // 点击增加active
        function addActive(target) {
            target.addClass('active').siblings('.item').removeClass('active');
        }
        // 数据刷新
        function update(target, data, dataType, dataName1, dataName2) {
            target.on('click', function() {
                addActive($(this));
                clearAll();
                var names = '<li class="item">不限</li>';
                // 获取第二栏数据
                $(data[dataType]).each(function(i, v) {
                    names += "<li class='item'>" + v[dataName1] + "</li>";
                });
                $('.sift-item1').empty().append(names);
                // 获取第三栏数据
                $('.sift-item1').find('.item').on('click', function() {
                    addActive($(this));
                    var sites = '<li class="item">不限</li>',
                        index = $(this).index(),
                        siteArr = [];
                    if (dataName2 !== "") {
                        siteArr = data[dataType][index][dataName2].split(",");
                        $(siteArr).each(function(i, v) {
                            sites += "<li class='item'>" + v + "</li>";
                        })
                    } else {
                        $(data[dataType][index].children).each(function(i, v) {
                            sites += "<li class='item'>" + v[dataName1] + "</li>";
                        })
                        $('.sift-item2').empty().append(sites);
                    }
                    $('.sift-item2').empty().append(sites);
                    // 点击站台刷新房源数据
                    $('.sift-item2').find('.item').on('click', function() {
                        addActive($(this));
                        if ($('.sift-item0 .item').hasClass('active') && $('.sift-item1 .item').hasClass('active')) {
                            $(screenItem[screenIndex]).find('.name').text($(this).text());
                            $('.sift-wrap').hide();
                            arrowDirec();
                        }
                    })
                })
            });
        }
        // 地铁
        // update($("#subway"), data, "subways", "name", "site");
        $("#subway").on('click', function() {
            addActive($(this));
            clearAll();
            var names = '<li class="item">不限</li>';
            // 获取地铁线路
            $(data.subways).each(function(i, v) {
                names += "<li class='item'>" + v.name + "</li>";
            });
            $('.sift-item1').empty().append(names);
            // 获取地铁线路对应的站台
            $('.sift-item1').find('.item').on('click', function() {
                addActive($(this));
                var sites = '<li class="item">不限</li>',
                    index = $(this).index(),
                    siteArr = [];
                siteArr = data.subways[index].site.split(",");
                $(siteArr).each(function(i, v) {
                    sites += "<li class='item'>" + v + "</li>";
                })
                $('.sift-item2').empty().append(sites);
                // 点击站台刷新房源数据
                $('.sift-item2').find('.item').on('click', function() {
                    addActive($(this));
                    if ($('.sift-item0 .item').hasClass('active') && $('.sift-item1 .item').hasClass('active')) {
                        $(screenItem[screenIndex]).find('.name').text($(this).text());
                        $('.sift-wrap').hide();
                        arrowDirec();
                    }
                })
            })
        });

        //地区
        // update($("#area"), dataArea, "areas", "areaName", "");
        $('#area').on('click', function() {
            clearAll();
            addActive($(this));
            var names = '<li class="item">不限</li>';
            // 获取地区
            $(dataArea.areas).each(function(i, v) {
                names += "<li class='item'>" + v.areaName + "</li>";
            });
            $('.sift-item1').empty().append(names);
            // 获取地区对应的区域
            $('.sift-item1').find('.item').on('click', function() {
                addActive($(this));
                var sites = '<li class="item">不限</li>',
                    index = $(this).index();
                $(dataArea.areas[index].children).each(function(i, v) {
                    sites += "<li class='item'>" + v.areaName + "</li>";
                })
                $('.sift-item2').empty().append(sites);
                // 点击站台刷新房源数据
                $('.sift-item2').find('.item').on('click', function() {
                    addActive($(this));
                    if ($('.sift-item0 .item').hasClass('active') && $('.sift-item1 .item').hasClass('active')) {
                        $(screenItem[screenIndex]).find('.name').text($(this).text());
                        $('.sift-wrap').hide();
                        arrowDirec();
                    }
                })
            })
        });


        // 第三步  筛选框的显示隐藏
        //  点击显示筛选框显示隐藏 
        //  筛选框隐藏条件：1. 三列数据均含.active  && 点击了第三列中的一项 （并刷新房源）
        //                  2. 不满足条件1，点击筛选框之外的地方

        $('.sift-item2 .item.active').on('click', function() {
            if ($('.sift-item0 .item').hasClass('active') && $('.sift-item1 .item').hasClass('active')) {
                siftWrap.hide();
                arrowDirec();
            }
        });

        // 租金、排序、居室
        if ($(screenTabcontent[screenIndex]).is('.col-nav-wrap')) {
            $(screenTabcontent[screenIndex]).find('.col-nav-item').on('click', function() {
                addActive($(this));
                $(screenItem[screenIndex]).find('.name').text($(this).text());
                $(screenTabcontent[screenIndex]).hide();
                screenItem.find('.iconfont').removeClass('icon-top-arrow').addClass('icon-bottom-arrow');
            })
        }

        screenTabcontent.on('click', function(e) {
            // 点击筛选框之外的地方
            if ($(e.target).is('.screen-tabcontent')) {
                $(this).hide();
                screenItem.find('.iconfont').removeClass('icon-top-arrow').addClass('icon-bottom-arrow');
            }
        });
    });
})