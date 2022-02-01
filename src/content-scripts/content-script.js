import copyToClipboard from 'clipboard-copy'
import stringFormat from 'string-format'
import { getCommentTemplates } from '../configuration'

function createCopyCommentButton () {
  const button = document.createElement('a')
  button.setAttribute('id', 'copy-comment-trigger')
  button.setAttribute('class', 'aui-button toolbar-trigger')
  button.setAttribute('original-title', 'Copy comment')
  button.addEventListener('click', async () =>
    copyToClipboard(await formatComment(getJiraIssueInfo()))
  )

  const icon = document.createElement('span')
  icon.setAttribute('class', 'icon aui-icon aui-icon-small aui-iconfont-copy')

  const triggerLabel = document.createElement('span')
  triggerLabel.setAttribute('class', 'trigger-label')

  const assistiveParagraph = document.createElement('p')
  assistiveParagraph.setAttribute('class', 'assistive')

  button.appendChild(icon)
  button.appendChild(triggerLabel)
  button.appendChild(assistiveParagraph)

  return button
}

function injectCopyCommentButton () {
  const copyCommentButton = document.querySelector('#copy-comment-trigger')
  if (copyCommentButton) return

  const jiraToolsElement = document.querySelector(
    '#opsbar-jira\\.issue\\.tools'
  )
  if (!jiraToolsElement) return

  jiraToolsElement.insertAdjacentElement(
    'afterbegin',
    createCopyCommentButton()
  )
}

function getJiraIssueInfo () {
  const project = document.querySelector('#project-name-val')?.innerText
  const issueKey = document.querySelector('#key-val')?.innerText
  const issueSummary = document.querySelector('#summary-val')?.innerText

  const fixVersions = [...document.querySelectorAll('#fixVersions-field > a')]
    .map((element) => element.innerText)
    .sort()
    .join('')

  const [, parentIssueKey, parentIssueSummary] =
    document
      .querySelector('#parent_issue_summary')
      ?.innerText.match(/^(.+?)\s+(.+)$/) ?? []

  return {
    project,
    issueKey,
    issueSummary,
    parentIssueKey,
    parentIssueSummary,
    fixVersions
  }
}

async function formatComment (issue) {
  const { defaultTemplate, parentIssueTemplate } =
    (await getCommentTemplates()) ?? {}

  const template =
    issue.parentIssueKey && issue.parentIssueSummary
      ? parentIssueTemplate
      : defaultTemplate

  return template ? stringFormat(template, issue) : null
}

;(function () {
  injectCopyCommentButton()

  const issueContainer = document.querySelector('.issue-container')
  const observer = new MutationObserver(injectCopyCommentButton)
  observer.observe(issueContainer, { childList: true, subtree: true })
})()
