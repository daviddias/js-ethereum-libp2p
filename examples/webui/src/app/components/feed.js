import React, {Component, PropTypes} from 'react'
import {Card, Row, Col, Button, Glyph, Spinner} from 'elemental'
import {Link} from 'react-router'

export default class Feed extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderCard = (item) => {
    return (
      <Row key={item.hash}>
        <Col sm='1' md='1/2' lg='1/2' className='feed__item'>
          <Card>
            <Row>
              <Col>
                <span className='feed__title'>{item.title}</span>
                {item.paper ? <Glyph icon='file-pdf' type='primary' /> : ''}
              </Col>
            </Row>
            <Row>
              <Col>
                by <span className='feed__author'>{item.author}</span>
              </Col>
            </Row>
            {item.year ? (
              <Row>
                <Col>
                  published in <span className='feed__year'>{item.year}</span>
                </Col>
              </Row>
             ) : ''}
            <Row className='feed__buttons'>
              <Col>
                <Button
                  type='hollow-primary'
                  component={<Link to={`/paper/${item.hash}`}>Read</Link>}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading your papers
      </div>
    )

    if (this.props.feed && this.props.feed.length > 0) {
      feed = this.props.feed.map(this._renderCard)
    }
    return (
      <Row className='feed'>
        <Col sm='1' md='1' lg='1'>
          {feed}
        </Col>
      </Row>
    )
  }
}
