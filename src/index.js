
import 'normalize.css/normalize.css'
import './styles/index.scss'
import {
   domIsReady,
   isTouchMode
} from './js/utils'
import ProductListNavigation from './js/productlist-navigation'
import SliderIntro from './js/slider-intro'
import DailyDeals from './js/daily-deals'
import Swiper from 'swiper'
import MutationObserver from 'mutation-observer'

let productListWrapperEl = null

// Add touch mode class
const addTouchModeClass = () => {
   if (isTouchMode()) {
      document.documentElement.classList.add('touch-mode')
   }
}
addTouchModeClass()

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


const handleClickProductListTab = () => {
   const $prodListTabs = $('.fbra_categoryListTab')
   if ($prodListTabs.length > 0) {
      $prodListTabs.each((i, $tab) => {
         $tab.addEventListener('click', e => {
            e.preventDefault()
            const verifyContentIsLoading = () => {
               productListWrapperEl = document.querySelector('.fbra_productList .fbra_loadingWrapper')
               if (productListWrapperEl.classList.contains('fbra_loadingWrapper--isLoading')) {
                  console.log('wrapper is loading.');
                  setTimeout(() => {
                     verifyContentIsLoading()
                  }, 500)
               } else {
                  console.log('wrapper has loaded');
                  improveProdImagesSrcs()
                  renderMissingPrices()
                  appendSeeAllCategoryItemToCategoryList()
               }
            }
            //verifyContentIsLoading()
         })
      })      
   }
}

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
            imageElems[i].src = imageElems[i].dataset.src
            imageElems[i].classList.remove('swiper-lazy')
         }
      }
   })
   swiperPromotions.init()
}

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
            imageElems[i].src = imageElems[i].dataset.src
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

const tabProductlist = () => {
   return new SwiperTabs('.swiper-tabs-1', {
      activeIndex: 0,
      onTransitionChangeEnd: (st) => {
         console.log(st);
         
      }
   })
}

const lazyImages = () => {
   const imageElems = document.querySelectorAll('.b-lazy')
   if (imageElems.length > 0) {
      for (let i = 0; i < imageElems.length; i++) {
         if (! imageElems[i].classList.contains('b-loaded')) {
            imageElems[i].src = imageElems[i].dataset.src
            imageElems[i].classList.add('b-loaded')
         }
      }
   }
}

