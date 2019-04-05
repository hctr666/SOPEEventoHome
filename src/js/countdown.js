export default class Countdown {

   constructor(endDate, options) {
      this.endDate = Object.prototype.toString.call(endDate) === '[object Date]' ? endDate : new Date(endDate).getTime()
      this.options = Object.assign({}, options)

      if (isNaN(this.endDate)) {
         return
      }

      this.interval = setInterval(this.calculate.bind(this), 1000)
      if (typeof this.options.onInit === "function") {
         this.options.onInit(this)
      }
   }

   calculate() {
      this.timeRemaining = parseInt((this.endDate - new Date().getTime()) / 1000)

      if (this.timeRemaining >= 0) {
         this.days = parseInt(this.timeRemaining / 86400)
         this.timeRemaining = (this.timeRemaining % 86400)


         this.hours = parseInt(this.timeRemaining / 3600)
         this.timeRemaining = (this.timeRemaining % 3600)

         this.minutes = parseInt(this.timeRemaining / 60)
         this.timeRemaining = (this.timeRemaining % 60)

         this.seconds = parseInt(this.timeRemaining)
         
         this.parsed = {
            days: ("0" + this.days).slice(-2),
            hours: ("0" + this.hours).slice(-2),
            minutes: ("0" + this.minutes).slice(-2),
            seconds: ("0" + this.seconds).slice(-2)
         }

         if (typeof this.options.onLapsing === "function") {
            this.options.onLapsing(this)
         }


      } else {
         if (typeof this.options.onEnd ==="function") {
            this.options.onEnd()
         }

         clearInterval(this.interval)
         return
      }
   }
}