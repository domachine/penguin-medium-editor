import { update } from 'penguin.js/actions'
import xtend from 'xtend'

const mountStyles = theme => {
  ;(() => {
    const link = document.createElement('link')
    link.setAttribute('id', 'medium-editor-style')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/css/medium-editor.min.css'
    link.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(link)
  })()
  ;(() => {
    const link = document.createElement('link')
    link.setAttribute('id', 'medium-editor-theme')
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/css/themes/${theme}.min.css`
    link.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(link)
  })()
}

const mountScriptAndStyles = (theme, fn) => {
  const el = document.querySelector('script#medium-editor-script')
  if (el) return fn()
  mountStyles(theme)
  const script = document.createElement('script')
  script.setAttribute('id', 'filestack-script')
  script.type = 'text/javascript'
  script.async = true
  script.onload = fn
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/js/medium-editor.min.js'
  document.getElementsByTagName('head')[0].appendChild(script)
}

export function render ({ field, innerHTML, store }) {
  let {
    fields: {
      [field]: value = (innerHTML || '')
    }
  } = store.getState()
  return value
}

export function mount (props, el) {
  const nonOpts = ['field', 'theme', 'save', 'destroy']
  const { field, theme = 'default' } = props
  let {
    fields: {
      [field]: innerHTML = (props.innerHTML || '')
    }
  } = props.store.getState()
  if (el.innerHTML !== innerHTML) el.innerHTML = innerHTML
  mountScriptAndStyles(theme, () => {
    const opts =
      Object.keys(props)
        .filter(k => nonOpts.indexOf(k) === -1)
        .reduce((opts, k) => xtend({}, opts, { [k]: props[k] }), {})
    const editor = new window.MediumEditor([el], opts)
    editor.subscribe('editableInput', (e, el) => {
      props.store.dispatch(update({ [field]: el.innerHTML }))
    })
  })
}
