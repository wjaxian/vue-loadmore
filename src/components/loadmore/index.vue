<style lang="scss" scoped>
.loadmore {
  overflow-y: auto;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  user-select: none;
  .loadmore-content {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    background: #f5f5f5;
    position: relative;
  }
  .loading, .pull, .drop {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    text-align: center;
    line-height: 40px;
    z-index: -1;
    font-size: 14px;
  }
  .top-loading-text {
    top: -40px;
  }
  .bottom-loading-text {
    bottom: 0px;
  }
}
</style>

<template>
  <section class="loadmore" ref="loadmore">
    <section class="loadmore-content" ref="list" :style="style">
      <section class="loading top-loading-text" v-if="topLoading" v-html="topLoadingText"></section>
      <section class="pull" :style="{top: `-40px`}" v-if="topPull" v-html="topPullText"></section>
      <section class="drop" :style="{top: `-40px`}" v-if="topDrop" v-html="topDropText"></section>
      <slot></slot>
    </section>
    <section v-if="bottomDrop" class="drop" :style="{bottom: `${0}px`}" v-html="bottomDropText"></section>
    <section v-if="bottomPull" class="pull" :style="{bottom: `${0}px`}" v-html="bottomPullText"></section>
    <section v-if="bottomLoading" class="loading bottom-loading-text" v-html="bottomLoadingText"></section>
  </section>
</template>

