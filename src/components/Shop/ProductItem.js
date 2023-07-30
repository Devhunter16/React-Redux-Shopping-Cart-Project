import Card from '../UI/Card';
import classes from './ProductItem.module.css';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart-slice';

const ProductItem = (props) => {
  // Deconstructing props to use in our addToCartHandler() function.
  const { title, price, description, id } = props;

  // Calling useDispatch() which gives us a dispatch function we can execute.
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    // Passing an object to addItemToCart() as a payload. 
    // Learn more about payloads in cart-slice.js.
    dispatch(cartActions.addItemToCart({
      id: id,
      title: title,
      price: price,
      description: description 
    }));
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={ addToCartHandler }>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
