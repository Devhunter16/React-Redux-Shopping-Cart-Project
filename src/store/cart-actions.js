import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

// This is an action creator. It returns another function that recieves the dispatch
// function as an argument. 
export const sendCartData = (cart) => {
    return async (dispatch) => {
        // Dispatching an action (in this case a notification) to the user.
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'Sending...',
            message: 'Sending cart data!'
        }));

        const sendRequest = async () => {
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
            };
        };

        try {
            await sendRequest();

            // Dispatching a notification to the user if we successfully send the req.
            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sent cart data successfully!'
            }));
        } catch (error) {
            // Because sendCartData is an async function it returns a promise, so we can call
            // catch on it. Here we're catching any errors that slipped past out if statement.
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed.'
            }));
        }
    };
};

export const fetchCartData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                'https://react-http-1b7e7-default-rtdb.firebaseio.com/cart.json'
            );

            if (!response.ok) {
                throw new Error('Could not fetch cart data!')
            };

            const data = await response.json();

            return data;
        };

        try {
            const cartData = await fetchData();

            // Check if cartData has items, otherwise initialize it as an empty array.
            const items = cartData.items || [];

            dispatch(cartActions.replaceCart({
                items: items,
                totalQuantity: cartData.totalQuantity
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Fetching cart data failed.'
            }));
        }
    };
};