const extractPriceListFromString = (str) => {
   if (typeof str !== "undefined") {
      // Extract "regular/antes/normal" prices from substring text
      const regExp  = /\( *(Antes|Regular|Normal) *S\/ *\d+\.*,*\d* *\)/i;
      const matches = regExp.exec(str);

      if(matches && matches.length > 1) {
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

const appendSeeAllCategoryItemToCategoryList = () => {
   try {
      const seeAllCategoryLinkEl = document.querySelector('a.fbra_categoryHeaderSeeCategory_button')
      const categoryHeaderNameEl = document.querySelector('.fbra_categoryHeader_name')

      if (productListWrapperEl) {
         const seeAllCategoryItemEl = productListWrapperEl.querySelector('.fbra_seeAllCategoryItemWrap')
         if (!seeAllCategoryItemEl) {
            //seeAllCategoryItemEl.parentNode.removeChild(seeAllCategoryItemEl)
            const seeAllCategoryItem = document.createElement('div')
            seeAllCategoryItem.classList.add('fbra_productItem', 'fbra_seeAllCategoryItemWrap','col-sm-4','col-md-3','pdd3', 'mt10')
            seeAllCategoryItem.innerHTML = `
               <div class="fbra_productListItem destaHome fbra_seeAllCategoryItem">
                  <a href="${seeAllCategoryLinkEl.href}" class="fullh d-flex d-flex-col-middle no-decoration fbra_anchor fbra_productListItem_Link text-center white-space-normal">
                     <span class="block">Ver todo</span>
                     <h4 class="fbra_seeAllCategoryItem_name">${categoryHeaderNameEl.textContent}</h4>
                     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAABNElEQVRYCe2WoU4DQRCG59oEUVVDMCS8UZM6SoLAY+ruDRCg60l4AQRB4asQKDSqICpON/3IAMldNnt3A9xlmnRX3d7OzXz359/ZFUkjKZAUSAokBXwVAGbAGngGjn1pfqoDH5TjBRi7gwHvJdPX0xIYuYIBF8A2ALsHht5geQCl01sg8wZbRMCuvKGGwF0EbO4NdgA8BWDqt9N/gwHTyK4Kav1qugEmTWCt5gNWInLUlOQPa29Zlp3UfTeoW6i8t8RUwk2PjS3CUvBSRApTKVsQIuJjeECN/hC4TY1+ZmPvOEobZU1LyDsuZU8HXAcK6fTGnqHjSCB2zGgjbd3pHaN8p1O/RA7kR/VXLwUtSSNNdieuLquKl16BQ8vP9BoDnAMFoArtxnW41z9OyZMCSYF9VeATPJ/LM+hBPtAAAAAASUVORK5CYII=" />
                  </a>
               </div>
            `
            productListWrapperEl.appendChild(seeAllCategoryItem)
         } else {
            seeAllCategoryItemEl.querySelector('a').href = seeAllCategoryLinkEl.href
            seeAllCategoryItemEl.querySelector('.fbra_seeAllCategoryItem_name').textContent = categoryHeaderNameEl.textContent
         }
      }
      
   } catch(e) {
      console.error('Error trying to append "see category" item to category list', e);
   }
}

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

            // Check if amount savings and price secondary from name are already rendered
            if (fbraProductSecondaryPriceElem) {
               if (curSavingsElem) {
                  curSavingsElem.parentNode.removeChild(curSavingsElem)
               }
               if (curPriceSecondaryFromNameEl) {
                  curPriceSecondaryFromNameEl.parentNode.removeChild(curPriceSecondaryFromNameEl)
               }
            }
   
            //if (!hasSavingPriceSet) {
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
   
                     if (! curSavingsElem) {
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
                     } else {
                        //curSavingsElem.querySelectorAll('span')[0].textContent = 'Ahorro'
                        curSavingsElem.querySelectorAll('span')[1].textContent = amountSavings
                        if (curPriceSecondaryFromNameEl) {
                           curPriceSecondaryFromNameEl.querySelectorAll('span')[1].textContent = fbraProductPrices[1].value.toFixed(2)
                        }
                     }
                  }
               }

               fbraProductItemEl.classList.add('jsHasMissingPrices')
            //}
         }
      }
   } catch(e){
      console.error(e, 'Error trying to render missing prices');
   }
}

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

         observer.observe(targets[i], {
            attributes: true,
            childList: true,
            characterData: true
         })
      }
   } 
}

;(function(document, window, domIsReady) {
   domIsReady(function() {

      productListWrapperEl = document.querySelector('.fbra_productList .fbra_loadingWrapper')

      initMutationObservers([ productListWrapperEl ])

      // Init Slider intro
      new SliderIntro('#swiper-slider-intro', {
         data: typeof dataShowcases !== "undefined" ? dataShowcases : {},
         imageSelector: '.js-swiper-slide-image',
         selectorBtnNext: '.swiper-slider-intro-btn-next',
         selectorBtnPrev: '.swiper-slider-intro-btn-prev',
         selectorPagination: '.swiper-slider-intro-pagination'
      })

      // DailyDeals Homecenter
      new DailyDeals('#daily-deals-homecenter', {
         renderToExternalCountdown: true,
         dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/1/public/full?alt=json',
      })

      // DailyDeals Constructor
      new DailyDeals('#daily-deals-constructor', {
         renderCountdown: false,
         dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/2/public/full?alt=json',
      })

      // section promotions
      sectionPromotions()

      // section news
      sectionOurBrands()

      // Improve productlist image resolution
      improveProdImagesSrcs()

      // Add missing prices to product item
      renderMissingPrices()

      // Append 'see all category' banner to category list
      appendSeeAllCategoryItemToCategoryList()

      //handleClickProductListTab()

      // Init productlist navigation improvements
      new ProductListNavigation('#fbra_categoryList', {
         tabsSelector: '.fbra_categoryListTab'
      })

      // Init lazy images
      lazyImages()
   })
})(document, window, domIsReady);
