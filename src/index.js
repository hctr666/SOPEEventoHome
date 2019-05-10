
import 'normalize.css/normalize.css'
import './styles/index.scss'
import {
   domIsReady,
   isTouchMode,
   hasWebpSupport,
   slugify,
   isIOS
} from './js/utils'
import SwiperTabs from './js/swiper-tabs'

/*import ProductListNavigation from './js/productlist-navigation'*/
import ProductPanel from './js/product-panel'
/*import './js/products'*/

import SliderIntro from './js/slider-intro'
import DailyDeals from './js/daily-deals'
import MutationObserver from 'mutation-observer'
import './js/latest-products'
require('intersection-observer')

let productListWrapperEl = null
let sectionNewsEl = null
let scrollToTopEl = null
let scrollToTopRefElem = null
let shouldResetMissingPrices = false

// Add touch mode class
const checkIsTouchDevice = () => {
   return isTouchMode()
}

const addHTMLClasses = () => {
   // Add touch mode class
   if (checkIsTouchDevice()) {
      document.documentElement.classList.add('touch-mode')
   }

   if (hasWebpSupport()) {
      document.documentElement.classList.add('supports-webp')
   }

   if (isIOS()) {
      document.documentElement.classList.add('ios')
   }
}

addHTMLClasses()

// Improve image quality of product items
const improveProdImagesSrcs = () => {
   const $prodImages = $('.fbra_productImage img').not('.fbra_productImage__cyberLogo')
   if ($prodImages.length > 0) {
      $prodImages.each((i, $prodImage) => {
         const curProdImageSrc = $prodImage.src
         if (curProdImageSrc.indexOf('$lista175$') === -1) {
            $prodImage.src = `${$prodImage.src}?$lista175$`
            $prodImage.classList.add('res_improved')
         }
      })
   }
}

const resetProductListScrollPosition = () => {
   if (productListWrapperEl && productListWrapperEl.parentNode) {
      productListWrapperEl.parentNode.scrollTo(0, 0)
   }
}

// Handle productlist tab click events
const handleClickProductListTab = () => {
   const $prodListTabs = $('.fbra_categoryListTab')
   if ($prodListTabs.length > 0) {
      $prodListTabs.each((i, $tab) => {
         $tab.addEventListener('click', e => {
            e.preventDefault()
            shouldResetMissingPrices = true
            resetProductListScrollPosition()
         })
      })
   }
}

// Init section promotions functionality
const sectionPromotions = () => {
   const swiperPromotions = new Swiper('.section-promotions .swiper-container', {
      init: false,
      slidesPerView: 5,
      spaceBetween: 5,
      navigation: {
         nextEl: '.slider-promotions-btn-next',
         prevEl: '.slider-promotions-btn-prev'
      },
      breakpoints: {
         1200: {
            autoplay: 4000,
            slidesPerView: 'auto',
            freeMode: true,
            freeModeMomentumRatio: .4,
         }
      }
   })
   swiperPromotions.on('init', () => {
      const imageElems = swiperPromotions.imagesToLoad
      if (imageElems.length > 0) {
         for (let i = 0; i < imageElems.length; i++) {
            imageElems[i].src = imageElems[i].dataset.src + `&${hasWebpSupport() ? 'fmt=webp' : ''}`
            imageElems[i].classList.remove('swiper-lazy')
         }
      }
   })
   swiperPromotions.init()
}

// Init section promotions functionality
const sectionOurBrands = () => {
   const swiperOurBrands = new Swiper('.section-our-brands .swiper-container', {
      init: false,
      slidesPerView: 5,
      spaceBetween: 5,
      navigation: {
         nextEl: '.slider-our-brands-btn-next',
         prevEl: '.slider-our-brands-btn-prev'
      },
      breakpoints: {
         1200: {
            autoplay: 4000,
            slidesPerView: 'auto',
            freeMode: true,
            freeModeMomentumRatio: .4,
         }
      }
   })
   swiperOurBrands.on('init', () => {
      const imageElems = swiperOurBrands.imagesToLoad
      if (imageElems.length > 0) {
         for (let i = 0; i < imageElems.length; i++) {
            imageElems[i].src = imageElems[i].dataset.src + `&${hasWebpSupport() ? 'fmt=webp' : ''}`
            imageElems[i].classList.remove('swiper-lazy')
         }
      }
   })
   swiperOurBrands.init()
}

