import classes from './CartButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui-slice';

const CartButton = (props) => {

  // Calling useDispatch() which gives us a dispatch function we can execute.
  const dispatch = useDispatch();

  // Getting the total cart quantity;
  // Here useSelector is passed a function which receives the current state and returns
  // the data which we want to use and track in this component. 
  const cartQuantity = useSelector(state => state.cart.totalQuantity);

  const toggleCartHandler = () => {
    dispatch(uiActions.toggle());
  };

  return (
    <button onClick={toggleCartHandler} className={classes.button}>
      <span>My Cart</span>
      <span className={classes.badge}>{cartQuantity}</span>
    </button>
  );
};

export default CartButton;
