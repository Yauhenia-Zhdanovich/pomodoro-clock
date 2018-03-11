class Timer{
    constructor(){
      this.workTimeDuration = 1500;
      this.breakTimeDuration = 300;
      this.intervalId = null;
      this.state = '';
      this.isActive = null;
      this.duration = null;
      this.dx = null;
      this.animation = 0;
      this.workColor = '#04756f';
      this.breakColor = '#ff2d00';
      this.color = '';
    }
    start(){
      this.animation = 0;
      this.state = 'work';
      this.duration = this.workTimeDuration-1;
      this.dx = this.calculateDx(this.workTimeDuration);
      timer.innerHTML = this.timeFormatter(this.duration);
      this.duration -= 1;
      this.isActive = true;
      this.animation+=this.dx;
      this.color = this.workColor;
      timer.classList.remove('break');
      timer.style.background = `linear-gradient(to top, ${this.color} 0%,${this.color} ${this.animation}%,#2e0927 ${this.animation}%, #2e0927 100%)`;
      this.animation+=this.dx;
      this.update();
    }
    update(){
      this.intervalId = setInterval(this.animate.bind(this),1000);
    }
    animate(){
      timer.style.background = `linear-gradient(to top, ${this.color} 0%,${this.color} ${this.animation}%,#2e0927 ${this.animation}%, #2e0927 100%)`;
        this.animation+=this.dx;
        timer.innerHTML = this.timeFormatter(this.duration);
        if(this.duration === 0){
          if(this.state === 'work'){
            this.state = 'break';
            this.color = this.breakColor;
            this.animation = 0;
            this.dx = this.calculateDx(this.breakTimeDuration);
            this.duration = this.breakTimeDuration  + 1;
            timer.classList.add('break');
          }else{
            this.state = 'work';
            this.animation = 0;
            this.color = this.workColor;
            this.dx = this.calculateDx(this.workTimeDuration);
            this.duration = this.workTimeDuration + 1;
            timer.classList.remove('break');
          }
        }
        this.duration -= 1;
    }
    pause(){
      this.isActive = false;
      clearInterval(this.intervalId);
    }
    timeFormatter(input){
      let minutes = Math.floor(input/60);
      let seconds = input - (minutes*60);
      seconds+='';
      if(seconds.length < 2){
        seconds = `0${seconds}`; 
      }
      return `${minutes}:${seconds}`;
    }
    calculateDx(duration){
      let framesCount = duration;
      return 100/framesCount;
    }
    setWorkTime(value){
      this.workTimeDuration = value;
    }
    getMinutes(value){
      return value/60;
    }
    getDuration(value){
      if(value === 'work'){
        return this.getMinutes(this.workTimeDuration)
      }else {
        return this.getMinutes(this.breakTimeDuration)
      }
    }
  }
  window.onload = ()=>{
    let clock = new Timer();
    let timer = document.getElementById('timer');
    let button = document.getElementById('minusButton');
    let workTime = document.getElementById('workTime');
    let breakTime = document.getElementById('breakTime');
    let breakSection = document.getElementById('breakSection');
    workTime.innerHTML = clock.getDuration('work');
    breakTime.innerHTML = clock.getDuration('break');
    let controls = document.getElementById('controls');
    let count =  (e,sign)=>{
      let targetElement;
      if(sign === '-'){
        targetElement = e.target.nextElementSibling;
      }else{
        targetElement = e.target.previousElementSibling;
      }
      let currentValue = targetElement.innerHTML;
      let parentId = e.target.parentNode.id;
      if(sign === '+' && currentValue >= 40 || sign === '-' && currentValue <=1 || clock.isActive){
        return;
      }else {
        switch(sign){
          case '+':currentValue = currentValue / 1 + 1;break;
          case '-':currentValue-=1;break;
          default:return;
        }
        targetElement.innerHTML = currentValue;
          if(parentId === 'break'){
            clock.breakTimeDuration = currentValue * 60;
            if(clock.state === 'break'){
              timer.innerHTML = currentValue;
            }
          }else{
            clock.workTimeDuration = currentValue * 60;
            if(clock.state === 'work' || clock.state === ''){
              timer.innerHTML = currentValue;
            }
          }
        clock.isActive = null;
      }
    }
    controls.addEventListener('click',(e)=>{
      let input = e.target.innerHTML;
      switch(input){
        case '+': count(e,'+');break;
        case '-': count(e,'-');break;
        default:return;
      }
    })
    timer.addEventListener('click',()=>{
    if(clock.isActive === null){
      clock.start();
    }else if(clock.isActive){
        clock.pause();
      }else{
        clock.isActive = true;
        clock.animate();
        clock.update();
      }
   });
  }