const handleModals = () => {
   let currModalElem = null
   const openerElems = document.querySelectorAll('.js-modal-opener')
   const showModal = (elem) => {
      if (elem) {
         currModalElem = elem
         elem.classList.add('visible')
         attachCloseEvents()
      }
   }

   const hideModal = (elem) => {
      if (elem) {
         detachCloseEvents()
         elem.classList.remove('visible')
         currModalElem = null
      }
   }

   const onClickCloseListener = e => {
      e.preventDefault()
      hideModal(currModalElem)
   }

   const onClickInnerListener = e => {
      e.stopPropagation()
   }

   const attachCloseEvents = () => {
      if (currModalElem) {
         const closeElem = currModalElem.querySelector('.modal-simple-close')
         const modalInnerElem = currModalElem.querySelector('.modal-simple-inner')

         currModalElem.addEventListener('click', onClickCloseListener)
         closeElem.addEventListener('click', onClickCloseListener)
         modalInnerElem.addEventListener('click', onClickInnerListener)
         console.log('attaching events...');
      }
   }

   const detachCloseEvents = () => {
      if (currModalElem) {
         const closeElem = currModalElem.querySelector('.modal-simple-close')
         const modalInnerElem = currModalElem.querySelector('.modal-simple-inner')

         currModalElem.removeEventListener('click', onClickCloseListener)
         closeElem.removeEventListener('click', onClickCloseListener)
         modalInnerElem.removeEventListener('click', onClickInnerListener)
         console.log('detaching events...');
      }
   }

   const init = () => {
      // Attach click to modal openers
      if (openerElems.length > 0) {
         for (let o = 0; o < openerElems.length > 0; o++) {
            openerElems[o].addEventListener('click', e => {
               e.preventDefault()
               const targetElem = document.getElementById(openerElems[o].dataset.targetId)
               showModal(targetElem)
            })
         }
      }
   }

   init()
}

const handleNavbarInteractions = () => {
   const navbarOpenerEl = document.getElementById('js-main-navbar-opener')
   const navbarCloseEl = document.getElementById('js-main-navbar-close')
   const navbarContentOpenClass = 'main-navbar-content-open'
   let navbarOpenerTargetEl = null

   // Handle opener button
   if (navbarOpenerEl) {
      navbarOpenerTargetEl = document.querySelector(navbarOpenerEl.dataset.target)
      navbarOpenerEl.addEventListener('click', e => {
         e.preventDefault()
         if (navbarOpenerTargetEl) {
            navbarOpenerTargetEl.classList.toggle(navbarContentOpenClass)
         }
         if (navbarOpenerTargetEl.classList.contains(navbarContentOpenClass)) {
            document.documentElement.classList.add('no-overflow')
            document.body.classList.add('no-overflow')
         }
      })
   }

   // Handle close button
   if (navbarCloseEl) {
      navbarCloseEl.addEventListener('click', e => {
         e.preventDefault()
         if (navbarOpenerTargetEl) {
            navbarOpenerTargetEl.classList.remove(navbarContentOpenClass)
            document.documentElement.classList.remove('no-overflow')
            document.body.classList.remove('no-overflow')
         }
      })
   }
}

// Lazy load images to improve page load performace
const lazyImages = () => {
   const imageElems = document.querySelectorAll('.b-lazy')
   const getURLWithFmt = (url) => {
      if (url.indexOf('?') !== -1) {
         return hasWebpSupport() ? `${url}&fmt=webp` : ''
      }
      return hasWebpSupport() ? '?fmt=webp' : ''
   }
   if (imageElems.length > 0) {
      for (let i = 0; i < imageElems.length; i++) {
         if (!imageElems[i].classList.contains('b-loaded')) {
            if (imageElems[i].dataset.srcset) {
               imageElems[i].setAttribute('srcset', `${getURLWithFmt(imageElems[i].dataset.srcset)}`)
               delete imageElems[i].dataset.srcset
            }
            if (imageElems[i].dataset.src) {
               imageElems[i].src = getURLWithFmt(imageElems[i].dataset.src)
               delete imageElems[i].dataset.src
            }
            imageElems[i].classList.add('b-loaded')
         }
      }
      if (typeof picturefill === "function") {
         picturefill()
      }
   }
}

