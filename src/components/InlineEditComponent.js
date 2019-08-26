import React, { Component } from 'react'

export const contentEditable = WrappedComponent => {

  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        editing: false
      }
      this.dblClicked = false
    }

    singleClickHandler = (event) => {
      this.dblClicked = false
      setTimeout(() => {
        if (!this.dblClicked) {
          this.toggleEdit(event)
        }
      }, 500)
    }

    doubleClickHandler = (e) => {
      this.dblClicked = true
    }

    toggleEdit = (e) => {
      if (this.state.editing) {
        this.cancel()
      } else {
        this.edit()
      }
    }

    edit = () => {
      this.setState({
        editing: true
      }, () => {
        document.execCommand('selectAll', false, null)
        this.domElm.focus()
      })
    }

    save = () => {
      this.setState({ editing: false }, () => {
        const { onSave } = this.props
        if (onSave && this.isValueChanged()) {
          const result = onSave(this.domElm.textContent)
          if (result.then) {
            result.then(r => r === false && (this.domElm.textContent = this.props.value))
          } else if (result === false) {
            this.domElm.textContent = this.props.value
          }
        }
      })
    }

    cancel = () => {
      this.setState({ editing: false }, () => {
        window.getSelection().removeAllRanges()
        this.domElm.textContent = this.props.value
      })
    }

    isValueChanged = () => {
      return this.props.value !== this.domElm.textContent
    }

    handleKeyDown = (e) => {
      const { key } = e
      switch (key) {
        case 'Enter':
          this.save()
          break
        case 'Escape':
          this.cancel()
          break
      }
    }

    render() {
      const { editing } = this.state
      const { editOnClick = true, onSave, editStyle = {}, style, ...restProps } = this.props

      return (
        <WrappedComponent
          onClick={editOnClick ? this.singleClickHandler : undefined}
          onDoubleClick={this.doubleClickHandler}
          contentEditable={editing}
          ref={(domNode) => {
            this.domElm = domNode
          }}
          onBlur={this.cancel}
          onKeyDown={this.handleKeyDown}
          suppressContentEditableWarning="true"
          style={{ ...style, ...(editing ? editStyle : {} ) }}
          {...restProps}
        >
          {this.props.value}
        </WrappedComponent>
      )
    }
  }
}
