# penguin-medium-editor

> [medium-editor](https://github.com/yabwe/medium-editor/) is a clone of medium.com inline editor toolbar.

This plugin integrates this editor into your penguin.js based website.

## Installation

	$ npm i -S penguin-medium-editor

Then edit your `package.json` file to include the component and embed the middleware.

```json
{
  "penguin": {
    "components": {
      "MediumEditor": "penguin-medium-editor"
    }
  }
}
```

## Usage

Now you can use this as a component. Just place it onto a block element.

```html
<div data-component='MediumEditor' data-props='{"field":"my-image-field"}'>
  Default content of the field.
</div>
```

### Available props

* `field` - This field is **required**. It specifies which field the image url should be saved to.
* `theme` - The theme to use for the editor.

All other props are passed as options to the medium-editor constructor. [Read the docs](https://github.com/yabwe/medium-editor/#mediumeditor-options).