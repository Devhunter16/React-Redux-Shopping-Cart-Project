import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendCartData } from './store/cart-slice';

// Defining a variable here that will help to NOT send the cart data a soon as we
// initially load the page so that we dont get a "Sent cart data successfully" right
// off the bat which would be confusing.
let isInitial = true;

function App() {
  const dispatch = useDispatch()

  // Here useSelector is passed a function which recieves the current state and returns
  // the data which we want to use and track in this component. 
  const cartIsVisible = useSelector(state => state.ui.cartIsVisible);

  // Using useSelector() to get ahold of our overall cart from our data store.
  const cart = useSelector(state => state.cart);

  // Subscribing to the notification state in our data store.
  const notification = useSelector(state => state.ui.notification);

  // Adding "cart" as a dependency to useEffect() here so that it re-executes whenever
  // our cart changes. The great thing is that useSelector() sets up a subscription to
  // our Redux data store so that whenever the Redux store does change, our "cart"
  // variable in this file changes as well.
  useEffect(() => {
    // If this is the first time loading the page, stop here so we don't send the empty
    // cart data and get a confusing notification telling us the cart data was sent.
    if (isInitial) {
      // Set isInitial to false so that we don't everr hit this if statement again after
      // initially loading our page.
      isInitial = false;
      return;
    };

    // Dispatching out sendCartData() function with the current state of the cart to our
    // Redux data store. the sendCartData() function returns a function. With redux-toolkit,
    // when we dispatch an action (in this case a function) which returns a function, it
    // will automatically execute the returned function and give us the "dispatch" argument
    // automatically (see cart-slice to see what I mean).
    dispatch(sendCartData(cart));
  }, [cart]);

  // Our initial state in the ui data store slice for notification is null, but if the'
  // state changes to not null we then show the notification.
  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
