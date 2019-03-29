import { throttle } from './utils'

if (typeof $ !== "undefined") {
   var jq = $
}

export default class ProductListNavigation {
   constructor(selector, options) {
      this.selector = selector
      this.defaults = {}
      this.tabActiveIndex = 0
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

   attachEvents() {
      if (this.$tabs.length > 0) {
         for (let i = 0; i < this.$tabs.length; i++) {
            this.$tabs[i].addEventListener('click', e => {
               e.preventDefault()
               this.$tabActive = this.$tabs[i]
               console.log(this.$tabActive.offsetLeft);
               
               this.tabActiveIndex = i
               this.checkForTransition()
            })
         }
      }
      
      if (this.$container) {
         this.$container.addEventListener('scroll', throttle(() => {
            this.containerScrollLeft = this.$container.scrollLeft
         }, 90))
      }
   }

}