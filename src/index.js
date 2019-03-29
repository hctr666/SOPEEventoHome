
import 'normalize.css/normalize.css'
import './styles/index.scss'
import {
   domIsReady,
   attachEvent,
   detachEvent,
   isTouchMode
} from './js/utils'
import ProductListNavigation from './js/productlist-navigation'
import './js/menu.js'

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

;(function(document, window, domIsReady, undefined) {
   domIsReady(function() {
      improveProdImagesSrcs()
      handleClickProductListTab()
      const prodListNavigation = new ProductListNavigation('#fbra_categoryList', {
         tabsSelector: '.fbra_categoryListTab'
      })
   })
})(document, window, domIsReady);
