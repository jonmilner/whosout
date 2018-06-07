import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  content: PropTypes.node.isRequired
};

const defaultProps = {};

export default class Page extends React.Component {
  render() {
    const { content } = this.props;

    return <React.Fragment>{content}</React.Fragment>;
  }
}

Page.propTypes = propTypes;
Page.defaultProps = defaultProps;
