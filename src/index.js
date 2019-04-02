
import 'normalize.css/normalize.css'
import './styles/index.scss'
import {
   domIsReady,
   isTouchMode
} from './js/utils'
import ProductListNavigation from './js/productlist-navigation'
import SliderIntro from './js/slider-intro'
import DailyDeals from './js/daily-deals'

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
            setTimeout(() => {
               improveProdImagesSrcs()
            }, 1500)
         })
      })      
   }
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

;(function(document, window, domIsReady) {
   domIsReady(function() {
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
         dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/1/public/full?alt=json'
      })

      // DailyDeals Constructor
      new DailyDeals('#daily-deals-constructor', {
         renderCountdown: false,
         dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/2/public/full?alt=json'
      })

      // Improve productlist image resolution
      improveProdImagesSrcs()

      handleClickProductListTab()

      // Init productlist navigation improvements
      new ProductListNavigation('#fbra_categoryList', {
         tabsSelector: '.fbra_categoryListTab'
      })
   })
})(document, window, domIsReady);
