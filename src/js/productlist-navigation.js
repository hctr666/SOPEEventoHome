
/**
 * This class add navigation improvements
 * to productlist tabs navigation
 */
import { throttle } from './utils'

// Store jQuery global var
if (typeof $ !== "undefined") {
   var jq = $
}

export default class ProductListNavigation {
   constructor(selector, options) {
      this.selector = selector
      this.defaults = {}
      this.tabActiveIndex = 0
      this.sectionContainerEl = document.getElementById('fbra_homePageCategoryList')
      this.windowY = window.pageYOffset
      this.mainNavFixedHeight = window.innerWidth <= 1000 ? 41 : 57
      this.breakpointBase = 1000
      this.setOptions(options)
      this.setElements()
      this.init()
   }

   setOptions(options) {
      this.options = Object.assign(this.defaults, options)
   }

   setElements() {
      this.$container = document.querySelector(this.selector)
      this.$tabs = this.$container.querySelectorAll(this.options.tabsSelector)
      this.$tabActive = this.$tabs[this.tabActiveIndex]
      this.totalTabs = this.$tabs.length
      this.tabsWrapperEl = document.getElementById('fbra_categoryList')
      
      if (this.tabsWrapperEl) {
         this.tabsWrapperTop = this.tabsWrapperEl.offsetTop
      }
   }

   init() {
      this.tabWidth = this.$tabs[0].offsetWidth
      this.lastTabInScreenIndex = Math.floor(window.innerWidth / this.tabWidth) - 1
      this.containerScrollLeft = this.$container.scrollLeft
      this.attachEvents()
   }

   checkForTransition() {
      if (this.$tabActive) {
         if (this.tabActiveIndex > 0 && this.tabActiveIndex < this.totalTabs) {
            jq(this.$container).animate({
               scrollLeft: this.$tabActive.offsetLeft - this.tabWidth
            }, 200)
         }
      }
   }

   resetProductListScreenPosition() {
      if (this.sectionContainerEl && this.$tabActive) {
         window.scrollTo(0, this.sectionContainerEl.offsetTop + this.$tabActive.offsetHeight + this.mainNavFixedHeight)
      }
   }

   attachEvents() {
      if (this.$tabs.length > 0) {
         for (let i = 0; i < this.$tabs.length; i++) {
            this.$tabs[i].addEventListener('click', e => {
               e.preventDefault()
               this.$tabActive = this.$tabs[i]
               this.tabActiveIndex = i
               this.checkForTransition()
               this.resetProductListScreenPosition()
            })
         }
      }
      
      if (this.$container) {
         this.$container.addEventListener('scroll', throttle(() => {
            this.containerScrollLeft = this.$container.scrollLeft
         }, 90))
      }

      // Improve navtablist fixed position on scroll
      document.addEventListener('scroll', e => {
         this.windowY = window.pageYOffset
         let limitYOffset = window.innerWidth <= this.breakpointBase 
            ? this.tabsWrapperTop 
            : this.tabsWrapperTop - this.mainNavFixedHeight
         
         if (this.windowY >= limitYOffset) {
            this.tabsWrapperEl.classList.add('fixedCategoryHeader')
         } else {
            this.tabsWrapperEl.classList.remove('fixedCategoryHeader')
         }
      })
   }
}