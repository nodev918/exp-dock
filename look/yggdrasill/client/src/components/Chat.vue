<template>
  <div>
    <div class="left-panel">
      <user
        v-for="user in users"
        :key="user.userID"
        :user="user"
        :selected="selectedUser === user"
        @select="onSelectUser(user)"
      />
    </div>
    <message-panel
      v-if="selectedUser"
      :user="selectedUser"
      @input="onMessage"
      class="right-panel"
    />
  </div>
</template>

<script>
import bigintJSON from "json-bigint"
import socket from "../socket";
import helper from '../helper';
import User from "./User";
import MessagePanel from "./MessagePanel";

export default {
  name: "Chat",
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [
        { userID: 'v1/snapshot', username: 'v1/snapshot', connected: false, messages: [], hasNewMessages: false },
        { userID: 'v1/init', username: 'v1/init', connected: true, messages: [], hasNewMessages: false },
        { userID: 'v1/chat/enter', username: 'v1/chat/enter', connected: true, messages: [], hasNewMessages: false }
      ]
    };
  },
  methods: {
    onMessage(content) {
      if (this.selectedUser) {
        const path = this.selectedUser.userID
        const pkt = helper.doEncode(path, bigintJSON.parse(content))
        console.log(`pkt: ${pkt}`)
        const buf = pkt ? Buffer.from(pkt).buffer : {}

        socket.emit(path, buf, data => {
          const ack = helper.doDecode(path, Buffer.from(data))
          this.selectedUser.messages.push({
            content: JSON.stringify(ack, undefined, 2),
            fromSelf: false,
          });
        });

        this.selectedUser.messages.push({
          content: JSON.stringify(JSON.parse(content), undefined, 2),
          fromSelf: true,
        });
      }
    },
    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
  },
  created() {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      const path = user.userID;
      socket.on(path, data => {
        const decoded = helper.doDecode(path, Buffer.from(data))
        console.log(`event: ${path}`)
        user.messages.push({
          content: JSON.stringify(decoded, undefined, 2),
          fromSelf: false,
        });
        if (user !== this.selectedUser) {
          user.hasNewMessages = true;
        }
      })
    }
  },
  destroyed() {},
};
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
