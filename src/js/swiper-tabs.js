import { Swiper, Pagination, Navigation } from '../../node_modules/swiper/dist/js/swiper.esm'

Swiper.use([ Pagination, Navigation ])

class SwiperTabs {
   constructor(selector, options) {
      this.selector = selector
      this.defaults = {
         activeIndex: 0,
         selectorTabsNav: '.swiper-tabs-nav',
         selectorTabsContainer: '.swiper-tabs-container'
      }
      this.options = Object.assign(this.defaults, options)
      this.initTabsContainer()
      this.initTabsNav()
   }

   initTabsContainer() {
      this.swiperTabsContainer = new Swiper(`${this.selector} ${this.options.selectorTabsContainer}`, {
         slidesPerView: 1,
      })

      this.swiperTabsContainer.on('slideChangeTransitionEnd', () => {
         this.handleTransitionChangeEnd()
         this.swiperTabsNav.slideTo(this.activeIndex)
      })
   }

   initTabsNav() {
      this.swiperTabsNav = new Swiper(`${this.selector} ${this.options.selectorTabsNav}`, {
         slidesPerView: 'auto',
         freeMode: true,
         freeModeMomentumRatio: .3,
         init: false
      })

      this.swiperTabsNav.on('init', () => {

         this.swiperTabsNavActive = this.swiperTabsNav.slides[this.options.activeIndex]

         this.setTabNavActive(this.swiperTabsNavActive)

         this.swiperTabsNavItems = this.swiperTabsNav.slides         

         for (let i = 0; i <= this.swiperTabsNavItems.length; i++) {
            if (this.swiperTabsNavItems[i]) {
               this.swiperTabsNavItems[i].setAttribute('data-index', i)
               this.swiperTabsNavItems[i].addEventListener('click', e => {
                  this.handleTabsClick(e, this.swiperTabsNavItems[i])
               })
            }
         }
      })

      this.swiperTabsNav.init()
   }

   handleTabsClick(e, tabNav) {
      e.preventDefault()
      const tabNavIndex = tabNav.dataset.index
      // Change container slide based on current tab active index
      this.swiperTabsContainer.slideTo(tabNavIndex)
      // Set new tab active
      this.setTabNavActive(tabNav) 
   }

   handleTransitionChangeEnd() {
      this.activeIndex = this.swiperTabsContainer.activeIndex

      for (let i = 0; i <= this.swiperTabsNavItems.length; i++) {
         if (this.swiperTabsNavItems[i] && parseInt(this.swiperTabsNavItems[i].dataset.index) === this.activeIndex) {
            this.setTabNavActive(this.swiperTabsNavItems[i])
         }
      }
      
      if (typeof this.options.onTransitionChangeEnd === "function") {
         this.options.onTransitionChangeEnd(this)
      }
   }

   setTabNavActive(newTabNav) {
      if (typeof newTabNav !== "undefined") {
         this.swiperTabsNavActive.classList.remove('swiper-slide-tab-active')
         newTabNav.classList.add('swiper-slide-tab-active')
         this.swiperTabsNavActive = newTabNav
      }
   }
}

export default SwiperTabs