import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

// Defining our starting cart state
const initialCartState = {
    items: [],
    totalQuantity: 0,
};

// createSlice prepares a slice of our global state. It takes an object as an argument.
// Every slice requires a "name" property within that object. It
// also requires an initial state (for ours we're just using our already-defined initial
// state). We need reducer functions as well. Each reducer function we define within 
// createSlice automatically recieves the current state. Unlike reducer functions we
// define outside of createSlice, the ones we define here can directly manipulate the 
// current state in order to update it without causing bugs (redux toolkit handles this
// for us).
const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addItemToCart(state, action) {
            // Payload is whatever value we're going to be passing to this function when we
            // use it in another file. "Payload" is from redux-toolkit, it is essentially
            // any extra data you added to the action.
            const newItem = action.payload;
            // We're checking whether or not the item exists within the "items" array already
            // and if it does we increase the quantity of that existing item rather than
            // creating a new one.
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            // If we do not find the item within our array, then we add it to the array.
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            // We're checking whether or not the item exists within the "items" array already
            // and if it does we store that items in the existingItem variable.
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                // Filtering our items array by finding the item in the array that's id
                // matches the id we passed into removeItemFromCart, then state.items
                // becomes a new array without that item in it.
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        }
    }
});

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

// Exporting cartSlice.actions here which gives us access to actions that
// automatically trigger our reducer functions we defined using createSlice().
// We want to access these actions in other components so we can update the data
// store using those components.
export const cartActions = cartSlice.actions;

export default cartSlice;