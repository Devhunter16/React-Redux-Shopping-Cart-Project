import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from './store/ui-slice';

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
    const sendCartData = async () => {
      // Dispatching an action (in this case a notification) to the user.
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!'
      }));
      // We didn't have the "cart" node defined in Firebase before, but by adding
      // "cart.json" to "https://react-http-1b7e7-default-rtdb.firebaseio.com/" that node 
      // is created for us in Firebase. We use a PUT rather than a POST request here because
      // that way the new data will not be added in a list of data, but rather it will 
      // override the existing data with the incoming data, which is what we want to do in
      // this app.
      const response = await fetch(
        'https://react-http-1b7e7-default-rtdb.firebaseio.com/cart.json',
        { method: 'PUT', body: JSON.stringify(cart) }
      );

      // If there is anything wrong with the response throw an error, otherwise continue.
      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      // Dispatching another notification to the user.
      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!'
      }));
    };

    // If this is the first time loading the page, stop here so we don't send the empty
    // cart data and get a confusing notification telling us the cart data was sent.
    if (isInitial) {
      // Set isInitial to false so that we don't everr hit this if statement again after
      // initially loading our page.
      isInitial = false;
      return;
    };

    // Because sendCartData is an async function it returns a promise, so we can call
    // catch on it. Here we're catching any errors that slipped past out if statement.
    sendCartData().catch((error) => {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Sending cart data failed.'
      }));
    });
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
