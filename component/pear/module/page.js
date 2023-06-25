layui.define(['jquery', 'element'], function (exports) {
	"use strict";

	var $ = layui.jquery;
	var element = layui.element;

	var page = function (opt) {
		this.option = opt;
	};

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 创建 Page 页面
	 */
	page.prototype.render = function (opt) {
		var option = {
			elem: opt.elem,
			url: opt.url,
			width: opt.width || "100%",
			height: opt.height || "100%",
			title: opt.title
		}
		renderContent(option);
		return new page(option);
	}

	/**
	 * @since Pear Admin 4.0
	 * 
	 * 切换 Page 页面 
	 */
	page.prototype.changePage = function (href, type) {

		const $frame = $(`#${this.option.elem} .pear-frame-content`);

		if (type === "_iframe") {

			$frame.html(`<iframe src='${href}' scrolling='auto' frameborder='0' allowfullscreen='true'></iframe>`);

		} else {

			$.ajax({
				url: href,
				type: 'get',
				dataType: 'html',
				success: function (data) {
					$frame.html(data)
				},
				error: function (xhr) {
					return layer.msg('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！');
				}
			});
		}

		$frame.attr("type", type);
		$frame.attr("href", href);
	}

	page.prototype.refresh = function (loading) {

		var $frameLoad = $(`#${this.option.elem} .pear-frame-loading`);
		var $frame = $(`#${this.option.elem} .pear-frame-content`);

		if (loading) {
			$frameLoad.css({
				display: 'block'
			});
		}

		if ($frame.attr("type") === "_iframe") {

			$frame.html(`<iframe src='${$frame.attr("href")}' scrolling='auto' frameborder='0' allowfullscreen='true'></iframe>`);

			const $contentFrame = $frame.find("iframe");

			$contentFrame.on("load", () => {
				$frameLoad.fadeOut(1000);
			})

		} else {
			$.ajax({
				type: 'get',
				url: $frame.attr("href"),
				dataType: 'html',
				success: function (data) {
					$frame.html(data)
					$frameLoad.fadeOut(1000);
					element.init();
				},
				error: function (xhr) {
					return layer.msg('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！');
				}
			});
		}
	}

	function renderContent(option) {

		$("#" + option.elem).html(`
			<div class='pear-frame'>
				<div class='pear-frame-content' type='${option.type}' href='${option.url}'></div>
				<div class="pear-frame-loading">
					<div class="ball-loader">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>`);

		var $frame = $("#" + option.elem).find(".pear-frame-content");

		if (option.type === "_iframe") {

			$frame.html(`<iframe src='${option.url}' scrolling='auto' frameborder='0' allowfullscreen='true'></iframe>`);
		} else {
			$.ajax({
				url: option.url,
				type: 'get',
				dataType: 'html',
				success: function (data) {
					$frame.html(data);
				},
				error: function (xhr) {
					return layer.msg('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！');
				}
			});
		}
	}

	exports('page', new page());
});
