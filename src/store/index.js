// Importing the configureStore function from redux toolkit
import { configureStore } from '@reduxjs/toolkit';

// Importing the slices of our data store
import uiSlice from './ui-slice';
import cartSlice from './cart-slice';

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        cart: cartSlice.reducer
    }
});

export default store;

/*
const Subscriber = () => {
    const latestState = store.getState();
    console.log(latestState);
};

// Here we're making redux aware of our subscriber function and telling it that that
// function should be executed whenever our state changes. We do this by passing our 
// subscriber function to the .subscribe() method on our store.
store.subscribe(Subscriber);
*/