//ハンバーガーメニュー
let hamburger = document.querySelector(".js-btn-hamburger");
let buttonText = document.querySelector(".js-btn-hamburger-text");
let menu = document.querySelector(".js-drawerMenu");
let drawerItems = document.querySelectorAll(".js-drawer-item");
let focusTrap = document.querySelector(".js-focus-trap");
let open = "is-open";
let scrollPosition;

hamburger.addEventListener("click", function () {
	[hamburger, menu].forEach((el) => el.classList.toggle(open));
	document.querySelector("html").classList.toggle("is-fixed");
	if (hamburger.classList.contains(open)) {
		scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
		console.log(scrollPosition);
		buttonText.textContent = "閉じる";
		hamburger.setAttribute("aria-expanded", "true");
		document.querySelector("body").style.top = -scrollPosition + "px";
	} else {
		buttonText.textContent = "メニュー";
		hamburger.setAttribute("aria-expanded", "false");
		window.scrollTo(0, scrollPosition);
	}
});

drawerItems.forEach(function (drawerItem) {
	drawerItem.addEventListener("click", function () {
		hamburger.click();
	});
});

focusTrap.addEventListener("focus", (e) => {
	hamburger.focus();
});

window.addEventListener("keydown", () => {
	if (event.key === "Escape") {
		hamburger.click();
	}
});

//アコーディオンメニュー
let accordionTrigger = document.querySelectorAll(".js-accordion");
accordionTrigger.forEach((item) => {
	item.addEventListener("click", (e) => {
		e.currentTarget.classList.toggle(open);
		e.currentTarget.nextElementSibling.classList.toggle(open);
		if (e.currentTarget.classList.contains(open)) {
			e.currentTarget.setAttribute("aria-expanded", "true");
		} else {
			e.currentTarget.setAttribute("aria-expanded", "false");
		}
	});
});
