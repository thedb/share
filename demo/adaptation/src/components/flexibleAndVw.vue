<template>
  <div class="flexibleAndVw">
    <div>
      <div v-for="v,k in box" class="vw">{{v}}</div>
    </div>
    <div>
      <div v-for="v,k in box" class="rem">{{v}}</div>
    </div>
    <!-- <div>
      <div v-for="v,k in box" class="example">{{v}}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'flexibleAndVw',
  data () {
    return {
      box: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
      ]
    }
  }
}
</script>

<style lang="postcss" scoped>
/*
@svg square { 
  @rect { 
    fill: var(--color, black); 
    width: 100%;
    height: 100%; 
  } 
}
.example { 
  background: svg(square); 
}
*/

@svg oneborder { 
  @rect { 
    fill: var(--color, black); 
    width: 100%; 
    height: 100%; 
  } 
} 
.example { 
  width: 30px;
  height: 60px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  /*border: 1px solid transparent;*/
  border-image: svg(oneborder) 1 1 stretch;
}
</style>

<style lang="scss" scoped>
@function px2rem($px, $base-font-size: 75px) { 
  @return ($px / $base-font-size) * 1rem; 
}
.flexibleAndVw{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  .vw {
    width: 50px;
    height: 75px;
    border: 1px solid black;
  }
  .rem{
    width: px2rem(50px);
    height: px2rem(75px);
    border: 1px solid black;
  }
}
</style>
