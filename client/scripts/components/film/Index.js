import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames/bind';
import bootstrap from '../../bootstrapCss';
import filmStyle from '../../../sass/modules/film'
const cx = classNames.bind(filmStyle);

class Film extends Component {
  static propTypes = {
    filmActions: PropTypes.object,
    allFilmList: PropTypes.object,
    popularityFilmList: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'all'
    };

    this.name = '';
    this.animations = ['example-opacity', 'example-fade-in', 'example-burst-in'];
  }

  componentWillMount() {
    this.switchTab('all')();
  }

  switchTab = (type) => {
    return (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const {
        filmActions
      } = this.props;

      //切换之前先清空
      filmActions.cleanFilmList(this.state.type);

      this.setState({
        activeTab: type
      });

      filmActions.getFilmList(type);
    };
  };

  renderList() {
    const {
      allFilmList, popularityFilmList
    } = this.props;

    const {activeTab} = this.state;
    const film = activeTab === 'all' ? allFilmList : popularityFilmList;
    const entities = film.get('entities');

    if (!entities) {
      return (
        <div className={cx('page-loading')}>载入中，请稍后 ...</div>
      );
    } else if (entities.size === 0) {
      return (
        <div>
          <p>无记录</p>
        </div>
      );
    }

    return (
      <ul className={bootstrap('list-group')}>
        {
          //item 是每条记录，index 下标值，list 所有数据
          entities.map((item, index, list) => {
            return (
              <li key={item.get('id')} className={bootstrap('list-group-item')}>
                <a href={item.get('link')} target="_blank">{item.get('name')}</a>
              </li>
            );
          })
        }
      </ul>
    )
  }

  render() {
    const {activeTab} = this.state;

    const random = Math.ceil(Math.random() * 10);
    let index = 0;
    if (random > 4 && random < 8) {
      index = 1;
    } else if (random >= 8) {
      index = 2;
    }
    const transitionName = this.animations[index];

    /**
     * react 动画结合 css Module，解决的方法有两种，利用 :global 设置全局 css
     * 指定 transitionName 为 对象 Object prop。详见
     * https://github.com/css-modules/css-modules/issues/84
     */
    return (
      <div className={bootstrap('container')}>
        <ul className={bootstrap('nav', 'nav-pills')}>
          <li className={bootstrap('nav-item')}>
            <a className={bootstrap('nav-link', activeTab === 'all' ? 'active' : '')}
               onClick={this.switchTab('all')}>全部</a>
          </li>
          <li className={bootstrap('nav-item')}>
            <a className={bootstrap('nav-link', activeTab === 'popularity' ? 'active' : '')}
               onClick={this.switchTab('popularity')}>人气</a>
          </li>
        </ul>
        <ReactCSSTransitionGroup
          component="div"
          transitionName={transitionName}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}>
          <div className={bootstrap('tab-content', 'm-t-1')} key={activeTab}>
            {this.renderList()}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Film;
