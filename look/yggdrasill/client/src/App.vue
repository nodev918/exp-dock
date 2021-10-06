<template>
  <div id="app">
    <select-username
      v-if="!usernameAlreadySelected"
      @input="onUsernameSelection"
    />
    <chat v-else />
  </div>
</template>

<script>
import SelectUsername from "./components/SelectUsername";
import Chat from "./components/Chat";
import socket from "./socket";
import helper from "./helper"

export default {
  name: "App",
  components: {
    Chat,
    SelectUsername,
  },
  data() {
    return {
      usernameAlreadySelected: false,
    };
  },
  methods: {
    onUsernameSelection(username) {
      const path = 'v1/login'
      const pkt = helper.doEncode(path, { token: username, device: 'xxx', userAgent: 'x/x/x/x/x' })
        console.log(`pkt: ${JSON.stringify(pkt)}`)
      socket.emit('v1/login', Buffer.from(pkt).buffer, data => {
        const ack = helper.doDecode(path, Buffer.from(data))
        console.log(`ack: ${JSON.stringify(ack)}`)
        this.usernameAlreadySelected = true;
      })
    },
  },
  created() {},
  destroyed() {},
};
</script>

<style>
body {
  margin: 0;
}

@font-face {
  font-family: Lato;
  src: url("/fonts/Lato-Regular.ttf");
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
