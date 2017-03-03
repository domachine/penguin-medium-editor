import { update } from 'penguin.js'
import xtend from 'xtend'

const mountStyles = theme => {
  ;(() => {
    const el = document.querySelector('link#medium-editor-style')
    if (el) return
    const link = document.createElement('link')
    link.setAttribute('id', 'medium-editor-style')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/css/medium-editor.min.css'
    link.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(link)
  })()
  ;(() => {
    const el = document.querySelector('link#medium-editor-theme')
    if (el) return
    const link = document.createElement('link')
    link.setAttribute('id', 'medium-editor-theme')
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/css/themes/${theme}.min.css`
    link.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(link)
  })()
}

const mountScriptAndStyles = (theme, fn) => {
  const el = document.querySelector('script#medium-editor-script')
  if (el) {
    if (window.MediumEditor) fn()
    else el.onload = fn
    return
  }
  mountStyles(theme)
  const script = document.createElement('script')
  script.setAttribute('id', 'medium-editor-script')
  script.type = 'text/javascript'
  script.async = true
  script.onload = fn
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.22.2/js/medium-editor.min.js'
  document.getElementsByTagName('head')[0].appendChild(script)
}

export function render ({ store }, { field, innerHTML }) {
  let {
    fields: {
      [field]: value = (innerHTML || '')
    }
  } = store.getState()
  return value
}

export function mount ({ store }, props, el) {
  if (process.env.PENGUIN_ENV === 'production') return
  const nonOpts = ['field', 'theme']
  const { field, theme = 'default' } = props
  const refresh = () => {
    let {
      fields: {
        [field]: innerHTML = (props.innerHTML || '')
      }
    } = store.getState()
    if (el.innerHTML !== innerHTML) el.innerHTML = innerHTML
  }
  store.subscribe(refresh)
  refresh()
  mountScriptAndStyles(theme, () => {
    const opts =
      Object.keys(props)
        .filter(k => nonOpts.indexOf(k) === -1)
        .reduce((opts, k) => xtend({}, opts, { [k]: props[k] }), {})
    const editor = new window.MediumEditor([el], opts)
    editor.subscribe('editableInput', (e, el) => {
      store.dispatch(update({ [field]: el.innerHTML }))
    })
  })
}
