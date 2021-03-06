import React, {PropTypes} from 'react';
import classNames from 'classnames/bind';
import styles from '../../../sass/modules/vote/topic-item';

const cx = classNames.bind(styles);

const TopicItem = ({content, id, incrementCount, decrementCount, destroyTopic}) => {
  const onIncrement = () => {
    incrementCount(id);
  };
  const onDecrement = () => {
    decrementCount(id);
  };
  const onDestroy = () => {
    destroyTopic(id);
  };

  return (
    <li className={cx('topic-item')} key={id}>
      <span className={cx('topic')}>{content}</span>
      <button
        className={cx('button', 'increment')}
        onClick={onIncrement}>+
      </button>
      <button
        className={cx('button', 'decrement')}
        onClick={onDecrement}>-
      </button>
      <button
        className={cx('button', 'destroy')}
        onClick={onDestroy}>{String.fromCharCode(215)}</button>
    </li>
  );
};

TopicItem.propTypes = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  incrementCount: PropTypes.func.isRequired,
  decrementCount: PropTypes.func.isRequired,
  destroyTopic: PropTypes.func.isRequired
};

export default TopicItem;
