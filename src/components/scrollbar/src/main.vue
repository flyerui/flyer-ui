<template>
    <div class='fly-scrollbar'>
        <div class='fly-scrollbar__content' ref='content'
        @mouseover="handleOver"
        @mousewheel="handleWheel">
          <slot name='default'></slot>
        </div>
        <div class='fly-scrollbar__rail'
        @mousedown="handleSliderDown"
        ref='rail'>
          <div v-show='visible' class='fly-scrollbar__slider'
            ref='slider'>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'FlyScrollbar',
  data () {
    return {
      state: false,
      visible: false
    }
  },
  methods: {
    handleWheel () {
      if (this.content) {
        this.calcSliderMove()
        this.$emit('mousewheel')
      }
    },
    handleSliderDown ($event) {
      this.state = true
      this.lastPageY = $event.pageY
      this.content.style.userSelect = 'none'
    },
    handleSliderUp () {
      this.state = false
      this.content.style.userSelect = 'inherit'
    },
    handleSliderMove ($event) {
      if (this.state === true) {
        let offsetY = $event.pageY - this.lastPageY
        this.content.scrollTop += this.wrapHeight * (offsetY / (this.railHeight - this.slider.offsetHeight))
        this.lastPageY = $event.pageY
        setTimeout(this.calcSliderMove, 0)
        this.$emit('scroll')
      }
    },
    /** 计算滚动条的高度 */
    calcSliderHeight () {
      this.$refs.slider.style.height = `${this.rate * 100}%`
    },
    calcSliderMove () {
      const contentTop = this.content.scrollTop
      let sliderTop = contentTop * this.rate
      this.handleTranslate(sliderTop)
    },
    init () {
      this.rail = this.$refs.rail
      this.slider = this.$refs.slider
      this.content = this.$refs.content
      this.railHeight = this.rail.offsetHeight
      this.wrapHeight = this.content.scrollHeight
      this.rate = this.railHeight / this.wrapHeight
    },
    handleTranslate (value) {
      this.slider.style.transform = `translateY(${value}px)`
    },
    handleOver () {
      if (!this.content) {
        return
      }
      if (this.content.scrollHeight > this.content.offsetHeight) {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    layout () {
      this.$nextTick(() => {
        this.init()
        this.calcSliderHeight()
      })
    }
  },
  updated () {
    setTimeout(() => {
      this.layout()
    }, 1000 * 3)
  },
  mounted () {
    setTimeout(() => {
      this.layout()
    }, 1000 * 3)
    document.body.addEventListener('mouseup', (e) => {
      this.handleSliderUp(e)
    })
    document.body.addEventListener('mousemove', (e) => {
      this.handleSliderMove(e)
    })
  }
}
</script>
