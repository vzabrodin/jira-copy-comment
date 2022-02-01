<template lang="pug">
v-app
  v-app-bar(app, color="primary", dark)
    v-app-bar-title JIRA Copy Comment

    v-spacer

    v-btn(
      href="https://github.com/vuetifyjs/vuetify/releases/latest",
      target="_blank",
      text
    )
      span.mr-2 GitHub
      v-icon open_in_new

  v-main
    router-view
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
