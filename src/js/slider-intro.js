import Swiper from 'swiper'
import { throttle } from './utils'

export default class SliderIntro {
   constructor(selector, options) {
      this.selector = selector
      this.defaults = {
         breakpoints: {
            small: 480,
            medium: 800,
         }
      }
      this.options = Object.assign(this.defaults, options)
      this.imageElements = []
      this.checkDeviceWidth()
      this.setElements()
      this.setBgImages()
      this.onWindowResize(() => {
         this.setBgImages()
      })
      this.initSwiper()
   }

   setBgImages() {
      if (this.imageElements.length > 0) {
         for (let i = 0; i < this.imageElements.length; i++) {
            let imageElem = this.imageElements[i]
            if (this.isDeviceSmall) {
               imageElem.node.style.backgroundImage = `url(${imageElem.imgSmall})`
            }
            if (this.isDeviceMedium) {
               imageElem.node.style.backgroundImage = `url(${imageElem.imgMedium})`
            }
            if (this.isDeviceLarge) {
               imageElem.node.style.backgroundImage = `url(${imageElem.imgLarge})`
            }
         }
      }
   }

   onWindowResize(resized) {
      window.addEventListener('resize', throttle(() => {
         if (resized) resized()
      }, 90))
   }

   checkDeviceWidth() {
      if (window.matchMedia) {
         const mqIsSmall  = window.matchMedia(`(max-width: ${this.options.breakpoints.small}px)`)
         const mqIsMedium = window.matchMedia(`(min-width: ${this.options.breakpoints.small + 1}px) and (max-width: ${this.options.breakpoints.medium}px)`)
         const mqIsLarge  = window.matchMedia(`(min-width: ${this.options.breakpoints.medium + 1}px)`)
         
         this.isDeviceSmall  = mqIsSmall.matches
         this.isDeviceMedium = mqIsMedium.matches
         this.isDeviceLarge  = mqIsLarge.matches

         mqIsSmall.addListener(mq => {
            this.isDeviceSmall = mq.matches
         })
         mqIsMedium.addListener(mq => {
            this.isDeviceMedium = mq.matches
         })
         mqIsLarge.addListener(mq  => {
            this.isDeviceLarge  = mq.matches
         })
      }
   }

   setElements() {
      this.$container = document.querySelector(this.selector)
      if (this.$container) {
         const originalImageElems = this.$container.querySelectorAll(this.options.imageSelector)
         if (originalImageElems.length > 0) {
            for (let i = 0; i < originalImageElems.length; i++) {
               this.imageElements.push({
                  index: i,
                  node: originalImageElems[i],
                  imgLarge: originalImageElems[i].dataset.imgLarge,
                  imgMedium: originalImageElems[i].dataset.imgMedium,
                  imgSmall: originalImageElems[i].dataset.imgSmall
               })
               delete originalImageElems[i].dataset.imgLarge
               delete originalImageElems[i].dataset.imgSmall
               delete originalImageElems[i].dataset.imgMedium
            }
         }
      }
   }

   initSwiper() {
      this.swiper = new Swiper(this.selector, {
         slidesPerView: 1,
         pagination: {
            el: this.options.selectorPagination,
            clickable: true,
            renderBullet: function (index, className) {
               return `
                  <div class="${className}">
                     <span>
                        <span class="slider-intro-nav-description block fullw bold text-uppercase text-left">Box Tarima Nappy</span>
                        <span class="slider-intro-nav-price block fullw text-left">S/ 1200</span>
                     </span>
                  </div>
               `;
            },
         },
         navigation: {
            nextEl: this.options.selectorBtnNext,
            prevEl: this.options.selectorBtnPrev
         }
      })
   }
}