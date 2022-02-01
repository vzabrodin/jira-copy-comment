<template lang="pug">
v-container
  v-container.d-flex.flex-wrap
    v-card.my-2.mr-2
      v-card-title Allowed URLs
      v-card-text(v-if="!allowedUrls.length") The list is empty
      v-list(v-else)
        v-list-item(v-for="item in allowedUrls", :key="item.value")
          template
            v-list-item-action
              v-checkbox(v-model="item.enabled")
            v-list-item-content
              v-list-item-title(v-text="item.value")
            v-list-item-action
              v-btn(icon)
                v-icon edit
            v-list-item-action
              v-btn(icon, @click="removeAllowedUrl(item)")
                v-icon delete
      v-container.d-flex.align-baseline
        v-text-field(label="URL pattern", v-model="newUrl")
        v-btn.ml-3(@click="addAllowedUrl") Add
    v-card.my-2.ml-2
      v-card-title Comment templates
      v-container
        v-text-field(
          label="Default template",
          v-model="commentTemplates.defaultTemplate"
        )
        v-text-field(
          label="Parent issue template",
          v-model="commentTemplates.parentIssueTemplate"
        )
      v-card-text Supported variables:
        ul
          li(v-for="(item, index) in supportedVariables", :key="index") {{ item }}
  v-container
    v-btn(@click="save") Save
</template>

<script>
import {
  get as getConfiguration,
  set as setConfiguration
} from '../../configuration'

export default {
  name: 'Home',
  data: () => ({
    supportedVariables: [
      '{project}',
      '{issueKey}',
      '{issueSummary}',
      '{parentIssueKey}',
      '{parentIssueSummary}',
      '{fixVersions}'
    ],
    allowedUrls: [],
    commentTemplates: {
      defaultTemplate: '',
      parentIssueTemplate: ''
    },
    newUrl: ''
  }),
  methods: {
    getConfiguration,
    setConfiguration,
    addAllowedUrl () {
      this.allowedUrls = [
        ...this.allowedUrls,
        { enabled: true, value: this.newUrl }
      ]
      this.newUrl = ''
    },
    removeAllowedUrl (itemToRemove) {
      this.allowedUrls = this.allowedUrls.filter(
        (item) => item !== itemToRemove
      )
    },
    async save () {
      await this.setConfiguration({
        allowedUrls: this.allowedUrls,
        commentTemplates: this.commentTemplates
      })
    }
  },
  async mounted () {
    const { allowedUrls, commentTemplates } = await this.getConfiguration()

    this.allowedUrls = allowedUrls ?? []

    this.commentTemplates = {
      defaultTemplate: '',
      parentIssueTemplate: '',
      ...commentTemplates
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-card {
  min-width: 500px;
  min-height: 500px;
  max-height: 500px;
}
</style>
