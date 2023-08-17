import Card from '../UI/Card';
import classes from './ProductItem.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../store/cart-slice';

const ProductItem = (props) => {
  // Deconstructing props to use in our addToCartHandler() function.
  const { title, price, description, id } = props;

  // Calling useDispatch() which gives us a dispatch function we can execute.
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addToCartHandler = () => {
    // We must never mutate Redux state, especially outside of a reducer function as 
    // it can lead to bugs. To avoid doing that we've created a new contant which holds
    // the updated quantity without changing the quantity in the Redux data store (yet).
    const newTotalQuantity = cart.totalQuantity + 1;

    // Doing kind of the same thing here as above because we don't want to directly 
    // mutate the Redux state in the data store, and so we're taking the "items" array
    // from our slice of the data store and making a copy of it in a new constant that 
    // we can play with.
    const updatedItems = cart.items.slice();
    const existingItem = updatedItems.find((item) => item.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem }; // New object + copy existing properties to avoid state mutation
      updatedItem.quantity++;
      updatedItem.totalPrice = updatedItem.totalPrice + price;
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.id === id
      );
      updatedItems[existingItemIndex] = updatedItem;
    } else {
      updatedItems.push({
        id: id,
        price: price,
        quantity: 1,
        totalPrice: price,
        name: title,
      });
    }

    // Creating a new cart state with the new constant I've defined above
    const newCart = {
      totalQuantity: newTotalQuantity,
      items: updatedItems,
    };

    // Using the replaceCart() reducer function we defined in cart-slice.js to dispatch'
    // an action which updates the existing state with the new state.
    dispatch(cartActions.replaceCart(newCart));

    // and then send Http request
    // fetch('firebase-url', { method: 'POST', body: JSON.stringify(newCart) })

    // dispatch(
    //   cartActions.addItemToCart({
    //     id,
    //     title,
    //     price,
    //   })
    // );
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
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