// Extract price from string (product name)
const extractPriceListFromString = (str) => {
   if (typeof str !== "undefined") {
      // Extract "regular/antes/normal" prices from substring text
      const regExp = /\( *(Antes|Regular|Normal) *S\/ *\d+\.*,*\d* *\)/i;
      const matches = regExp.exec(str);

      if (matches && matches.length > 1) {
         const strFound = $.trim(matches[0].replace(/\(/, '').replace(/\)/, ''));
         const priceArr = strFound.split(/S\//);
         return {
            label: $.trim(priceArr[0]),
            value: $.trim(priceArr[1])
         };
      }
      return null;
   }
}

const handleProductPanelMount = (st, productPanel) => {
   if (!st.swiperTabsContainerActive.classList.contains('js-data-loaded')) {
      productPanel.setSheetIndex(st.activeIndex + 1)
      productPanel.setMountContainer(st.swiperTabsContainerActive)
      productPanel.getData().then(data => {
         productPanel.renderHTML(data, {
            id: st.swiperTabsContainerActive.dataset.catId,
            name: st.swiperTabsContainerActive.dataset.catName,
            iconClass: st.swiperTabsContainerActive.dataset.catIconClass
         })
         st.swiperTabsContainerActive.classList.add('js-data-loaded')
         
      }).catch(err => {
         console.error(err);
      })
   }
}


// Append additional item box in productlist with cta to category page
const appendSeeAllCategoryItemToCategoryList = () => {
   try {
      const seeAllCategoryLinkEl = document.querySelector('a.fbra_categoryHeaderSeeCategory_button')
      const categoryHeaderNameEl = document.querySelector('.fbra_categoryHeader_name')
      const categoryHeaderName = categoryHeaderNameEl ? categoryHeaderNameEl.textContent : ''

      if (productListWrapperEl) {
         const seeAllCategoryItemEl = productListWrapperEl.querySelector('.fbra_seeAllCategoryItemWrap')

         if (!seeAllCategoryItemEl) {
            //seeAllCategoryItemEl.parentNode.removeChild(seeAllCategoryItemEl)
            const seeAllCategoryItem = document.createElement('div')
            seeAllCategoryItem.classList.add('fbra_productItem', 'fbra_seeAllCategoryItemWrap', 'col-sm-4', 'col-md-3', 'pdd3', 'mt10')
            seeAllCategoryItem.innerHTML = `
               <div class="fbra_productListItem destaHome fbra_seeAllCategoryItem">
                  <a href="${seeAllCategoryLinkEl.href}" class="fullh d-flex d-flex-col-middle no-decoration fbra_anchor fbra_productListItem_Link text-center white-space-normal">
                     <span class="block c-icon"></span>
                     <span class="block">Descubre aquí más productos de</span>
                     <h4 class="fbra_seeAllCategoryItem_name">${categoryHeaderName}</h4>
                     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAMAAADyQNAxAAAAhFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9hWbqAAAAAK3RSTlMAAQMGChAVHE5RVVZYWVpdYXF4h4uMlqGksbW3vcjO0tjh5Ojp6u7x8vz+DivhBQAAAIlJREFUGBntwUcSgkAURdEHqBhRMWHAiKnv/vdnj5HqP7DKEeeo9SeTxzGV6Q6nriwVUHZkmDlgG8uQ420iGdZ4CxniAm8uQ3IA3Fh1g4ov775qbjS4qOZOg6tqRk++uKGCkh3gMgVFBV6usCXeSmE5XhEpKHPAPlFYBZQdGW5w7skyfZWpWj/4AAsTGe9r4PMmAAAAAElFTkSuQmCC" />
                  </a>
               </div>
            `
            productListWrapperEl.appendChild(seeAllCategoryItem)
         } else {
            seeAllCategoryItemEl.querySelector('a').href = seeAllCategoryLinkEl.href
            seeAllCategoryItemEl.querySelector('.fbra_seeAllCategoryItem_name').textContent = categoryHeaderName
         }

         const mobileSeeAllCategoryBtn = document.querySelector('.mobile-see-all-category-btn')

         // Mobile "see category" button
         if (window.innerWidth <= 1000) {
            if (!mobileSeeAllCategoryBtn) {
               const _mobileSeeAllCategoryBtn = document.createElement('div')
               _mobileSeeAllCategoryBtn.classList.add('mobile-see-all-category-btn', 'text-center')
               _mobileSeeAllCategoryBtn.innerHTML = `
                  <a href="${seeAllCategoryLinkEl.href}" title="${categoryHeaderName}">
                     <span class="block">Encuentra más de </span>
                     <span class="bold text-uppercase">${categoryHeaderName} </span>
                     <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </a>
               `
               productListWrapperEl.parentNode.parentNode.insertBefore(_mobileSeeAllCategoryBtn, productListWrapperEl.parentNode.parentNode.children[2])
            } else {
               mobileSeeAllCategoryBtn.querySelector('a').href = seeAllCategoryLinkEl.href
               mobileSeeAllCategoryBtn.querySelector('span:nth-child(2)').textContent = categoryHeaderName
            }
         }
      }

   } catch (e) {
      console.error('Error trying to append "see category" item to category list', e);
   }
}


// Render product missing prices such as savings, price normal, ...
const renderMissingPrices = () => {
   try {
      const fbraProductItemElems = document.querySelectorAll('.fbra_productItem .fbra_productListItem')

      if (fbraProductItemElems.length > 0) {
         for (let i = 0; i < fbraProductItemElems.length; i++) {
            const fbraProductItemEl = fbraProductItemElems[i]
            const fbraProductMainPriceElem = fbraProductItemEl.querySelector('.fbra_productMainPrice')
            const fbraProductSecondaryPriceElem = fbraProductItemEl.querySelector('.fbra_productSecondaryPrice')
            const fbraProductPriceSection = fbraProductItemEl.querySelector('.fbra_productPrice')
            const curSavingsElem = fbraProductItemEl.querySelector('[data-name="savings"]')
            const curPriceSecondaryFromNameEl = fbraProductItemEl.querySelector('[data-name="price-normal"]')
            const curDiscountTagEl = fbraProductItemEl.querySelector('.js-item-tag-discount')

            if (shouldResetMissingPrices) {
               if (curSavingsElem) curSavingsElem.parentNode.removeChild(curSavingsElem)
               if (curPriceSecondaryFromNameEl) curPriceSecondaryFromNameEl.parentNode.removeChild(curPriceSecondaryFromNameEl)
               if (curDiscountTagEl) curDiscountTagEl.parentNode.removeChild(curDiscountTagEl)
            }

            const fbraProductPrices = []

            // Get price main
            if (fbraProductMainPriceElem) {
               if (typeof fbraProductMainPriceElem.children[1] !== "undefined" && typeof fbraProductMainPriceElem.children[3] !== "undefined") {
                  fbraProductPrices.push({
                     value: parseFloat(fbraProductMainPriceElem.children[1].textContent.trim()),
                     format: fbraProductMainPriceElem.children[3].textContent.trim()
                  })
               }
            }

            // Get price secondary
            if (fbraProductSecondaryPriceElem) {
               if (typeof fbraProductSecondaryPriceElem.children[3] !== "undefined") {
                  fbraProductPrices.push({
                     value: parseFloat(fbraProductSecondaryPriceElem.children[3].textContent.trim()),
                  })
               }
            } else {
               // Extracting price list from name
               const fbraProductNameEl = fbraProductItemEl.querySelector('.fbra_productName')
               if (fbraProductNameEl) {
                  const priceSecondaryFromName = extractPriceListFromString(fbraProductNameEl.textContent)
                  if (priceSecondaryFromName) {
                     fbraProductPrices.push({
                        value: parseFloat(priceSecondaryFromName.value),
                     })
                  }
               }
            }

            if (fbraProductPrices.length > 0) {
               if (typeof fbraProductPrices[0] !== "undefined" && typeof fbraProductPrices[1] !== "undefined") {
                  const amountSavings = (fbraProductPrices[1].value - fbraProductPrices[0].value).toFixed(2)
                  const discountPercentage = Math.floor((amountSavings / fbraProductPrices[1].value) * 100)

                  if (!curDiscountTagEl) {
                     if (discountPercentage > 0) {
                        const discountTagEl = document.createElement('span')
                        discountTagEl.classList.add('js-item-tag-discount', 'prodItem_tagDiscount', 'hidden')
                        discountTagEl.innerHTML = `<span>-${discountPercentage}%</span>`
                        fbraProductItemEl.appendChild(discountTagEl)
                     }
                  } else {
                     if (discountPercentage > 0) {
                        const curDiscountTagInnerEl = curDiscountTagEl.querySelector('span')
                        if (curDiscountTagInnerEl) {
                           curDiscountTagInnerEl.innerHTML = `-${discountPercentage}%`
                        }
                     } else {
                        curDiscountTagEl.classList.add('hidden')
                     }
                  }

                  if (!curSavingsElem) {
                     const savingsElem = document.createElement('p')
                     savingsElem.classList.add('fbra_productSecondaryPrice')
                     savingsElem.setAttribute('data-name', 'savings')

                     // Verify both prices has set
                     savingsElem.innerHTML = `
                        <span>Ahorro </span>
                        <span>S/${amountSavings}</span>
                     `

                     if (fbraProductPriceSection) {
                        fbraProductPriceSection.appendChild(savingsElem)
                     }
                     if (!fbraProductSecondaryPriceElem) {
                        const priceSecondaryFromNameEl = document.createElement('p')
                        priceSecondaryFromNameEl.classList.add('fbra_productSecondaryPrice')
                        priceSecondaryFromNameEl.setAttribute('data-name', 'price-normal')
                        priceSecondaryFromNameEl.innerHTML = `
                           <span>Antes </span>
                           <span>S/${fbraProductPrices[1].value.toFixed(2)}</span>
                        `
                        fbraProductPriceSection.appendChild(priceSecondaryFromNameEl)
                     }

                     // Render discount tag

                  } else {
                     //curSavingsElem.querySelectorAll('span')[0].textContent = 'Ahorro'
                     curSavingsElem.querySelectorAll('span')[1].textContent = `S/ ${amountSavings}`
                     if (curPriceSecondaryFromNameEl) {
                        curPriceSecondaryFromNameEl.querySelectorAll('span')[1].textContent = fbraProductPrices[1].value.toFixed(2)
                     }
                  }
               }
            }

            fbraProductItemEl.classList.add('jsHasMissingPrices')
         }
      }
   } catch (e) {
      console.error(e, 'Error trying to render missing prices');
   }
}

// Init intersection observers
const handleScrollToTop = (target) => {
   if (typeof target !== "undefined") {
      const buildThresholdList = () => {
         var thresholds = [];
         var numSteps = 20;

         for (var i = 1.0; i <= numSteps; i++) {
            var ratio = i / numSteps;
            thresholds.push(ratio);
         }

         thresholds.push(0);
         return thresholds;
      }

      const options = {
         root: null,
         //rootMargin: '3446px',
         rootMargin: `${document.body.scrollHeight - sectionNewsEl.offsetTop}px`,
         thresholds: buildThresholdList()
      }

      const observer = new IntersectionObserver((entries, observer) => {
         entries.forEach(entry => {
            if (scrollToTopEl) {
               if (entry.isIntersecting) {
                  scrollToTopEl.classList.add('is-visible')
               } else {
                  scrollToTopEl.classList.remove('is-visible')
               }
            }
         })
      }, options)
      observer.observe(target)

      if (scrollToTopEl) {
         scrollToTopEl.addEventListener('click', e => {
            if (typeof document.body.scrollIntoView === "function") {
               document.body.scrollIntoView()
            } else {
               window.scrollTo(0, 0)
            }
         })
      }
   }
}

// Init mutation observers
const initMutationObservers = (targets) => {
   if (typeof targets !== "undefined" && targets.length > 0) {
      for (let i = 0; i < targets.length; i++) {
         const observer = new MutationObserver((mutations) => {
            mutations.map(mutation => {
               if (!mutation.target.classList.contains('fbra_loadingWrapper--isLoading') && mutation.type === "childList") {
                  improveProdImagesSrcs()
                  renderMissingPrices()
                  appendSeeAllCategoryItemToCategoryList()
               }
            })
         })

         if (targets[i]) {
            observer.observe(targets[i], {
               attributes: true,
               childList: true,
               characterData: true
            })
         }

      }
   }
}


//Fix category icons issue
const setTabNavIcons = () => {
   const catListTabElems = document.querySelectorAll('.fbra_categoryListTab')
   if (catListTabElems.length > 0) {
      for (let i = 0; i < catListTabElems.length; i++) {
         const catListTabIconEl = catListTabElems[i].querySelector('.icono-cyber')
         const catListTabTextEl = catListTabElems[i].querySelector('.fbra_categoryListTab__text')

         if (catListTabIconEl && catListTabTextEl) {
            const iconClassName = slugify(catListTabTextEl.textContent.trim())
            catListTabIconEl.classList.add('c-icon-cat', `c-icon-cat-${iconClassName}`)
            catListTabElems[i].setAttribute('title', catListTabTextEl.textContent.trim())
         }
      }
   }

}

const createScrollToTopRefEl = () => {
   scrollToTopRefElem = document.createElement('div')
   scrollToTopRefElem.classList.add('scrolltotop-intersect-ref')
   document.body.appendChild(scrollToTopRefElem)
}

   ; (function (d, w, domIsReady) {
      domIsReady(function () {

         productListWrapperEl = d.querySelector('.fbra_productList .fbra_loadingWrapper')
         sectionNewsEl = d.querySelector('.section-news')
         scrollToTopEl = d.querySelector('.button-back-to-top')

         // Handle menu navbar interactions
         handleNavbarInteractions()

         // Init Slider intro
         new SliderIntro('#swiper-slider-intro', {
            imageSelector: '.js-swiper-slide-image',
            selectorBtnNext: '.swiper-slider-intro-btn-next',
            selectorBtnPrev: '.swiper-slider-intro-btn-prev',
            selectorPagination: '.swiper-slider-intro-pagination'
         })

         // DailyDeals Homecenter
         new DailyDeals('#daily-deals-homecenter', {
            renderToExternalCountdown: true,
            //dataSheetURL: '/static/campanas/cybersodimac/eventos-2019/dailyDealsHomecenter.json?1234567890',
            dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/1/public/full?alt=json',
         })

         
         // DailyDeals Constructor
         new DailyDeals('#daily-deals-constructor', {
            renderCountdown: false,
            //dataSheetURL: '/static/campanas/cybersodimac/eventos-2019/dailyDealsConstructor.json?1234567890',
            dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/2/public/full?alt=json',
         })

         // Init mutation observers
         initMutationObservers([productListWrapperEl])

         createScrollToTopRefEl()

         // Handle button 'scrolltotop'
         handleScrollToTop(scrollToTopRefElem)

         // section promotions
         sectionPromotions()

         // section news
         //sectionOurBrands()

         // Improve productlist image resolution
         //improveProdImagesSrcs()

         // Add missing prices to product item
         //renderMissingPrices()

         // Append 'see all category' banner to category list
         //appendSeeAllCategoryItemToCategoryList()

         // Set product list tab navigation icons
         //setTabNavIcons()

         //handleClickProductListTab()

         // Init productlist navigation improvements
         /*
         setTimeout(() => {
            new ProductListNavigation('#fbra_categoryList', {
               tabsSelector: '.fbra_categoryListTab'
            })
         }, 1500)
         */
         // Init lazy images
         lazyImages()

         let productPanel = new ProductPanel()
         const swiperTabs = new SwiperTabs('.swiper-tabs-1', {
            activeIndex: 0,
            onTransitionChangeEnd: (st) => {
               handleProductPanelMount(st, productPanel)
            },
            onInit: (st) => {
               handleProductPanelMount(st, productPanel)
            }
         })
      })
   })(document, window, domIsReady);
