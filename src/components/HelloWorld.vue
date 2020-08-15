<template>
  <div>
    Select a color:
  </div>
  <div  style="display: flex; flex-direction: column;">
    <div v-for="(color, index) in wheelColors" style="display: flex; height: 40px;">
      <div :style="{width: '100px', height: '100px', backgroundColor: color, transform: transform(index),}">{{ color }}</div>
    </div>
  </div>
  <div  style="display: flex; flex-direction: column;">
    <div v-for="bucket in colors" style="display: flex; height: 40px; ">
      <div v-for="color in bucket" :style="{width: '100px', height: '100px', backgroundColor: color}"> {{ color }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
      start: 0x000,
      end: 0xFFF,
      primary: null
    }
  },
  created() {
    /*
    const base = 0x001;
    const base2 = 0xFFF;
    //console.log((base << 4) - 1, '#' + ((base << 4) - 1).toString(16).padStart(3, '0'));

    console.log(((base << 12) - 1) - (base << 12) + 16, '#' + parseInt(((base << 12) - 1) - (base << 12) + 16).toString(16).padStart(3, '0'));
    console.log((base << 7) - 1, '#' + ((base << 7) - 1).toString(16).padStart(3, '0'));
    console.log((base << 8) - 1, '#' + ((base << 8) - 1).toString(16).padStart(3, '0'));
    console.log((base << 8) - 9, '#' + parseInt((base << 8) - 9).toString(16).padStart(3, '0'));
    console.log((base << 8) - 16, '#' + parseInt((base << 8) - 16).toString(16).padStart(3, '0'));
    console.log((base << 11) - 16, '#' + parseInt((base << 11) - 16).toString(16).padStart(3, '0'), 8);
    console.log((base << 12) - 16, '#' + parseInt((base << 12) - 16).toString(16).padStart(3, '0'));
    console.log(((base << 12) - 1) - (base << 7) + 1, '#' + parseInt(((base << 12) - 1) - (base << 7) + 1).toString(16).padStart(3, '0'));
    console.log(((base << 12) - 1) - (base << 8) + 1, '#' + parseInt(((base << 12) - 1) - (base << 8) + 1).toString(16).padStart(3, '0'));
    console.log(((base << 12) - 1) - (base << 8) + 8, '#' + parseInt(((base << 12) - 1) - (base << 8) + 8).toString(16).padStart(3, '0'));
    console.log(((base << 12) - 1) - (base << 8) + 16, '#' + parseInt(((base << 12) - 1) - (base << 8) + 16).toString(16).padStart(3, '0'));
    console.log(((base << 12) - 1) - (base << 11) - 240, '#' + parseInt(((base << 12) - 1) - (base << 11) - 240).toString(16).padStart(3, '0'));
    console.log(base ^ 8 ^ 2);
    console.log('1' ,0xff0, 0x00f, '#' + 0xff0.toString(16), '#' + 0x00F.toString(16), 0xff0 - 0x00f, 127 - 15);
    console.log('2', 0xf80, 0x07f, '#' + 0xf80.toString(16), '#' + 0x07f.toString(16), 0xf80 - 0x07f,( 0xff0 - 0x00f) - (0xf80 - 0x07f),  0x7f - 0x0F, 0xff0 - 0xf80);
    console.log('3', 0xf00, 0x0ff, '#' + 0xf00.toString(16), '#' + 0x0ff.toString(16), 0xf00 - 0x0ff,( 0xf80 - 0xf00), 0x7f - 0x01);
    console.log('4', 0xf07, 0x0f7, '#' + 0xf07.toString(16), '#' + 0x0f7.toString(16), 0xf07 - 0x07f, 0x7f - 0x01);
*/
  },
  computed: {
    colors() {
      let current = this.start;
      let all_colors = [];
      let current_bucket = [];//'#00' + current];
      let i = 0;
      while (current <= this.end) {
        current_bucket.push('#' + current.toString(16).padStart(3, '0'));
        current += 0x1;

        if (i >= 15) {
          all_colors.push(current_bucket);
          current_bucket = [];
          i = 0;
        } else {
          i += 1;
        }
      }
      console.log(all_colors.length);
      return all_colors;
    },
    wheelColors() {
      let wheel_colors = [
        this.colors[0][15],    // 8
        this.colors[7][15],    // 8
        this.colors[15][15],   // 16
        this.colors[15][7],    // 16
        this.colors[15][0],    // 16
        this.colors[127][0],   // 128
        this.colors[255][0],   // 256
        this.colors[248][0],   // 248 : 256 - 8
        this.colors[240][0],   // 240 : 256 - 16
        this.colors[240][7],   // 240 : 256 - 16
        this.colors[240][15],  // 240 : 256 - 16
        this.colors[112][15]   // 112 : 128 - 16
      ];
      return wheel_colors;
    }

  },
  methods: {
    transform(index) {
      let rotation = "rotateZ(-" + (index * 30) + "deg) ";
      let translation = "";
      let x_translation = 0;
      let y_translation = 0;
      switch (index) {
        case 0:
          x_translation = 50;
          y_translation = 50;
          break;
        case 1:
          x_translation = 82;
          y_translation = 127.5;
          break;
        case 2:
          x_translation = 168;
          y_translation = 175;
          break;
        case 3:
          x_translation = 286;
          y_translation = 168;
          break;
        case 4:
          x_translation = 404;
          y_translation = 97;
          break;
        case 5:
          x_translation = 490;
          y_translation = -30;
          break;
        case 6:
          x_translation = 522.5;
          y_translation = -187;
          break;
        case 7:
          x_translation = 490.5;
          y_translation = -346;
          break;
        case 8:
          x_translation = 403.5;
          y_translation = -471;
          break;
        case 9:
          x_translation = 285;
          y_translation = -542;
          break;
        case 10:
          x_translation = 167;
          y_translation = -550;
          break;
        case 11:
          x_translation = 82;
          y_translation = -509;
          break;
          default:
            break;
      }
      translation += "translateX(" + x_translation + "px) ";
      translation += "translateY(" + y_translation + "px) ";
      rotation += "rotateX(30deg)";
      return translation + rotation;//; + " skew(20deg, 20deg)";
      //if (index > this.currentItem) {
        //return "rotateY(" + ((index * 2) + 50) + "deg) " + "translateX(-" + (index * 45) + "px)"; //(220 + -(index * 20)) + "px)";
      //} else if (index < this.currentItem) {
        //return "rotateY(-" + ((index * 2) + 50) + "deg) " + "translateX(" + (220 - (index * 40)) + "px)";
      //} else {
        //return "rotate(0deg)";
      //}
    },
  }
}
</script>

<style scoped>
</style>