<script>
export default {
  name: 'loadmore',
  data () {
    return {
      style: {},
      direction: '',
      touchstart: 'touchstart',
      touchmove: 'touchmove',
      touchend: 'touchend',
      loadmore: null,
      list: null,
      dY: 0,
      mY: 0,
      bottomLoading: false,
      bottomPull: false,
      bottomDrop: false,
      topLoading: false,
      topPull: false,
      topDrop: false,
      topOn: false,
      bottomOn: false,
      scrollOn: true
    }
  },
  computed: {
    isMobile () {
      return /Mobile/ig.test(window.navigator.userAgent)
    }
  },
  props: {
    //提前触发到底事件的高度，默认到底触发（手机端建议默认此参数）
    earlyTrigger: {
      type: Number,
      validater (v) {
        return v >= 0
      },
      default () {
        return 0
      }
    },
    //手指移动距离和组件滚动之间的比率
    distanceIndex: {
      type: Number,
      default () {
        return 3
      }
    },
    //更新完，设置此参数不再触发 topMethod 方法
    topAllLoaded: {
      type: Boolean,
      default () {
        return true
      }
    },
    //下拉刷新的高度
    topDistance: {
      type: Number,
      validater (v) {
        return v > 40
      },
      default () {
        return 60
      }
    },
    //上拉加载的高度
    bottomDistance: {
      type: Number,
      validater (v) {
        return v > 40
      },
      default () {
        return 60
      }
    },
    //加载完，设置此参数不再触发 bottomMethod 方法
    bottomAllLoaded: {
      type: Boolean,
      default () {
        return false
      }
    },
    //是否自动填充内容
    autoFill: {
      type: Boolean,
      default () {
        return true
      }
    },
    //下拉刷新提示内容，可传入HTML
    topPullText: {
      type: String,
      default () {
        return '↓ 下拉刷新'
      }
    },
    //下拉刷新到达指定高度提示内容，可传入HTML
    topDropText: {
      type: String,
      default () {
        return '释放更新'
      }
    },
    //下拉更新中提示内容，可传入HTML
    topLoadingText: {
      tye: String,
      default () {
        return '更新中...'
      }
    },
    //上拉加载提示内容，可传入HTML
    bottomPullText: {
      type: String,
      default () {
        return '↑ 上拉加载'
      }
    },
    //上拉加载到达指定高度提示内容，可传入HTML
    bottomDropText: {
      type: String,
      default () {
        return '释放更新'
      }
    },
    //上拉加载中提示内容，可传入HTML
    bottomLoadingText: {
      type: String,
      default () {
        return '加载中...'
      }
    },
    //下拉刷新，触发方法
    topMethod: {
      type: Function,
      default: () => {}
    },
    //上拉加载，触发方法
    bottomMethod: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    //偏移元素
    deviationElement (distance, isAnimation) {
      this.style = isAnimation && {
        transform: `translate3d(0, ${ distance }px, 0)`,
        transition: 'transform .3s ease'
      } || {
        transform: `translate3d(0, ${ distance }px, 0)`
      }
    },
    //底部加载完成后调用，关闭加载状态
    onBottomLoadedSuccess () {
      this.bottomLoading = this.bottomDrop = this.bottomPull = false
      this.deviationElement(0, true)
    },
    //顶部加载完成后调用，关闭加载状态
    onTopLoadedSuccess () {
      this.topLoading = this.topDrop = this.topPull = false
      this.deviationElement(0, true)
    },
    //手指（鼠标按键）抬起
    removeEv () {
      //上拉释放
      if (this.direction == 'up') {
        if (this.bottomDrop) {
          this.deviationElement(-40, true)
          setTimeout(() => {
            this.bottomDrop = this.bottomPull = false
            this.bottomLoading = true
            this.bottomMethod()
          }, 300)
        } else {
          this.deviationElement(0, true)
          setTimeout(() => {
            this.bottomLoading = this.bottomDrop = this.bottomPull = false
          }, 300)
        }
      } else if (this.direction == 'down') {//下拉释放
        if (this.topDrop) {
          this.deviationElement(40, true)
          setTimeout(() => {
            this.topDrop = this.topPull = false
            this.topLoading = true
            this.topMethod()
          }, 300)
        } else {
          this.deviationElement(0, true)
          setTimeout(() => {
            this.topLoading = this.topDrop = this.topPull = false
          }, 300)
        }
      }
      this.loadmore.removeEventListener(this.touchmove, this.moveEv)
      this.loadmore.removeEventListener(this.touchend, this.removeEv)
    },
    //手指（鼠标）按下事件
    startEv (e) {
      e = e || window.event
      this.dY = this.isMobile && e.touches[0].pageY || e.pageY
      this.topOn = this.bottomOn = true
      this.loadmore.addEventListener(this.touchmove, this.moveEv)
      this.loadmore.addEventListener(this.touchend, this.removeEv)
    },
    //手指（鼠标按住拖动）滑动事件
    moveEv (ev) {
      ev = ev || window.event
      this.mY = this.isMobile && ev.touches[0].pageY || ev.pageY
      let sT = this.loadmore.scrollTop,
          prevent = false
      //下拉更新
      if ((this.mY - this.dY) > 0) {
        this.direction = 'down'
        if (sT <= 0) {
          prevent = true
          if (this.topOn) {
            this.topOn = false
            this.dY = this.mY
          }

          let top = (this.mY - this.dY) / this.distanceIndex
          this.deviationElement(top)
          if ((top > 0) && (top < this.topDistance) && !this.topAllLoaded) {
            this.topLoading = this.topDrop = false
            this.topPull = true
          } else if ((top > this.topDistance) && !this.topAllLoaded) {
            this.topLoading = this.topPull = false
            this.topDrop = true
          }
        }
      } else {//上拉加载
        this.direction = 'up'
        let h = this.loadmore.clientHeight - this.list.scrollHeight
          
        if (Math.abs(h) <= sT) {
          prevent = true
          if (this.bottomOn) {
            this.bottomOn = false
            this.dY = this.mY
            this.$emit('bottomStatusChange', '到底啦')
          }

          let bottom = (this.mY - this.dY) / this.distanceIndex,
              absBottom = Math.abs(bottom)
          this.deviationElement(bottom)
          if ((absBottom > 0) && (absBottom < this.bottomDistance) && !this.bottomAllLoaded) {
            this.bottomLoading = this.bottomDrop = false
            this.bottomPull = true
          } else if ((absBottom > this.bottomDistance) && !this.bottomAllLoaded) {
            this.bottomLoading = this.bottomPull = false
            this.bottomDrop = true
          }
        }
      }

      prevent && ev.preventDefault()
    },
    //scorll 监听事件
    scrollEv () {
      let sH = this.list.scrollHeight,
          cH = this.loadmore.clientHeight,
          top = this.loadmore.scrollTop
      if ((sH - cH - this.earlyTrigger) <= top && this.scrollOn) {
        this.scrollOn = false
        this.$emit('bottomStatusChange', '到底啦')
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.isMobile) {
        this.touchstart = 'mousedown'
        this.touchmove = 'mousemove'
        this.touchend = 'mouseup'
      }
      this.loadmore = this.$refs.loadmore
      this.list = this.$refs.list
      //自动填充
      if ((this.loadmore.clientHeight > this.list.scrollHeight) && this.autoFill) {
        this.bottomMethod()
      }
      
      !this.earlyTrigger && this.loadmore.addEventListener(this.touchstart, this.startEv)
      this.earlyTrigger && this.loadmore.addEventListener('scroll', this.scrollEv)
    })
  },
  deactivated () {
    !this.earlyTrigger && this.loadmore.removeEventListener(this.touchstart, this.startEv)
  }
}
</script>