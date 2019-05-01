import React, { Component } from "react";
import PropTypes from "prop-types";

class CreateMessage extends Component {
  onChange = e => {
    const { onChange } = this.props;
    onChange(e.currentTarget.value);
  };

  onSubmit = e => {
    e.preventDefault();

    this.saveMessage();
    this.updateScroll();
  };

  updateScroll() {
    var element = document.getElementById("messagelist_scrollbar");
    element.scrollTop = element.scrollHeight;
  }

  saveMessage = () => {
    const { onSubmit } = this.props;
    // Save
    this.updateScroll();
    onSubmit();
  };

  render() {
    return (
      <form
        className="form new-message"
        style={{ height: "35px", marginBottom: "-30px", marginTop: "-25px" }}
        onSubmit={this.onSubmit}
      >
        <textarea
          className="form w-75"
          onChange={this.onChange}
          value={this.props.message}
          style={{ height: "35px", marginBottom: "-30px", overflowY: "hidden" }}
        />
        <button
          type="submit"
          className="new-message__submit btn btn--reset btn--primary"
        >
          <i
            className="fas fa-paper-plane"
            style={{ color: "#851941", marginTop: "25px" }}
          />
        </button>
      </form>
    );
  }
}

CreateMessage.propTypes = {
  message: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CreateMessage;
