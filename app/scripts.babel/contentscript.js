'use strict';


function viewAd(ad_id, success_callback) {
  var data = new FormData();
  data.append("key", "c17d5009f2de512fae68880ea4375ef8adbc34e56a7444c0248fcb63bd0ffaed9995200a46cee0176654b244c9b9f2934d935576650b15c6792621e94cbec163");
  data.append("app_id", "leboncoin_iphone");

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4) {
      success_callback(xhr)
    }
  });

  xhr.open("POST", `https://mobile.leboncoin.fr/templates/api/view.json?ad_id=${ad_id}`);
  xhr.setRequestHeader("cache-control", "no-cache");
  //xhr.setRequestHeader("postman-token", "b4878f34-13ec-1f47-bbd9-451dfa3d52c3");

  xhr.send(data);
}


const listingAds = document.querySelector('#listingAds');

const listItems = listingAds.querySelectorAll('section > section > ul > li > a');

listItems.forEach((el) => {
  const info = JSON.parse(el.getAttribute('data-info'));
  const imgContainerEl = el.querySelector('div');
  const imgEl = el.querySelector('div > span > span > img');

  imgContainerEl.onmouseover = (e) => {
    if (imgContainerEl.getAttribute('data-images')) {
      return;
    }
    imgContainerEl.setAttribute('data-images', true); //prevent multiple

    viewAd(info['ad_listid'], (xhr) => {
      const responseJson = JSON.parse(xhr.responseText);
      const images = responseJson['images'];
      imgContainerEl.setAttribute('data-images', images); // FYI, not used in code

      const leftElement = document.createElement('i')
      leftElement.className = 'icon-chevron-left icon-3x small-hidden tiny-hidden';
      leftElement.onclick = (e) => {
        e.preventDefault();
        console.log('left clicked');
        const index = images.indexOf(imgEl.src);
        imgEl.src = images[(index-1)%images.length];
        return false;
      };

      const rightElement = document.createElement('i');
      rightElement.className = 'icon-chevron-right icon-3x small-hidden tiny-hidden';
      rightElement.onclick = (e) => {
        e.preventDefault();
        console.log('right clicked');
        const index = images.indexOf(imgEl.src);
        imgEl.src = images[(index+1)%images.length];
        return false;
      };

      imgEl.parentNode.insertBefore(leftElement, imgEl);
      imgEl.parentNode.insertBefore(rightElement, imgEl.nextSibling);
    })
  }
})
