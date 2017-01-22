$(function() {

	var body = $("body");
	var header = $(".header");
	var gallery;


	// запрос к файлу с данными
	function getGalleryData() {
		$.ajax({
			url: "json/gallery-data.json",
			success: function(data) {
				createGallery(data);
			}
		})
	};


	// построить галерею
	function createGallery(data) {

		var gallerySlideTemplate = $("#gallerySlideTemplate").html();
		var galleryWrapper = $(".gallery__wrapper");
		var gallerySlides = "";

		var galleryNavListTemplate = $("#galleryNavListTemplate").html();
		var galleryNavList = $(".gallery__nav-list");
		var galleryNavListItems = "";

		for (var i = 0; i < data.length; i++) {
			gallerySlides += gallerySlideTemplate;
			galleryNavListItems += galleryNavListTemplate;
		}

		galleryWrapper.html(gallerySlides);
		galleryNavList.html(galleryNavListItems);

		for (var i = 0; i < data.length; i++) {

			var slide = $(".gallery__slide").eq(i);
			var img = slide.find(".gallery__slide-img");

			var navItem = $(".gallery__nav-item").eq(i);
			var navLink = navItem.find(".gallery__nav-link");

			img.css("background-image", "url(" + data[i].img + ")");

			navItem.attr("data-slide", i);
			navLink.text(data[i].title);
		}

		gallery = new Swiper (".gallery__container", {
			loop: false,
			autoplay: 4000,
			speed: 1000,
			effect: "coverflow",
			coverflow: {
				rotate: 60,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows : true
			},
			centeredSlides: true,
			slidesPerView: 2,
			nextButton: ".swiper-slide-next",
			prevButton: ".swiper-slide-prev",
			onInit: function(swiper) {
				setActiveGalleryItem(swiper);
			},
			onTransitionEnd: function(swiper) {
				setActiveGalleryItem(swiper);
			},
		});
	}


	// обозначить активный элемент навигации галереи
	function setActiveGalleryItem(swiper) {
		$(".gallery__nav-item_active").removeClass("gallery__nav-item_active");
		$(".gallery__nav-item").eq(swiper.activeIndex).addClass("gallery__nav-item_active");
	};


	// обработчик клика по элементу навигации галереи
	body.on("click", ".gallery__nav-item", function() {

		var self = $(this);
		var slide = self.data("slide");

		gallery.slideTo(slide);
	});


	// обработчик клика по следующему, предыдущему слайду
	body.on("click", ".gallery__slide", function() {

		var self = $(this);

		if (self.hasClass("swiper-slide-next")) {
			gallery.slideNext();
		} else if (self.hasClass("swiper-slide-prev")) {
			gallery.slidePrev();
		}
		
	});


	// обработчик клика по кнопке меню
	body.on("click", ".header__menu-btn", function() {

		var self = $(this);

		if (self.hasClass("header__menu-btn_active")) {
			self.removeClass("header__menu-btn_active");
			header.removeClass("header_open");
		} else {
			self.addClass("header__menu-btn_active");
			header.addClass("header_open");
		}
	});


	// определить мобильный браузер
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};


	// параллакс контейнера с видео
	function introMove() {
		var introHeight = $(".intro").height();
		var videoHeight = $(".intro__video-wrap").height();
		var resultVideoHeight = videoHeight - introHeight;

		var documentHeight = document.documentElement.clientHeight;
		var scrollHeight = document.documentElement.scrollHeight;
		var resultScrollHeight = scrollHeight - documentHeight;

		var coeff = resultScrollHeight / introHeight;

		if (!isMobile.any()) {

			$(".intro__video-wrap").css("transform", "translateY(" + -(window.pageYOffset * coeff) + "px)");
			$(".intro__title").css("transform", "translateY(" + -(window.pageYOffset * coeff) + "px)");
		}
	}
	

	$(window).on("scroll", function() {
		introMove();
	});

	introMove();
	getGalleryData();

});

