<template>
  <div class="encoder">
    <div class="input-container">
      <h2 class="title">8-3 编码器</h2>
      <el-checkbox-group v-model="inputValues" @change="encode">
        <el-checkbox :label="index" :key="index" class="input-checkbox" v-for="(input, index) in 8">
          Input {{ index }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="output-container">
      <div class="output" v-for="(output, index) in outputs" :key="index">
        <div class="output-value">{{ output }}</div>
        <!-- <div class="label">Output {{ index }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
// 这个是引入ElementUI框架的,在main.js里引入也行，在这里也行。我引入在main.js了，这就注掉了

// // 引入ElementUI组件库
// import ElementUI from 'element-ui';
// // 引入ElementUI全部样式
// import 'element-ui/lib/theme-chalk/index.css';
// //应用ElementUI
// Vue.use(ElementUI);


export default {
  name: 'bianmaqi',
  data() {
    return {
      inputs: [false, false, false, false, false, false, false, false],
      inputValues: [],
      outputs: [0, 0, 0],
    };
  },
  methods: {
    encode() {
      // 每次接收输入都把当前输入保存在inputs里，要先全置为false,要不然可能会有上一次数据残留
      this.inputs = [false, false, false, false, false, false, false, false]
      for (let i = 0; i < this.inputValues.length; ++i) {
        this.inputs[this.inputValues[i]] = true;
      }
      console.log(this.inputValues)
      console.log(this.inputs)
      // 对应输出逻辑 取反什么的，这个逻辑我不太懂是怎么来的
      this.outputs.splice(0, 1, !(!this.inputs[4] | !this.inputs[5] | !this.inputs[6] | !this.inputs[7]) ? '1' : '0')
      this.outputs.splice(1, 1, !(!this.inputs[2] | !this.inputs[3] | !this.inputs[6] | !this.inputs[7]) ? '1' : '0')
      this.outputs.splice(2, 1, !(!this.inputs[1] | !this.inputs[3] | !this.inputs[5] | !this.inputs[7]) ? '1' : '0')
    },
  },
};
</script>

<style scoped>
.encoder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to bottom right, #dcdde1, #f5f6fa);
  border-radius: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 50px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #273c75;
  text-align: center;
  text-shadow: 1px 1px #fff;
}

.inputs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}

.input-checkbox {
  margin: 10px;
  color: #273c75;
  font-size: 28px;
}

.el-checkbox {
  width: 100%;
}

.output-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.output {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.label {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  color: #273c75;
  text-shadow: 1px 1px #fff;
}

.output-value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 1px 1px #fff;
  transition: all 0.3s ease-in-out;
}

.output-value.true {
  background: linear-gradient(to bottom right, #e84118, #c23616);
  border-color: #c23616;
  color: #fff;
  text-shadow: 1px 1px #000;
}

.output-value-fade-enter-active {
  animation: fadeIn 0.3s;
}

.output-value-fade-leave-active {
  animation: fadeOut 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>