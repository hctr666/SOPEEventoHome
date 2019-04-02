import Countdown from './countdown'

const URL_DATA_SHEET = ''

// Property names
const CODE = 'gsx$code'
const NAME = 'gsx$name'
const END_DATE = 'gsx$end-date'
const END_TIME = 'gsx$end-time'
const START_DATE = 'gsx$start-date'
const START_TIME = 'gsx$start-time'
const IS_CMR = 'gsx$is-cmr'
const IS_COMBO = 'gsx$is-combo'
const PRICE_PROMO = 'gsx$price-promo'
const PRICE_LIST = 'gsx$price-list'

export default class DailyDeals {
   constructor(selector, options) {
      this.selector = selector
      this.options = Object.assign({
         isDataFromSheet: true,
         selectorCountdown: '#daily-deals-countdown',
         renderToExternalCountdown: false,
         renderCountdown: true,
         dataSheetURL: 'https://spreadsheets.google.com/feeds/list/1YwE83WH-kHH0aYn0JGLwyAGL8ABrB6Umrv_WnwNsalk/1/public/full?alt=json'
      }, options, {})
      this.query = null
      this.isRequestingData = false
      this.setElements()
      this.getData()
   }

   setElements() {
      this.$container = document.querySelector(this.selector)
   }

   getData() {
      if (this.options.isDataFromSheet) {
         this.getDataFromSheet()
      }
   }

   getDataFromSheet() {
      if (typeof $ !== "undefined") {

         if (this.query && this.isRequestingData) {
            this.query = abort()
            this.query = null
         }

         this.query = $.ajax({
            url: this.options.dataSheetURL,
            beforeSend: () => {
               this.isRequestingData = true
               this.$container.classList.add('is-loading')
            }
         }).done((res, textStatus) => {
            if (textStatus === "success" && res.feed.entry && res.feed.entry.length > 0) {
               res.feed.entry.map((item, i) => {
                  const _startDate = this.createDate(item[START_DATE].$t, item[START_TIME].$t)
                  const _endDate = this.createDate(item[END_DATE].$t, item[END_TIME].$t)
                  const nowDate = new Date()
                  
                  // Verify date now is between dates
                  if (_startDate && _endDate) {
                     if (nowDate.getTime() >= _startDate.getTime() && nowDate.getTime() <= _endDate.getTime()) {
                        this.dealCode = item[CODE].$t
                        this.dealName = item[NAME].$t
                        this.dealPriceList  = item[PRICE_LIST].$t
                        this.dealPricePromo = item[PRICE_PROMO].$t
                        this.dealIsCMR   = item[IS_CMR].$t == 1
                        this.dealIsCombo = item[IS_COMBO].$t == 1
                        this.endDate = _endDate
                        this.initCountdown()
                        this.renderProductContent()
                     }
                  }
               })
            }
         })
         .always((res, textStatus) => {
            if (textStatus !== "abort") {
               this.isRequestingData = false
               this.$container.classList.remove('is-loading')
            }
         })
      }
   }

   initCountdown() {
      // Init countdown and render content
      new Countdown(this.endDate, {
         onLapsing: (c) => {
            this.renderCountdownContent(c.parsed.days, c.parsed.hours, c.parsed.minutes, c.parsed.seconds)
         },
         onEnd: () => {
            this.getData()
         }
      })
   }

   renderCountdownContent(days, hours, minutes, seconds) {
      const $countdown = document.querySelector(this.options.selectorCountdown)
      
      // Rendering values
      const daysElem    = this.options.renderToExternalCountdown ? $countdown.querySelector('.js-measure-days')    : this.$container.querySelector('.js-measure-days')   
      const hoursElem   = this.options.renderToExternalCountdown ? $countdown.querySelector('.js-measure-hours')   : this.$container.querySelector('.js-measure-hours')  
      const minutesElem = this.options.renderToExternalCountdown ? $countdown.querySelector('.js-measure-minutes') : this.$container.querySelector('.js-measure-minutes')
      const secondsElem = this.options.renderToExternalCountdown ? $countdown.querySelector('.js-measure-seconds') : this.$container.querySelector('.js-measure-seconds')

      if (daysElem) daysElem.innerHTML = days
      if (hoursElem) hoursElem.innerHTML = hours
      if (minutesElem) minutesElem.innerHTML = minutes
      if (secondsElem) secondsElem.innerHTML = seconds
   }

   renderProductContent() {
      this.nameElem = this.$container.querySelector('.ddeals-name')
      this.imageElem = this.$container.querySelector('.ddeals-image')
      this.pricePromoElem = this.$container.querySelector('.ddeals-price-promo')
      this.priceListElem = this.$container.querySelector('.ddeals-price-list')
      this.promoBadgeElem = this.$container.querySelector('.ddeals-promo-badge')
      this.linkElem = this.$container.querySelector('.ddeals-link')

      if (this.nameElem) this.nameElem.innerHTML = this.dealName
      if (this.pricePromoElem) this.pricePromoElem.innerHTML = this.dealPricePromo
      if (this.priceListElem) this.priceListElem.innerHTML = this.dealPriceList

      if (this.promoBadgeElem && this.dealIsCMR) {
         this.promoBadgeElem.classList.add('is-cmr')
      }

      if (this.promoBadgeElem && this.dealIsCombo) {
         this.promoBadgeElem.classList.add('is-combo')
      }

      if (this.imageElem) {
         this.imageElem.src = `https://sodimac.scene7.com/is/image/SodimacPeru/${this.dealCode}?$lista175$`
         this.imageElem.classList.remove('b-lazy')
      }

      if (this.linkElem) {
         this.linkElem.href = `/sodimac-pe/product/${this.dealCode}/`
      }
   }

   createDate(rawDate, rawTime) {
      if (typeof rawDate !== "undefined" && typeof rawTime !== "undefined") {
         rawTime = rawTime
                     .replace('p. m.', 'pm.')
                     .replace('a. m.', 'am.')
                     .replace('p.m.', 'pm.')
                     .replace('a.m.', 'am.')

         const date = new Date(`${rawDate} ${rawTime}`)
         
         if (isNaN(date)) {
            return null
         }
         
         return date
      }
   }
}