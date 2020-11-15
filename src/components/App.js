export default Vue.component('Game', {
  template: `
    <div class="app">
      <div class="app-board">
        <input class="app-addinput" v-model="newTimer">
        <button :disabled="!newTimer.length" @click="createTimer">Add</button>
        <br>
        <br>
      </div>
      <div class="app-timers">
        <div v-for="(timer, idx) in timers" class="app-timer" :class="{ 'app-timer--isrunning': timer.isRunning }">
          <div class="app-timer_name" v-text="timer.name"></div>
          <div class="app-timer_time">
            <div v-if="updatingTimerIdx === idx" class="app-timeboxes">
              <input min="0" type="number" class="app-timebox" v-model="updatingTime[0]">
              <input max="60" min="0" type="number" class="app-timebox" v-model="updatingTime[1]">
              <input max="60" min="0" type="number" class="app-timebox" v-model="updatingTime[2]">
              <button @click="updateTime">Save</button>
              <button @click="resetTime">Reset</button>
            </div>
            <div v-else @click="selectTimerTime(idx)" v-text="representSeconds(timer.time)"></div>
          </div>
          <button class="app-timer_run" @click="timerToggle(idx)" v-text="timer.isRunning ? 'Stop' : 'Run'"></button>
          <button class="app-timer_delete" @click="deleteTimer(idx)">X</button>
        </div>
      </div>
    </div>
  `,
  components: { },
  data () {
    return {
      updatingTimerIdx: null,
      newTimer: '',
      updatingTime: [0,0,0],
      timers: [],
      timer: null
    }
  },
  mounted () {
    this.timers = JSON.parse(localStorage.getItem('timers')) || []
    localStorage.setItem('timers', JSON.stringify(this.timers.map((it) => {
      it.isRunning = false
      return it
    })))
  },
  methods: {
    timerToggle (idx) {
      this.timers = this.timers.map(((it, _idx) => {
        if (_idx === idx) {
          it.isRunning = !it.isRunning
        } else {
          it.isRunning = false
        }
        return it
      }))
      clearInterval(this.timer)
      if (this.timers[idx].isRunning) {
        return this.timer = setInterval(() => {
          this.timers[idx].time += 1
          this.updateStorage()
        }, 1000)
      }
    },
    createTimer () {
      this.timers.push({
        name: this.newTimer,
        time: 0,
        isRunning: false
      })
      this.newTimer = ''
      this.updateStorage()
    },
    deleteTimer (idx) {
      this.timers = this.timers.filter((it, _idx) => _idx !== idx)
      clearInterval(this.timer)
      this.updateStorage()
    },
    updateStorage () {
      localStorage.setItem('timers', JSON.stringify(this.timers))
    },
    representSeconds (secs) {
      return (new Date(secs * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
    },
    updateTime () {
      this.timers[this.updatingTimerIdx].time = this.updatingTime.reduce((acc,time) => (60 * acc) + +time)
      this.updatingTimerIdx = null
      this.updateStorage()
    },
    resetTime () {
      this.updatingTime = this.updatingTime.map(it => 0)
    },
    selectTimerTime (idx) {
      this.updatingTimerIdx = idx
      this.updatingTime = this.representSeconds(this.timers[idx].time).split(':').map(it => Math.abs(+it))
    }
  }
})
