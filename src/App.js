import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function App() {
  // Here useSelector is passed  a function which recieves the current state and returns
  // the data which we want to use and track in this component. 
  const cartIsVisible = useSelector(state => state.ui.cartIsVisible);

  // Using useSelector() to get ahold of our overall cart from our data store.
  const cart = useSelector(state => state.cart);

  // Adding "cart" as a dependency to useEffect() here so that it re-executes whenever
  // our cart changes. The great thing is that useSelector() sets up a subscription to
  // our Redux data store so that whenever the Redux store does change, our "cart"
  // variable in this file changes as well.
  useEffect(() => {
    // We didn't have the "cart" node defined in Firebase before, but by adding
    // "cart.json" to "https://react-http-1b7e7-default-rtdb.firebaseio.com/" that node 
    // is created for us in Firebase. We use a PUT rather than a POST request here because
    // that way the new data will not be added in a list of data, but rather it will 
    // override the existing data with the incoming data, which is what we want to do in
    // this app.
    fetch(
      'https://react-http-1b7e7-default-rtdb.firebaseio.com/cart.json',
      { method: 'PUT', body: JSON.stringify(cart) }
    );
  }, [cart]);

  return (
    <Layout>
      {cartIsVisible && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
